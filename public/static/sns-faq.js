// SNS FAQ Page - Unified with category navigation

// Note: app.js already provides the state object for auth compatibility
// We use faqState for local FAQ-specific state

let faqState = {
  faqs: [],
  selectedCategory: 'instagram'
}

// SNS Category Config
const SNS_CATEGORIES = {
  instagram: {
    name: 'Instagram',
    icon: 'fab fa-instagram',
    color: '#E4405F',
    bgColor: 'bg-pink-500'
  },
  tiktok: {
    name: 'TikTok',
    icon: 'fab fa-tiktok',
    color: '#000000',
    bgColor: 'bg-black'
  },
  youtube: {
    name: 'YouTube',
    icon: 'fab fa-youtube',
    color: '#FF0000',
    bgColor: 'bg-red-600'
  },
  threads: {
    name: 'Threads',
    icon: 'fas fa-at',
    color: '#000000',
    bgColor: 'bg-gray-800'
  },
  twitter: {
    name: 'Twitter(X)',
    icon: 'fab fa-x-twitter',
    color: '#000000',
    bgColor: 'bg-gray-900'
  },
  line: {
    name: 'LINE公式',
    icon: 'fab fa-line',
    color: '#00B900',
    bgColor: 'bg-green-500'
  },
  flame: {
    name: '炎上対応',
    icon: 'fas fa-fire-extinguisher',
    color: '#DC2626',
    bgColor: 'bg-red-600'
  },
  anti: {
    name: 'アンチ対応',
    icon: 'fas fa-shield-alt',
    color: '#7C3AED',
    bgColor: 'bg-purple-600'
  }
}

// Load FAQ data for specific category
async function loadFAQData(category) {
  try {
    const response = await fetch(`/api/instagram-faq?category=${category}`)
    if (response.ok) {
      faqState.faqs = await response.json()
      renderFAQList()
    } else {
      showToast('FAQデータの読み込みに失敗しました', 'error')
    }
  } catch (error) {
    showToast('FAQデータの読み込みに失敗しました', 'error')
  }
}

// Switch category
function switchCategory(category) {
  faqState.selectedCategory = category
  updateCategoryNav()
  loadFAQData(category)
}

// Update category navigation active state
function updateCategoryNav() {
  document.querySelectorAll('[data-category]').forEach(btn => {
    const category = btn.getAttribute('data-category')
    const config = SNS_CATEGORIES[category]
    
    if (category === faqState.selectedCategory) {
      // Active state
      btn.className = `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap text-sm border-2 ${config.bgColor} text-white border-transparent`
    } else {
      // Inactive state
      btn.className = `flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap text-sm border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50`
    }
  })
}

// Toggle accordion
function toggleAccordion(index) {
  const content = document.getElementById(`faq-content-${index}`)
  const icon = document.getElementById(`faq-icon-${index}`)
  
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden')
    icon.classList.remove('fa-chevron-down')
    icon.classList.add('fa-chevron-up')
  } else {
    content.classList.add('hidden')
    icon.classList.remove('fa-chevron-up')
    icon.classList.add('fa-chevron-down')
  }
}

// Render FAQ list
function renderFAQList() {
  const listContainer = document.getElementById('faq-list')
  const config = SNS_CATEGORIES[faqState.selectedCategory]
  
  if (faqState.faqs.length === 0) {
    listContainer.innerHTML = `
      <div class="text-center py-12 text-gray-500">
        <i class="fas fa-inbox text-5xl mb-4"></i>
        <p>このカテゴリにはまだFAQがありません</p>
      </div>
    `
    return
  }
  
  listContainer.innerHTML = `
    <div class="space-y-3">
      ${faqState.faqs.map((faq, index) => `
        <div class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <button 
            onclick="toggleAccordion(${index})"
            class="w-full px-4 sm:px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between gap-4"
          >
            <h3 class="flex-1 text-sm sm:text-base font-semibold text-gray-800 leading-relaxed">
              ${escapeHtml(faq.question)}
            </h3>
            <i id="faq-icon-${index}" class="fas fa-chevron-down text-gray-400 flex-shrink-0"></i>
          </button>
          <div id="faq-content-${index}" class="hidden px-4 sm:px-6 pb-4 border-t border-gray-100">
            <div class="pt-4">
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                ${escapeHtml(faq.answer)}
              </p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `
}

// Render page
function renderPage() {
  const app = document.getElementById('faq-app')
  
  app.innerHTML = `
    <!-- Page Title Section -->
    <div class="mb-6">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">
        <i class="fas fa-question-circle text-primary mr-2"></i>
        SNS運用 よくある質問
      </h2>
      <p class="text-sm text-gray-600 mt-2">赤髪の回答集</p>
    </div>

    <!-- Category Navigation -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div class="overflow-x-auto scrollbar-hide p-4">
        <div class="flex gap-2 min-w-max">
          ${Object.entries(SNS_CATEGORIES).map(([key, config]) => `
            <button
              data-category="${key}"
              onclick="switchCategory('${key}')"
              class="flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap text-sm border-2"
            >
              <i class="${config.icon}"></i>
              <span>${config.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- FAQ List -->
    <div id="faq-list" class="min-h-[400px]">
      <div class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-5xl text-primary mb-4"></i>
        <p class="text-gray-600">読み込み中...</p>
      </div>
    </div>
    
    <!-- Footer CTA -->
    <div class="mt-12 bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
      <p class="text-sm text-gray-600 mb-4">
        SNSマーケティングの実践的な資料を無料公開中
      </p>
      <a href="/" class="inline-block px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-red-600 transition-colors text-sm">
        資料を見る
      </a>
    </div>
    
    <style>
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    </style>
  `
  
  updateCategoryNav()
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Hide empty category and tag filters
  const categoryFilter = document.getElementById('category-filter')
  const tagFilter = document.getElementById('tag-filter')
  if (categoryFilter && !categoryFilter.hasChildNodes()) {
    categoryFilter.style.display = 'none'
  }
  if (tagFilter && !tagFilter.hasChildNodes()) {
    tagFilter.style.display = 'none'
  }
  
  // Immediately render page (don't wait for auth)
  renderPage()
  loadFAQData(faqState.selectedCategory)
  
  // Check auth in background (non-blocking)
  checkAuthStatus()
})

// Show login required page
function showLoginRequiredPage() {
  const app = document.getElementById('faq-app')
  if (!app) return
  
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-primary">
        <div class="mb-6">
          <i class="fas fa-lock text-6xl text-primary mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">ログインが必要です</h2>
          <p class="text-gray-600 mb-6">
            よくある質問は会員限定コンテンツです。<br>
            ログインまたは会員登録してご利用ください。
          </p>
        </div>
        
        <div class="space-y-3">
          <button 
            onclick="showLoginModal()"
            class="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <i class="fas fa-sign-in-alt"></i>
            <span>ログイン</span>
          </button>
          
          <button 
            onclick="showRegisterModal()"
            class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <i class="fas fa-user-plus"></i>
            <span>会員登録（無料）</span>
          </button>
          
          <a 
            href="/"
            class="block w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <i class="fas fa-home mr-2"></i>
            トップページに戻る
          </a>
        </div>
      </div>
    </div>
  `
}

// Toggle mobile menu (for hamburger menu)
function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
  }
}
