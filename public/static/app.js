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
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-3 text-gray-700">
        <i class="fas fa-folder mr-2"></i>カテゴリ
      </h2>
      <div class="space-y-2">
        <button 
          onclick="filterByCategory(null)" 
          class="category-btn ${!state.selectedCategory ? 'active' : ''} w-full text-left px-4 py-2 rounded-lg transition-colors"
        >
          <i class="fas fa-list mr-2"></i>すべて
        </button>
        ${state.categories.map(cat => `
          <button 
            onclick="filterByCategory(${cat.id})" 
            class="category-btn ${state.selectedCategory === cat.id ? 'active' : ''} w-full text-left px-4 py-2 rounded-lg transition-colors"
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
      <h2 class="text-lg font-semibold mb-3 text-gray-700">
        <i class="fas fa-tags mr-2"></i>タグ
      </h2>
      <div class="flex flex-wrap gap-2">
        ${state.tags.map(tag => `
          <button 
            onclick="toggleTag(${tag.id})" 
            class="tag-btn ${state.selectedTags.includes(tag.id) ? 'active' : ''} px-3 py-1 rounded-full text-sm transition-colors"
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
      <div class="text-center py-12 text-gray-500">
        <i class="fas fa-file-pdf text-6xl mb-4"></i>
        <p class="text-lg">資料が見つかりませんでした</p>
      </div>
    `
    return
  }
  
  const html = state.pdfs.map(pdf => `
    <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <i class="fas fa-file-pdf text-5xl text-red-500"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            ${escapeHtml(pdf.title)}
          </h3>
          
          ${pdf.description ? `
            <p class="text-gray-600 mb-3 line-clamp-2">
              ${escapeHtml(pdf.description)}
            </p>
          ` : ''}
          
          <div class="flex flex-wrap gap-2 mb-3">
            ${pdf.category_name ? `
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                <i class="fas fa-folder mr-1"></i>${escapeHtml(pdf.category_name)}
              </span>
            ` : ''}
            
            ${pdf.tags ? pdf.tags.map(tag => `
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                <i class="fas fa-tag mr-1"></i>${escapeHtml(tag.name)}
              </span>
            `).join('') : ''}
          </div>
          
          <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
            ${pdf.file_size ? `
              <span><i class="fas fa-file mr-1"></i>${escapeHtml(pdf.file_size)}</span>
            ` : ''}
            ${pdf.page_count ? `
              <span><i class="fas fa-book mr-1"></i>${pdf.page_count}ページ</span>
            ` : ''}
            <span><i class="fas fa-clock mr-1"></i>${formatDate(pdf.created_at)}</span>
          </div>
          
          <a 
            href="${escapeHtml(pdf.google_drive_url)}" 
            target="_blank"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i class="fas fa-external-link-alt mr-2"></i>Google Driveで開く
          </a>
        </div>
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

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
