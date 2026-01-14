// News Admin Page State
let newsState = {
  newsArticles: [],
  editingNews: null,
  authenticated: false
}

// Enable dark mode
function enableAdminDarkMode() {
  document.body.classList.add('admin-dark')
  document.documentElement.classList.add('admin-dark')
}

// Check authentication
async function checkAuth() {
  try {
    const response = await axios.get('/api/auth/check')
    if (response.data.authenticated) {
      newsState.authenticated = true
      return true
    }
  } catch (error) {
    console.error('Auth check failed:', error)
  }
  
  window.location.href = '/admin'
  return false
}

// Initialize news admin app
async function initNewsAdmin() {
  enableAdminDarkMode()
  const isAuth = await checkAuth()
  if (!isAuth) return
  
  await loadNewsArticles()
  renderNewsAdminPage()
}

// Load news articles
async function loadNewsArticles() {
  try {
    const response = await axios.get('/api/news')
    newsState.newsArticles = response.data
  } catch (error) {
    console.error('Failed to load news articles:', error)
    showToast('ニュース記事の読み込みに失敗しました', 'error')
  }
}

// Render news admin page
function renderNewsAdminPage() {
  const app = document.getElementById('news-admin-app')
  if (!app) return
  
  app.innerHTML = `
    <div class="min-h-screen" style="background-color: #1a1a1a;">
      <!-- Header -->
      <header style="background-color: #2d2d2d; border-bottom: 2px solid #4b5563;">
        <div class="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold flex items-center" style="color: #f3f4f6;">
                <i class="fas fa-newspaper mr-2" style="color: #f59e0b;"></i>
                ニュース管理
              </h1>
              <p class="text-xs mt-0.5" style="color: #d1d5db;">Akagami Research</p>
            </div>
            <div class="flex gap-2">
              <a href="/admin" class="px-3 py-1.5 text-sm rounded-lg transition-all duration-300 font-medium shadow-md" style="background-color: #6b7280; color: white;" aria-label="管理画面に戻る">
                <i class="fas fa-arrow-left mr-1" aria-hidden="true"></i>管理画面に戻る
              </a>
              <a href="/" class="px-3 py-1.5 text-sm rounded-lg transition-all duration-300 font-medium shadow-md" style="background-color: #e75556; color: white;" aria-label="公開ページへ移動">
                <i class="fas fa-home mr-1" aria-hidden="true"></i>公開ページへ
              </a>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <!-- Add/Edit Form -->
        <div class="mb-6 rounded-xl shadow-xl overflow-hidden" style="background-color: #2d2d2d; border: 2px solid #4b5563;">
          <div class="px-6 py-4" style="background-color: #3a3a3a; border-bottom: 2px solid #4b5563;">
            <h2 class="text-lg font-bold" style="color: #f3f4f6;">
              <i class="fas fa-plus-circle mr-2" style="color: #f59e0b;"></i>
              <span id="form-title">新規ニュース記事を追加</span>
            </h2>
          </div>
          
          <div class="p-6">
            <form id="news-form" class="space-y-4">
              <input type="hidden" id="news-id" value="">
              
              <div>
                <label class="block text-sm font-medium mb-2" style="color: #d1d5db;">タイトル <span style="color: #ef4444;">*</span></label>
                <input type="text" id="news-title" required class="w-full px-4 py-2 rounded-lg" style="background-color: #1a1a1a; border: 1px solid #4b5563; color: #f3f4f6;" placeholder="記事のタイトルを入力">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2" style="color: #d1d5db;">要約 <span style="color: #ef4444;">*</span></label>
                <textarea id="news-summary" required rows="4" class="w-full px-4 py-2 rounded-lg" style="background-color: #1a1a1a; border: 1px solid #4b5563; color: #f3f4f6;" placeholder="記事の要約を入力"></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2" style="color: #d1d5db;">記事URL <span style="color: #ef4444;">*</span></label>
                <input type="url" id="news-url" required class="w-full px-4 py-2 rounded-lg" style="background-color: #1a1a1a; border: 1px solid #4b5563; color: #f3f4f6;" placeholder="https://example.com/article">
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2" style="color: #d1d5db;">カテゴリ <span style="color: #ef4444;">*</span></label>
                  <select id="news-category" required class="w-full px-4 py-2 rounded-lg" style="background-color: #1a1a1a; border: 1px solid #4b5563; color: #f3f4f6;">
                    <option value="SNS">SNS</option>
                    <option value="AI">AI</option>
                    <option value="テクノロジー">テクノロジー</option>
                    <option value="マーケティング">マーケティング</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2" style="color: #d1d5db;">言語 <span style="color: #ef4444;">*</span></label>
                  <select id="news-language" required class="w-full px-4 py-2 rounded-lg" style="background-color: #1a1a1a; border: 1px solid #4b5563; color: #f3f4f6;">
                    <option value="en">英語</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2" style="color: #d1d5db;">公開日時（省略可）</label>
                <input type="datetime-local" id="news-published-at" class="w-full px-4 py-2 rounded-lg" style="background-color: #1a1a1a; border: 1px solid #4b5563; color: #f3f4f6;">
              </div>
              
              <div class="flex gap-3">
                <button type="submit" id="submit-btn" class="flex-1 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg" style="background-color: #f59e0b; color: white;">
                  <i class="fas fa-save mr-2"></i><span id="submit-text">ニュースを追加</span>
                </button>
                <button type="button" onclick="cancelEdit()" id="cancel-btn" class="hidden px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg" style="background-color: #6b7280; color: white;">
                  <i class="fas fa-times mr-2"></i>キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- News List -->
        <div class="rounded-xl shadow-xl overflow-hidden" style="background-color: #2d2d2d; border: 2px solid #4b5563;">
          <div class="px-6 py-4" style="background-color: #3a3a3a; border-bottom: 2px solid #4b5563;">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold" style="color: #f3f4f6;">
                <i class="fas fa-list mr-2" style="color: #f59e0b;"></i>登録済みニュース記事
              </h2>
              <div class="text-sm" style="color: #9ca3af;">
                全 <span id="news-count" style="color: #f59e0b; font-weight: bold;">${newsState.newsArticles.length}</span> 件
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <div id="news-list" class="space-y-4">
              ${renderNewsList()}
            </div>
          </div>
        </div>
      </main>
    </div>
  `
  
  // Add form submit handler
  document.getElementById('news-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    await saveNews()
  })
}

