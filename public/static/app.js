// State management
let state = {
  pdfs: [],
  categories: [],
  tags: [],
  selectedCategory: null,
  selectedTags: [],
  searchQuery: '',
  downloadedPdfs: new Set(),
  allPdfs: [], // Store all PDFs for counting
  categoryCounts: {}, // Store category counts
  sortBy: 'newest', // Sort option: 'newest', 'oldest', 'title-asc', 'title-desc'
  favoritePdfs: new Set(), // Favorite PDFs
  showOnlyFavorites: false // Filter to show only favorites
}

// Load downloaded PDFs from localStorage
function loadDownloadedPdfs() {
  try {
    const downloaded = localStorage.getItem('downloaded_pdfs')
    if (downloaded) {
      state.downloadedPdfs = new Set(JSON.parse(downloaded))
    }
  } catch (error) {
    console.error('Failed to load downloaded PDFs:', error)
  }
  
  // Load favorite PDFs
  try {
    const favorites = localStorage.getItem('favorite_pdfs')
    if (favorites) {
      state.favoritePdfs = new Set(JSON.parse(favorites))
    }
  } catch (error) {
    console.error('Failed to load favorite PDFs:', error)
  }
  
  // Load sort preference
  try {
    const sortBy = localStorage.getItem('sort_by')
    if (sortBy && ['newest', 'oldest', 'title-asc', 'title-desc'].includes(sortBy)) {
      state.sortBy = sortBy
    }
  } catch (error) {
    console.error('Failed to load sort preference:', error)
  }
}

// Save downloaded PDF to localStorage
function markAsDownloaded(pdfId) {
  state.downloadedPdfs.add(pdfId)
  try {
    localStorage.setItem('downloaded_pdfs', JSON.stringify([...state.downloadedPdfs]))
  } catch (error) {
    console.error('Failed to save downloaded PDF:', error)
  }
}

// Check if PDF is downloaded
function isDownloaded(pdfId) {
  return state.downloadedPdfs.has(pdfId)
}

// Check if PDF is favorite
function isFavorite(pdfId) {
  return state.favoritePdfs.has(pdfId)
}

// Toggle favorite status
function toggleFavorite(event, pdfId) {
  event.stopPropagation() // Prevent triggering the card click
  
  if (state.favoritePdfs.has(pdfId)) {
    state.favoritePdfs.delete(pdfId)
  } else {
    state.favoritePdfs.add(pdfId)
  }
  
  // Save to localStorage
  try {
    localStorage.setItem('favorite_pdfs', JSON.stringify([...state.favoritePdfs]))
  } catch (error) {
    console.error('Failed to save favorite PDFs:', error)
  }
  
  // Re-render
  renderPDFList()
  
  // If showing only favorites, reload the list
  if (state.showOnlyFavorites) {
    loadPDFs()
  }
}

// Initialize app
async function initApp() {
  loadDownloadedPdfs()
  await loadCategories()
  await loadTags()
  await loadAllPdfsForCounting() // Load all PDFs for counting
  await loadPDFs()
  renderCategoryFilter()
  renderTagFilter()
  renderPDFList()
  setupEventListeners()
}

// Load all PDFs for counting (no filters)
async function loadAllPdfsForCounting() {
  try {
    const response = await axios.get('/api/pdfs')
    state.allPdfs = response.data
    
    // Calculate category counts
    state.categoryCounts = {}
    state.categories.forEach(cat => {
      state.categoryCounts[cat.id] = 0
    })
    
    state.allPdfs.forEach(pdf => {
      if (pdf.category_id && state.categoryCounts[pdf.category_id] !== undefined) {
        state.categoryCounts[pdf.category_id]++
      }
    })
  } catch (error) {
    console.error('Failed to load all PDFs for counting:', error)
  }
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
    
    // Filter by favorites if enabled
    if (state.showOnlyFavorites) {
      state.pdfs = state.pdfs.filter(pdf => state.favoritePdfs.has(pdf.id))
    }
    
    // Apply sorting
    sortPDFs()
    
    renderPDFList()
  } catch (error) {
    console.error('Failed to load PDFs:', error)
  }
}

