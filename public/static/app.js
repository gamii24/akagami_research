// State management
let state = {
  pdfs: [],
  categories: [],
  tags: [],
  selectedCategory: null,
  selectedTags: [],
  searchQuery: ''
}

// Initialize app
async function initApp() {
  await loadCategories()
  await loadTags()
  await loadPDFs()
  renderCategoryFilter()
  renderTagFilter()
  renderPDFList()
  setupEventListeners()
}

// Load data from API
async function loadCategories() {
  try {
    const response = await axios.get('/api/categories')
    state.categories = response.data
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

async function loadTags() {
  try {
    const response = await axios.get('/api/tags')
    state.tags = response.data
  } catch (error) {
    console.error('Failed to load tags:', error)
  }
}

async function loadPDFs() {
  try {
    const params = new URLSearchParams()
    if (state.selectedCategory) {
      params.append('category', state.selectedCategory)
    }
    if (state.selectedTags.length > 0) {
      state.selectedTags.forEach(tagId => params.append('tag', tagId))
    }
    if (state.searchQuery) {
      params.append('search', state.searchQuery)
    }
    
    const response = await axios.get(`/api/pdfs?${params.toString()}`)
    state.pdfs = response.data
    renderPDFList()
  } catch (error) {
    console.error('Failed to load PDFs:', error)
  }
}

// Render functions
function renderCategoryFilter() {
  const container = document.getElementById('category-filter')
  if (!container) return
  
  const html = `
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4 text-darker flex items-center">
        <i class="fas fa-layer-group mr-2 text-primary"></i>カテゴリ
      </h2>
      <div class="space-y-2">
        <button 
          onclick="filterByCategory(null)" 
          class="category-btn ${!state.selectedCategory ? 'active' : ''} w-full text-left px-4 py-3 rounded-lg"
        >
          <i class="fas fa-th-large mr-2"></i>すべて
        </button>
        ${state.categories.map(cat => `
          <button 
            onclick="filterByCategory(${cat.id})" 
            class="category-btn ${state.selectedCategory === cat.id ? 'active' : ''} w-full text-left px-4 py-3 rounded-lg"
          >
            <i class="fas fa-folder mr-2"></i>${escapeHtml(cat.name)}
          </button>
        `).join('')}
      </div>
    </div>
  `
  container.innerHTML = html
}

function renderTagFilter() {
  const container = document.getElementById('tag-filter')
  if (!container) return
  
  const html = `
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-4 text-darker flex items-center">
        <i class="fas fa-tags mr-2 text-primary"></i>タグ
      </h2>
      <div class="flex flex-wrap gap-2">
        ${state.tags.map(tag => `
          <button 
            onclick="toggleTag(${tag.id})" 
            class="tag-btn ${state.selectedTags.includes(tag.id) ? 'active' : ''} px-3 py-2 rounded-full text-sm font-medium"
          >
            <i class="fas fa-tag mr-1"></i>${escapeHtml(tag.name)}
          </button>
        `).join('')}
      </div>
    </div>
  `
  container.innerHTML = html
}

function renderPDFList() {
  const container = document.getElementById('pdf-list')
  if (!container) return
  
  if (state.pdfs.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16 text-gray-600">
        <i class="fas fa-inbox text-7xl mb-4 text-gray-300"></i>
        <p class="text-xl font-medium">資料が見つかりませんでした</p>
      </div>
    `
    return
  }
  
  let html = ''
  
  // Show bulk download button if category is selected
  if (state.selectedCategory) {
    const selectedCat = state.categories.find(cat => cat.id === state.selectedCategory)
    const downloadUrl = selectedCat?.download_url
    
    if (downloadUrl) {
      // If download URL is set, redirect to that URL
      html += `
        <div class="col-span-full mb-4">
          <a 
            href="${escapeHtml(downloadUrl)}"
            target="_blank"
            class="block w-full px-6 py-4 bg-gradient-to-r from-primary to-red-600 text-white rounded-xl hover:from-red-600 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-2xl font-bold text-lg text-center"
          >
            <i class="fas fa-download text-2xl mr-2"></i>
            <span>カテゴリ内のファイルを全ダウンロード</span>
          </a>
        </div>
      `
    } else {
      // If no download URL, use the old bulk download function
      html += `
        <div class="col-span-full mb-4">
          <button 
            onclick="bulkDownloadCategory()"
            class="w-full px-6 py-4 bg-gradient-to-r from-primary to-red-600 text-white rounded-xl hover:from-red-600 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-2xl font-bold text-lg flex items-center justify-center gap-3"
          >
            <i class="fas fa-download text-2xl"></i>
            <span>カテゴリ内のファイルを全ダウンロード</span>
          </button>
        </div>
      `
    }
  }
  
  html += state.pdfs.map(pdf => `
    <a 
      href="${escapeHtml(pdf.google_drive_url)}" 
      target="_blank"
      class="pdf-card bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 block cursor-pointer"
    >
      <div class="p-4">
        <h3 class="text-sm font-bold text-gray-800 mb-2 truncate" title="${escapeHtml(pdf.title)}">
          ${escapeHtml(pdf.title)}
        </h3>
        
        ${pdf.tags && pdf.tags.length > 0 ? `
          <div class="flex flex-wrap gap-1 mb-2">
            ${pdf.tags.map(tag => `
              <span class="badge badge-tag text-xs px-2 py-1">
                ${escapeHtml(tag.name)}
              </span>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <span class="flex items-center">${formatDate(pdf.created_at)}</span>
        </div>
      </div>
    </a>
  `).join('')
  
  container.innerHTML = html
}

// Filter functions
async function bulkDownloadCategory() {
  if (!state.selectedCategory) return
  
  try {
    const response = await axios.get(`/api/categories/${state.selectedCategory}/download-urls`)
    const urls = response.data
    
    if (urls.length === 0) {
      alert('このカテゴリにはファイルがありません')
      return
    }
    
    // Open each URL in a new tab with a small delay to avoid browser blocking
    for (let i = 0; i < urls.length; i++) {
      setTimeout(() => {
        window.open(urls[i].google_drive_url, '_blank')
      }, i * 500) // 500ms delay between each
    }
    
    alert(`${urls.length}件のファイルを新しいタブで開きます`)
  } catch (error) {
    alert('一括ダウンロードに失敗しました')
    console.error(error)
  }
}

function filterByCategory(categoryId) {
  state.selectedCategory = categoryId
  renderCategoryFilter()
  loadPDFs()
}

function toggleTag(tagId) {
  const index = state.selectedTags.indexOf(tagId)
  if (index > -1) {
    state.selectedTags.splice(index, 1)
  } else {
    state.selectedTags.push(tagId)
  }
  renderTagFilter()
  loadPDFs()
}

function searchPDFs() {
  const input = document.getElementById('search-input')
  if (input) {
    state.searchQuery = input.value
    loadPDFs()
  }
}

// Event listeners
function setupEventListeners() {
  const searchInput = document.getElementById('search-input')
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        searchPDFs()
      }
    })
  }
  
  const searchBtn = document.getElementById('search-btn')
  if (searchBtn) {
    searchBtn.addEventListener('click', searchPDFs)
  }
  
  // Mobile search
  const mobileSearchInput = document.getElementById('mobile-search-input')
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        searchPDFsMobile()
      }
    })
  }
  
  const mobileSearchBtn = document.getElementById('mobile-search-btn')
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', searchPDFsMobile)
  }
}

function searchPDFsMobile() {
  const input = document.getElementById('mobile-search-input')
  if (input) {
    state.searchQuery = input.value
    loadPDFs()
  }
}

// Mobile menu toggle
function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebar-overlay')
  if (sidebar && overlay) {
    sidebar.classList.toggle('show-mobile')
    overlay.classList.toggle('show')
  }
}

// Utility functions
function escapeHtml(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getCategoryIcon(categoryName) {
  const iconMap = {
    'YouTube': 'fab fa-youtube',
    'Threads': 'fab fa-threads',
    'Podcast': 'fas fa-podcast',
    'LINE公式': 'fab fa-line',
    'Instagram': 'fab fa-instagram',
    'TikTok': 'fab fa-tiktok',
    'X': 'fab fa-x-twitter',
    'マーケティング': 'fas fa-chart-line',
    'その他': 'fas fa-folder',
    '生成AI': 'fas fa-robot',
    '画像&動画生成': 'fas fa-image'
  }
  return iconMap[categoryName] || 'fas fa-file-pdf'
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
