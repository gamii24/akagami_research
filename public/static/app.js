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
  
  const html = state.pdfs.map(pdf => `
    <div class="pdf-card bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2">
      <div class="p-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="flex-shrink-0">
            <div class="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <i class="${getCategoryIcon(pdf.category_name)} text-2xl text-white"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-bold text-gray-800 mb-2 leading-tight">
              ${escapeHtml(pdf.title)}
            </h3>
          </div>
        </div>
        
        ${pdf.description ? `
          <p class="text-gray-600 mb-4 text-sm leading-relaxed">
            ${escapeHtml(pdf.description)}
          </p>
        ` : ''}
        
        <div class="flex flex-wrap gap-2 mb-4">
          ${pdf.category_name ? `
            <span class="badge badge-category text-xs shadow-sm">
              <i class="fas fa-folder mr-1"></i>${escapeHtml(pdf.category_name)}
            </span>
          ` : ''}
          
          ${pdf.tags ? pdf.tags.map(tag => `
            <span class="badge badge-tag text-xs">
              <i class="fas fa-tag mr-1"></i>${escapeHtml(tag.name)}
            </span>
          `).join('') : ''}
        </div>
        
        <div class="flex items-center gap-3 text-xs text-gray-500 mb-4 flex-wrap">
          ${pdf.file_size ? `
            <span class="flex items-center"><i class="fas fa-file mr-1"></i>${escapeHtml(pdf.file_size)}</span>
          ` : ''}
          ${pdf.page_count ? `
            <span class="flex items-center"><i class="fas fa-book mr-1"></i>${pdf.page_count}p</span>
          ` : ''}
          <span class="flex items-center"><i class="fas fa-clock mr-1"></i>${formatDate(pdf.created_at)}</span>
        </div>
        
        <a 
          href="${escapeHtml(pdf.google_drive_url)}" 
          target="_blank"
          class="block w-full text-center px-6 py-3.5 bg-primary text-white rounded-xl hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg font-semibold text-sm"
        >
          <i class="fas fa-download mr-2"></i>Download
        </a>
      </div>
    </div>
  `).join('')
  
  container.innerHTML = html
}

// Filter functions
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
