// SNS FAQ Page (Multi-category support)

let faqData = []
let snsCategory = 'instagram' // Default category

// SNS Category Config
const SNS_CONFIG = {
  instagram: {
    name: 'Instagram運用',
    icon: 'fab fa-instagram',
    color: '#E4405F',
    gradient: 'from-pink-500 to-red-500'
  },
  tiktok: {
    name: 'TikTok運用',
    icon: 'fab fa-tiktok',
    color: '#000000',
    gradient: 'from-gray-900 to-black'
  },
  youtube: {
    name: 'YouTube運用',
    icon: 'fab fa-youtube',
    color: '#FF0000',
    gradient: 'from-red-600 to-red-700'
  },
  threads: {
    name: 'Threads運用',
    icon: 'fas fa-at',
    color: '#000000',
    gradient: 'from-gray-800 to-black'
  },
  twitter: {
    name: 'Twitter(X)運用',
    icon: 'fab fa-x-twitter',
    color: '#000000',
    gradient: 'from-gray-900 to-black'
  }
}

// Get SNS category from URL or default
function getSNSCategory() {
  const path = window.location.pathname
  if (path.includes('tiktok-faq')) return 'tiktok'
  if (path.includes('youtube-faq')) return 'youtube'
  if (path.includes('threads-faq')) return 'threads'
  if (path.includes('twitter-faq')) return 'twitter'
  return 'instagram'
}

// Fetch FAQ data from API
async function loadFAQData() {
  try {
    const response = await fetch(`/api/instagram-faq?category=${snsCategory}`)
    if (response.ok) {
      faqData = await response.json()
      renderFAQPage()
    } else {
      console.error('Failed to load FAQ data')
      showError()
    }
  } catch (error) {
    console.error('Error loading FAQ:', error)
    showError()
  }
}

// Show error message
function showError() {
  const app = document.getElementById('faq-app')
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
        <p class="text-gray-600 mb-4">FAQデータの読み込みに失敗しました</p>
        <button onclick="location.reload()" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-600">
          再読み込み
        </button>
      </div>
    </div>
  `
}

// Toggle FAQ item
function toggleFAQ(index) {
  const answer = document.getElementById(`faq-answer-${index}`)
  const icon = document.getElementById(`faq-icon-${index}`)
  
  if (answer.classList.contains('hidden')) {
    answer.classList.remove('hidden')
    icon.classList.remove('fa-chevron-down')
    icon.classList.add('fa-chevron-up')
  } else {
    answer.classList.add('hidden')
    icon.classList.remove('fa-chevron-up')
    icon.classList.add('fa-chevron-down')
  }
}

// Render FAQ page
function renderFAQPage() {
  const app = document.getElementById('faq-app')
  const config = SNS_CONFIG[snsCategory]
  
  app.innerHTML = `
    <!-- Header -->
    <div class="bg-gradient-to-r ${config.gradient} text-white py-8 sm:py-12">
      <div class="max-w-4xl mx-auto px-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <i class="${config.icon} text-3xl sm:text-4xl"></i>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold">${config.name}</h1>
              <p class="text-sm sm:text-base opacity-90">よくある質問と赤髪の回答</p>
            </div>
          </div>
          <a href="/" class="px-3 py-2 sm:px-4 sm:py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm sm:text-base">
            <i class="fas fa-home mr-1 sm:mr-2"></i><span class="hidden sm:inline">ホームへ戻る</span><span class="sm:hidden">戻る</span>
          </a>
        </div>
        <p class="text-white/90 text-sm sm:text-base">
          現場のリアルな答えだけ。建前なし、理想論なし。
        </p>
      </div>
    </div>

    <!-- FAQ List -->
    <div class="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div class="mb-6 bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 border-primary">
        <div class="flex items-start gap-3">
          <i class="fas fa-info-circle text-primary text-xl flex-shrink-0 mt-1"></i>
          <div>
            <h2 class="font-bold text-gray-800 mb-2">このページについて</h2>
            <p class="text-sm text-gray-600 leading-relaxed">
              ${config.name}でよく聞かれる質問に、赤髪が現場目線で回答。
              理想論や建前は一切なし。リアルに使える答えだけをまとめました。
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-3 sm:space-y-4">
        ${faqData.map((faq, index) => `
          <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <button 
              onclick="toggleFAQ(${index})"
              class="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start gap-3 flex-1 min-w-0">
                <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  Q
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm sm:text-base font-bold text-gray-800 leading-relaxed break-words">
                    ${escapeHtml(faq.question)}
                  </h3>
                </div>
              </div>
              <i id="faq-icon-${index}" class="fas fa-chevron-down text-gray-400 flex-shrink-0 mt-1"></i>
            </button>
            
            <div id="faq-answer-${index}" class="hidden px-4 sm:px-6 pb-4 sm:pb-5">
              <div class="flex items-start gap-3 ml-0 sm:ml-[52px]">
                <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm sm:text-base sm:hidden">
                  A
                </div>
                <div class="flex-1 bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-primary">
                  <div class="hidden sm:flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
                      A
                    </div>
                    <span class="text-xs text-gray-500 font-semibold">赤髪の回答</span>
                  </div>
                  <p class="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                    ${escapeHtml(faq.answer)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Footer CTA -->
      <div class="mt-8 sm:mt-12 bg-gradient-to-r from-primary to-pink-500 rounded-xl shadow-lg p-6 sm:p-8 text-white text-center">
        <i class="fas fa-lightbulb text-3xl sm:text-4xl mb-4"></i>
        <h2 class="text-xl sm:text-2xl font-bold mb-2">もっと学びたい方へ</h2>
        <p class="text-sm sm:text-base opacity-90 mb-4 sm:mb-6">
          Akagami Researchでは、SNSマーケティングの実践的な資料を無料公開中
        </p>
        <a href="/" class="inline-block px-6 sm:px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base">
          <i class="fas fa-arrow-right mr-2"></i>資料を見る
        </a>
      </div>
    </div>
  `
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  snsCategory = getSNSCategory()
  checkAuthStatus()
  loadFAQData()
})
