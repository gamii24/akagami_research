// Instagram FAQ Admin Page

// State object for authentication
const state = {
  isAuthenticated: false,
  user: null
}

let faqList = []
let editingId = null
let currentCategory = 'all'

const SNS_CATEGORIES = {
  instagram: { name: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F' },
  tiktok: { name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000' },
  youtube: { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000' },
  threads: { name: 'Threads', icon: 'fas fa-at', color: '#000000' },
  twitter: { name: 'Twitter(X)', icon: 'fab fa-x-twitter', color: '#000000' }
}

// Load all FAQ items
async function loadFAQList() {
  try {
    const url = currentCategory === 'all' 
      ? '/api/admin/instagram-faq'
      : `/api/admin/instagram-faq?category=${currentCategory}`
    
    const response = await fetch(url, {
      credentials: 'include'
    })
    
    if (response.ok) {
      faqList = await response.json()
      renderFAQList()
      updateCategoryButtons()
    } else {
      showToast('FAQ一覧の読み込みに失敗しました', 'error')
    }
  } catch (error) {
    showToast('FAQ一覧の読み込みに失敗しました', 'error')
  }
}

// Update category button states
function updateCategoryButtons() {
  const buttons = document.querySelectorAll('[data-category]')
  buttons.forEach(btn => {
    const category = btn.getAttribute('data-category')
    if (category === currentCategory) {
      btn.style.backgroundColor = '#e75556'
      btn.style.color = 'white'
      btn.classList.add('ring-2')
      btn.style.borderColor = '#e75556'
    } else {
      // Reset to default colors based on category
      const categoryColors = {
        'all': '#4b5563',
        'instagram': '#E4405F',
        'tiktok': '#000000',
        'youtube': '#FF0000',
        'threads': '#000000',
        'twitter': '#000000',
        'line': '#16a34a',
        'flame': '#dc2626',
        'anti': '#8b5cf6'
      }
      btn.style.backgroundColor = categoryColors[category] || '#4b5563'
      btn.style.color = 'white'
      btn.classList.remove('ring-2')
    }
  })
}

// Filter by category
function filterByCategory(category) {
  currentCategory = category
  loadFAQList()
}

// Get category badge HTML
function getCategoryBadge(category) {
  const cat = SNS_CATEGORIES[category] || SNS_CATEGORIES.instagram
  return `<span class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background-color: ${cat.color}20; color: ${cat.color}">
    <i class="${cat.icon} mr-1"></i>${cat.name}
  </span>`
}

// Render FAQ list
function renderFAQList() {
  const listContainer = document.getElementById('faq-list')
  
  if (faqList.length === 0) {
    listContainer.innerHTML = `
      <div class="text-center py-12" style="color: #9ca3af;">
        <i class="fas fa-inbox text-5xl mb-4"></i>
        <p>FAQがまだありません</p>
      </div>
    `
    return
  }
  
  listContainer.innerHTML = faqList.map((faq, index) => `
    <div class="rounded-lg shadow-lg p-4 sm:p-6 border-l-4 transition-all duration-300" style="background-color: #2d2d2d; border-color: ${faq.is_published ? '#16a34a' : '#4b5563'};">
      <div class="flex items-start justify-between gap-4 mb-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            <span class="text-sm font-semibold" style="color: #9ca3af;">#${faq.sort_order || index + 1}</span>
            ${getCategoryBadge(faq.sns_category)}
            ${faq.is_published 
              ? '<span class="text-xs px-2 py-0.5 rounded-full" style="background-color: #16a34a; color: white;">公開中</span>'
              : '<span class="text-xs px-2 py-0.5 rounded-full" style="background-color: #4b5563; color: #d1d5db;">非公開</span>'
            }
          </div>
          <h3 class="text-base sm:text-lg font-bold mb-2 break-words" style="color: #f3f4f6;">
            Q: ${escapeHtml(faq.question)}
          </h3>
          <p class="text-sm break-words" style="color: #d1d5db;">
            A: ${escapeHtml(faq.answer)}
          </p>
        </div>
        <div class="flex flex-col gap-2 flex-shrink-0">
          <button 
            onclick="editFAQ(${faq.id})"
            class="px-3 py-1.5 text-white text-sm rounded transition-all duration-300 shadow-md whitespace-nowrap"
            style="background-color: #3b82f6;"
          >
            <i class="fas fa-edit"></i> 編集
          </button>
          <button 
            onclick="deleteFAQ(${faq.id})"
            class="px-3 py-1.5 text-white text-sm rounded transition-all duration-300 shadow-md whitespace-nowrap"
            style="background-color: #dc2626;"
          >
            <i class="fas fa-trash"></i> 削除
          </button>
        </div>
      </div>
    </div>
  `).join('')
}

// Show FAQ form
function showFAQForm(faq = null) {
  editingId = faq ? faq.id : null
  
  document.getElementById('form-title').textContent = faq ? 'FAQ編集' : '新規FAQ追加'
  document.getElementById('faq-question').value = faq ? faq.question : ''
  document.getElementById('faq-answer').value = faq ? faq.answer : ''
  document.getElementById('faq-sort-order').value = faq ? faq.sort_order : faqList.length + 1
  document.getElementById('faq-is-published').checked = faq ? faq.is_published : true
  document.getElementById('faq-sns-category').value = faq ? faq.sns_category : 'instagram'
  
  document.getElementById('faq-form-modal').classList.remove('hidden')
  document.getElementById('faq-form-modal').classList.add('flex')
}

// Hide FAQ form
function hideFAQForm() {
  document.getElementById('faq-form-modal').classList.add('hidden')
  document.getElementById('faq-form-modal').classList.remove('flex')
  editingId = null
}

// Save FAQ
async function saveFAQ() {
  const question = document.getElementById('faq-question').value.trim()
  const answer = document.getElementById('faq-answer').value.trim()
  const sortOrder = parseInt(document.getElementById('faq-sort-order').value) || 0
  const isPublished = document.getElementById('faq-is-published').checked
  const snsCategory = document.getElementById('faq-sns-category').value
  
  if (!question || !answer) {
    showToast('質問と回答を入力してください', 'error')
    return
  }
  
  try {
    const url = editingId 
      ? `/api/admin/instagram-faq/${editingId}`
      : '/api/admin/instagram-faq'
    
    const method = editingId ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        question,
        answer,
        sort_order: sortOrder,
        is_published: isPublished,
        sns_category: snsCategory
      })
    })
    
    if (response.ok) {
      showToast(editingId ? 'FAQを更新しました' : 'FAQを追加しました', 'success')
      hideFAQForm()
      await loadFAQList()
    } else {
      showToast('保存に失敗しました', 'error')
    }
  } catch (error) {
    showToast('保存に失敗しました', 'error')
  }
}

// Edit FAQ
function editFAQ(id) {
  const faq = faqList.find(f => f.id === id)
  if (faq) {
    showFAQForm(faq)
  }
}

// Delete FAQ
async function deleteFAQ(id) {
  if (!confirm('このFAQを削除してもよろしいですか？')) {
    return
  }
  
  try {
    const response = await fetch(`/api/admin/instagram-faq/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    
    if (response.ok) {
      showToast('FAQを削除しました', 'success')
      await loadFAQList()
    } else {
      showToast('削除に失敗しました', 'error')
    }
  } catch (error) {
    showToast('削除に失敗しました', 'error')
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuthStatus()
  
  if (!state.isAuthenticated) {
    location.href = '/'
    return
  }
  
  await loadFAQList()
})