// Sort PDFs based on current sort option
function sortPDFs() {
  switch (state.sortBy) {
    case 'newest':
      state.pdfs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'oldest':
      state.pdfs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'title-asc':
      state.pdfs.sort((a, b) => a.title.localeCompare(b.title, 'ja'))
      break
    case 'title-desc':
      state.pdfs.sort((a, b) => b.title.localeCompare(a.title, 'ja'))
      break
    default:
      // Default to newest
      state.pdfs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
}

// Change sort order
function changeSortBy(sortOption) {
  state.sortBy = sortOption
  
  // Save to localStorage
  try {
    localStorage.setItem('sort_by', sortOption)
  } catch (error) {
    console.error('Failed to save sort option:', error)
  }
  
  // Re-sort and re-render
  sortPDFs()
  renderPDFList()
}

// Render functions
function renderCategoryFilter() {
  const container = document.getElementById('category-filter')
  if (!container) return
  
  const totalCount = Object.values(state.categoryCounts).reduce((sum, count) => sum + count, 0)
  
  const html = `
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4 text-darker flex items-center">
        <i class="fas fa-layer-group mr-2 text-primary"></i>カテゴリ
      </h2>
      <div class="space-y-2">
        <button 
          onclick="filterByCategory(null)" 
          class="category-btn ${!state.selectedCategory ? 'active' : ''} w-full text-left px-4 py-3 rounded-lg flex items-center justify-between"
        >
          <span>
            <i class="fas fa-th-large mr-2"></i>すべて
          </span>
          ${totalCount > 0 ? `<span class="badge bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">${totalCount}</span>` : ''}
        </button>
        ${state.categories.map(cat => {
          const count = state.categoryCounts[cat.id] || 0
          return `
            <button 
              onclick="filterByCategory(${cat.id})" 
              class="category-btn ${state.selectedCategory === cat.id ? 'active' : ''} w-full text-left px-4 py-3 rounded-lg flex items-center justify-between"
            >
              <span>
                <i class="fas fa-folder mr-2"></i>${escapeHtml(cat.name)}
              </span>
              ${count > 0 ? `<span class="badge bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold">${count}</span>` : ''}
            </button>
          `
        }).join('')}
      </div>
    </div>
  `
  container.innerHTML = html
}

function renderCategoryFilterWithCounts(counts) {
  // This function is no longer needed
  renderCategoryFilter()
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
  
  // Show search result count
  const filterText = []
  if (state.selectedCategory) {
    const cat = state.categories.find(c => c.id === state.selectedCategory)
    if (cat) filterText.push(`カテゴリ: ${cat.name}`)
  }
  if (state.selectedTags.length > 0) {
    const tagNames = state.selectedTags.map(tagId => {
      const tag = state.tags.find(t => t.id === tagId)
      return tag ? tag.name : ''
    }).filter(n => n)
    if (tagNames.length > 0) {
      filterText.push(`タグ: ${tagNames.join(', ')}`)
    }
  }
  if (state.searchQuery) {
    filterText.push(`検索: "${state.searchQuery}"`)
  }
  
  const filterDescription = filterText.length > 0 ? ` (${filterText.join(' / ')})` : ''
  
  html += `
    <div class="col-span-full mb-4 space-y-3">
      <div class="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white px-4 py-3 rounded-lg border-2 border-gray-200 flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <i class="fas fa-file-pdf text-primary text-lg"></i>
          <span class="text-gray-700 font-semibold">検索結果:</span>
          <span class="text-primary text-xl font-bold">${state.pdfs.length}</span>
          <span class="text-gray-700 font-semibold">件</span>
        </div>
        <div class="flex items-center gap-2">
          ${filterText.length > 0 ? `
            <button 
              onclick="clearAllFilters()" 
              class="text-sm text-gray-600 hover:text-primary transition-colors flex items-center gap-1"
            >
              <i class="fas fa-times-circle"></i>
              <span class="hidden sm:inline">フィルタをクリア</span>
            </button>
          ` : ''}
        </div>
      </div>
      
      <!-- Sort Options -->
      <div class="flex items-center gap-2 px-2 flex-wrap">
        <i class="fas fa-sort text-gray-600"></i>
        <span class="text-sm text-gray-700 font-semibold">並び替え:</span>
        <div class="flex flex-wrap gap-2">
          <button 
            onclick="changeSortBy('newest')" 
            class="sort-btn ${state.sortBy === 'newest' ? 'active' : ''} px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <i class="fas fa-clock mr-1"></i>新着順
          </button>
          <button 
            onclick="changeSortBy('oldest')" 
            class="sort-btn ${state.sortBy === 'oldest' ? 'active' : ''} px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <i class="fas fa-history mr-1"></i>古い順
          </button>
          <button 
            onclick="changeSortBy('title-asc')" 
            class="sort-btn ${state.sortBy === 'title-asc' ? 'active' : ''} px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <i class="fas fa-sort-alpha-down mr-1"></i>タイトル順（あ→ん）
          </button>
          <button 
            onclick="changeSortBy('title-desc')" 
            class="sort-btn ${state.sortBy === 'title-desc' ? 'active' : ''} px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <i class="fas fa-sort-alpha-up mr-1"></i>タイトル順（ん→あ）
          </button>
        </div>
      </div>
      
      <!-- Favorite Filter -->
      <div class="flex items-center gap-2 px-2">
        <button 
          onclick="toggleFavoriteFilter()" 
          class="favorite-filter-btn ${state.showOnlyFavorites ? 'active' : ''} px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
        >
          <i class="fas fa-heart"></i>
          <span>お気に入りのみ表示 ${state.showOnlyFavorites ? `(${state.favoritePdfs.size}件)` : ''}</span>
        </button>
      </div>
      
      ${filterText.length > 0 ? `
        <div class="text-sm text-gray-600 px-2">
          ${filterDescription}
        </div>
      ` : ''}
    </div>
  `
  
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
  
  html += state.pdfs.map((pdf, index) => {
    // Only use Google Drive URL
    const downloadUrl = pdf.google_drive_url || ''
    const downloaded = isDownloaded(pdf.id)
    const favorite = isFavorite(pdf.id)
    const bgColor = downloaded ? 'bg-[#f4eee0]' : 'bg-white'
    
    return `
    <div 
      onclick="${downloadUrl ? `showDownloadConfirmation(${pdf.id}, '${escapeHtml(pdf.title)}', '${downloadUrl}')` : `alert('このPDFのURLが設定されていません')`}"
      class="pdf-card ${bgColor} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 cursor-pointer relative"
    >
      <!-- Favorite Button -->
      <button 
        onclick="toggleFavorite(event, ${pdf.id})"
        class="favorite-btn absolute top-2 right-2 z-10 w-10 h-10 rounded-full ${favorite ? 'bg-primary text-white' : 'bg-white text-gray-400'} shadow-lg hover:scale-110 transition-all flex items-center justify-center"
        title="${favorite ? 'お気に入りから削除' : 'お気に入りに追加'}"
      >
        <i class="fas fa-heart text-lg"></i>
      </button>
      
      <div class="p-4 pt-12">
        <h3 class="text-sm font-bold text-gray-800 mb-2 leading-snug break-words">
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
          ${downloaded ? '<span class="flex items-center text-primary font-semibold"><i class="fas fa-check-circle mr-1"></i>ダウンロード済み</span>' : ''}
        </div>
      </div>
    </div>
  `
  }).join('')
  
  container.innerHTML = html
}

// Show download confirmation modal
function showDownloadConfirmation(pdfId, title, url) {
  if (!url) {
    alert('このPDFのURLが設定されていません')
    return
  }
  
  // Create modal HTML
  const modalHtml = `
    <div id="download-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onclick="closeDownloadModal(event)">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all" onclick="event.stopPropagation()">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary bg-opacity-10 mb-4">
            <i class="fas fa-download text-3xl text-primary"></i>
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            PDFをダウンロードしますか？
          </h3>
          
          <p class="text-sm text-gray-600 mb-6 break-words">
            ${escapeHtml(title)}
          </p>
          
          <div class="flex gap-3">
            <button 
              onclick="closeDownloadModal()"
              class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              キャンセル
            </button>
            <button 
              onclick="confirmDownload(${pdfId}, '${url}')"
              class="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-lg"
            >
              <i class="fas fa-check mr-2"></i>ダウンロード
            </button>
          </div>
        </div>
      </div>
    </div>
  `
  
  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', modalHtml)
}

// Close download modal
function closeDownloadModal(event) {
  if (event && event.target.id !== 'download-modal') return
  const modal = document.getElementById('download-modal')
  if (modal) {
    modal.remove()
  }
}

// Confirm and start download
function confirmDownload(pdfId, url) {
  // Mark as downloaded
  markAsDownloaded(pdfId)
  
  // Open Google Drive URL in new tab
  window.open(url, '_blank')
  
  // Close modal
  closeDownloadModal()
  
  // Re-render PDF list to update card color
  renderPDFList()
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
  
  // Close mobile menu after selection
  closeMobileMenu()
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
  
  // Close mobile menu after selection
  closeMobileMenu()
}

// Clear all filters
function clearAllFilters() {
  state.selectedCategory = null
  state.selectedTags = []
  state.searchQuery = ''
  
  // Clear search inputs
  const searchInput = document.getElementById('search-input')
  if (searchInput) searchInput.value = ''
  
  const mobileSearchInput = document.getElementById('mobile-search-input')
  if (mobileSearchInput) mobileSearchInput.value = ''
  
  // Re-render everything
  renderCategoryFilter()
  renderTagFilter()
  loadPDFs()
  
  // Close mobile menu
  closeMobileMenu()
}

function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebar-overlay')
  if (sidebar && overlay) {
    sidebar.classList.remove('show-mobile')
    overlay.classList.remove('show')
  }
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

// Toggle favorite filter
function toggleFavoriteFilter() {
  state.showOnlyFavorites = !state.showOnlyFavorites
  loadPDFs()
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