// Render news list
function renderNewsList() {
  if (newsState.newsArticles.length === 0) {
    return `
      <p class="text-center py-8" style="color: #9ca3af;">
        <i class="fas fa-inbox text-4xl mb-2 block"></i>
        まだニュース記事が登録されていません
      </p>
    `
  }
  
  return newsState.newsArticles.map(news => `
    <div class="p-4 rounded-lg" style="background-color: #1a1a1a; border: 1px solid #4b5563;">
      <div class="flex justify-between items-start mb-2">
        <div class="flex-1">
          <h3 class="font-semibold mb-1" style="color: #f3f4f6;">${escapeHtml(news.title)}</h3>
          <p class="text-sm mb-2" style="color: #9ca3af;">${escapeHtml(news.summary)}</p>
          <div class="flex gap-2 text-xs mb-2">
            <span class="px-2 py-1 rounded" style="background-color: #f59e0b; color: white;">${news.category}</span>
            <span style="color: #9ca3af;">${new Date(news.published_at).toLocaleDateString('ja-JP')}</span>
          </div>
          <a href="${news.url}" target="_blank" class="text-xs hover:underline" style="color: #60a5fa;">
            <i class="fas fa-external-link-alt mr-1"></i>${news.url}
          </a>
        </div>
        <div class="ml-4 flex gap-2">
          <button onclick="editNews(${news.id})" class="px-3 py-2 rounded text-sm transition-colors" style="background-color: #3b82f6; color: white;" title="編集">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteNews(${news.id}, '${escapeHtml(news.title).replace(/'/g, "\\'")}')  " class="px-3 py-2 rounded text-sm transition-colors" style="background-color: #dc2626; color: white;" title="削除">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('')
}

// Save news (add or update)
async function saveNews() {
  const id = document.getElementById('news-id').value
  const title = document.getElementById('news-title').value.trim()
  const summary = document.getElementById('news-summary').value.trim()
  const url = document.getElementById('news-url').value.trim()
  const category = document.getElementById('news-category').value
  const language = document.getElementById('news-language').value
  const publishedAtInput = document.getElementById('news-published-at').value
  
  if (!title || !summary || !url) {
    showToast('すべての必須項目を入力してください', 'error')
    return
  }
  
  try {
    const data = {
      title,
      summary,
      url,
      category,
      language
    }
    
    if (publishedAtInput) {
      data.published_at = new Date(publishedAtInput).toISOString()
    }
    
    let response
    if (id) {
      // Update existing news
      response = await axios.put(`/api/news/${id}`, data)
      showToast('ニュース記事を更新しました', 'success')
    } else {
      // Add new news
      response = await axios.post('/api/news', data)
      showToast('ニュース記事を追加しました', 'success')
    }
    
    if (response.data.success) {
      // Reset form
      cancelEdit()
      
      // Reload and re-render
      await loadNewsArticles()
      document.getElementById('news-list').innerHTML = renderNewsList()
      document.getElementById('news-count').textContent = newsState.newsArticles.length
    }
  } catch (error) {
    console.error('Failed to save news:', error)
    showToast('ニュース記事の保存に失敗しました', 'error')
  }
}

// Edit news
async function editNews(id) {
  const news = newsState.newsArticles.find(n => n.id === id)
  if (!news) return
  
  // Fill form with news data
  document.getElementById('news-id').value = news.id
  document.getElementById('news-title').value = news.title
  document.getElementById('news-summary').value = news.summary
  document.getElementById('news-url').value = news.url
  document.getElementById('news-category').value = news.category
  document.getElementById('news-language').value = news.language
  
  if (news.published_at) {
    const date = new Date(news.published_at)
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    document.getElementById('news-published-at').value = localDate.toISOString().slice(0, 16)
  }
  
  // Update UI
  document.getElementById('form-title').textContent = 'ニュース記事を編集'
  document.getElementById('submit-text').textContent = '更新する'
  document.getElementById('cancel-btn').classList.remove('hidden')
  
  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Cancel edit
function cancelEdit() {
  document.getElementById('news-form').reset()
  document.getElementById('news-id').value = ''
  document.getElementById('form-title').textContent = '新規ニュース記事を追加'
  document.getElementById('submit-text').textContent = 'ニュースを追加'
  document.getElementById('cancel-btn').classList.add('hidden')
}

// Delete news
async function deleteNews(id, title) {
  if (!confirm(`「${title}」を削除しますか？`)) {
    return
  }
  
  try {
    const response = await axios.delete(`/api/news/${id}`)
    
    if (response.data.success) {
      showToast('ニュース記事を削除しました', 'success')
      
      // Reload and re-render
      await loadNewsArticles()
      document.getElementById('news-list').innerHTML = renderNewsList()
      document.getElementById('news-count').textContent = newsState.newsArticles.length
    }
  } catch (error) {
    console.error('Failed to delete news:', error)
    showToast('ニュース記事の削除に失敗しました', 'error')
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div')
  toast.className = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-300 transform translate-y-0'
  toast.style.cssText = `
    background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    font-weight: 600;
  `
  
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'
  toast.innerHTML = `
    <i class="fas fa-${icon} mr-2"></i>${message}
  `
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.transform = 'translateY(100px)'
    toast.style.opacity = '0'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initNewsAdmin)
