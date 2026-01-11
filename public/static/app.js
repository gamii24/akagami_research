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
  sortBy: 'newest', // Sort option: 'newest', 'oldest', 'popular'
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
    if (sortBy && ['newest', 'oldest', 'popular'].includes(sortBy)) {
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
  
  // Check if reached 5 downloads milestone
  checkDownloadMilestone()
}

// Check download milestone and show celebration
function checkDownloadMilestone() {
  const downloadCount = state.downloadedPdfs.size
  
  // Check if first download
  const firstDownloadShown = localStorage.getItem('first_download_shown')
  if (downloadCount === 1 && !firstDownloadShown) {
    showFirstDownloadMessage()
    localStorage.setItem('first_download_shown', 'true')
    return // Don't check other milestones
  }
  
  // Check if reached 5 downloads milestone
  const celebrationShown = localStorage.getItem('celebration_5_shown')
  if (downloadCount === 5 && !celebrationShown) {
    showCelebration()
    localStorage.setItem('celebration_5_shown', 'true')
  }
}

// Show first download message (simple and clean)
function showFirstDownloadMessage() {
  const modalHtml = `
    <div class="first-download-modal" id="first-download-modal" onclick="closeFirstDownload(event)">
      <div class="first-download-content" onclick="event.stopPropagation()">
        <div class="first-download-emoji">📚</div>
        <h2 class="first-download-title">はじめてのダウンロード</h2>
        <p class="first-download-message">
          資料をダウンロードしていただき<br>
          ありがとうございます！<br>
          素敵な学びの時間をお過ごしください 😊
        </p>
        <button class="first-download-button" onclick="closeFirstDownload()">
          ありがとう！
        </button>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', modalHtml)
}

// Close first download modal
function closeFirstDownload(event) {
  if (event && event.target.id !== 'first-download-modal') return
  const modal = document.getElementById('first-download-modal')
  if (modal) {
    modal.style.opacity = '0'
    setTimeout(() => {
      modal.remove()
    }, 300)
  }
}

// Check if first visit and show welcome message
function checkFirstVisit() {
  const hasVisited = localStorage.getItem('has_visited')
  
  if (!hasVisited) {
    // Wait a bit for page to load before showing welcome
    setTimeout(() => {
      showWelcomeMessage()
    }, 800)
    localStorage.setItem('has_visited', 'true')
  }
}

// Show welcome message (Instagram like style)
function showWelcomeMessage() {
  const modalHtml = `
    <div class="welcome-modal" id="welcome-modal" onclick="closeWelcome(event)">
      <div class="welcome-content" onclick="event.stopPropagation()">
        <div class="floating-hearts">
          <div class="floating-heart">❤️</div>
          <div class="floating-heart">❤️</div>
          <div class="floating-heart">❤️</div>
          <div class="floating-heart">❤️</div>
          <div class="floating-heart">❤️</div>
        </div>
        <div class="welcome-heart">❤️</div>
        <h2 class="welcome-title">ようこそ！</h2>
        <p class="welcome-message">
          ここではSNS運用や最新AI情報などを<br>
          学べる資料を配布しています。<br>
          あなたのSNSライフがより楽しくなりますように！<br>
          活用してね！
        </p>
        <button class="welcome-button" onclick="closeWelcome()">
          <i class="fas fa-heart"></i>
          はじめる
        </button>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', modalHtml)
}

// Close welcome modal
function closeWelcome(event) {
  if (event && event.target.id !== 'welcome-modal') return
  const modal = document.getElementById('welcome-modal')
  if (modal) {
    modal.style.opacity = '0'
    setTimeout(() => {
      modal.remove()
    }, 300)
  }
}

// Show celebration modal
function showCelebration() {
  const modalHtml = `
    <div class="celebration-modal" id="celebration-modal" onclick="closeCelebration(event)">
      <div class="celebration-content" onclick="event.stopPropagation()">
        ${generateConfetti()}
        <div class="celebration-emoji">🎉</div>
        <h2 class="celebration-title">おめでとうございます！</h2>
        <p class="celebration-message">
          5つの資料をダウンロードしていただき<br>
          本当にありがとうございます！✨<br>
          これからも素敵な学びを<br>
          お届けできるよう頑張ります💪
        </p>
        <button class="celebration-button" onclick="closeCelebration()">
          ありがとう！ 🎊
        </button>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', modalHtml)
}

// Generate confetti elements
function generateConfetti() {
  let confetti = ''
  for (let i = 0; i < 10; i++) {
    confetti += `<div class="confetti"></div>`
  }
  return confetti
}

// Close celebration modal
function closeCelebration(event) {
  if (event && event.target.id !== 'celebration-modal') return
  const modal = document.getElementById('celebration-modal')
  if (modal) {
    modal.style.opacity = '0'
    setTimeout(() => {
      modal.remove()
    }, 300)
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
  
  // Update just this card's favorite button
  const favoriteBtn = event.target.closest('.favorite-btn-small')
  if (favoriteBtn) {
    if (state.favoritePdfs.has(pdfId)) {
      favoriteBtn.classList.add('active')
      favoriteBtn.title = 'お気に入りから削除'
    } else {
      favoriteBtn.classList.remove('active')
      favoriteBtn.title = 'お気に入りに追加'
    }
  }
  
  // Only re-render if showing favorites filter
  if (state.showOnlyFavorites) {
    applyFiltersFromAllPdfs()
    renderPDFList()
  }
}

// Share PDF
function sharePDF(event, pdfId, title, url) {
  event.stopPropagation() // Prevent triggering the card click
  
  if (!url) {
    alert('このPDFのURLが設定されていません')
    return
  }
  
  const shareData = {
    title: title,
    text: `${title} - Akagami Research`,
    url: url
  }
  
  // Check if Web Share API is supported
  if (navigator.share) {
    navigator.share(shareData)
      .then(() => console.log('Share successful'))
      .catch((error) => {
        console.log('Share failed:', error)
        // Fallback to copy to clipboard
        copyToClipboard(url, title)
      })
  } else {
    // Fallback to copy to clipboard
    copyToClipboard(url, title)
  }
}

// Copy URL to clipboard
function copyToClipboard(url, title) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => {
        showToast('URLをコピーしました')
      })
      .catch(() => {
        // Fallback for older browsers
        fallbackCopyToClipboard(url)
      })
  } else {
    fallbackCopyToClipboard(url)
  }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    document.execCommand('copy')
    showToast('URLをコピーしました')
  } catch (err) {
    alert('URLのコピーに失敗しました')
  }
  
  document.body.removeChild(textArea)
}

// Show toast notification
function showToast(message) {
  // Remove existing toast if any
  const existingToast = document.getElementById('toast-notification')
  if (existingToast) {
    existingToast.remove()
  }
  
  const toast = document.createElement('div')
  toast.id = 'toast-notification'
  toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in'
  toast.innerHTML = `
    <i class="fas fa-check-circle text-green-400"></i>
    <span>${message}</span>
  `
  
  document.body.appendChild(toast)
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transition = 'opacity 0.3s'
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove()
      }
    }, 300)
  }, 3000)
}

// Initialize app
async function initApp() {
  loadDownloadedPdfs()
  
  // Phase 1: Load categories and tags first (very fast)
  await Promise.all([
    loadCategories(),
    loadTags()
  ])
  
  // Restore state from URL if present
  restoreStateFromURL()
  
  // Render UI immediately (without waiting for PDFs)
  renderCategoryFilter()
  renderTagFilter()
  setupEventListeners()
  
  // Show skeleton for PDF area only
  showSkeletonScreen()
  
  // Phase 2: Load PDFs in background (can be slower)
  await loadAllPdfsOnce()
  
  // Render PDF list
  renderPDFList()
  
  // Show welcome message for first-time visitors (after everything is ready)
  checkFirstVisit()
}

// Restore state from URL parameters
function restoreStateFromURL() {
  const params = new URLSearchParams(window.location.search)
  
  // Restore category
  const categoryId = params.get('category')
  if (categoryId) {
    state.selectedCategory = parseInt(categoryId)
  }
  
  // Restore tags
  const tagsParam = params.get('tags')
  if (tagsParam) {
    state.selectedTags = tagsParam.split(',').map(id => parseInt(id))
  }
  
  // Restore search query
  const search = params.get('search')
  if (search) {
    state.searchQuery = search
    const searchInput = document.getElementById('search-input')
    if (searchInput) searchInput.value = search
    const mobileSearchInput = document.getElementById('mobile-search-input')
    if (mobileSearchInput) mobileSearchInput.value = search
  }
}

// Update URL with current state
function updateURL() {
  const params = new URLSearchParams()
  
  if (state.selectedCategory) {
    params.set('category', state.selectedCategory)
  }
  
  if (state.selectedTags.length > 0) {
    params.set('tags', state.selectedTags.join(','))
  }
  
  if (state.searchQuery) {
    params.set('search', state.searchQuery)
  }
  
  const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname
  window.history.pushState({}, '', newURL)
}

// Load all PDFs once (optimized for performance)
async function loadAllPdfsOnce() {
  try {
    const response = await fetch('/api/pdfs')
    state.allPdfs = await response.json()
    
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
    
    // Set initial PDFs for display
    applyFiltersFromAllPdfs()
  } catch (error) {
    console.error('Failed to load all PDFs:', error)
  }
}

// Apply filters from cached allPdfs (faster than API call)
function applyFiltersFromAllPdfs() {
  // Never show skeleton for filtering - only on initial load
  
  // Start with all PDFs
  state.pdfs = [...state.allPdfs]
  
  // Apply category filter
  if (state.selectedCategory) {
    state.pdfs = state.pdfs.filter(pdf => pdf.category_id === state.selectedCategory)
  }
  
  // Apply tag filter
  if (state.selectedTags.length > 0) {
    state.pdfs = state.pdfs.filter(pdf => {
      return pdf.tags && pdf.tags.some(tag => state.selectedTags.includes(tag.id))
    })
  }
  
  // Apply search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase()
    state.pdfs = state.pdfs.filter(pdf => {
      return (pdf.title && pdf.title.toLowerCase().includes(query)) ||
             (pdf.description && pdf.description.toLowerCase().includes(query))
    })
  }
  
  // Apply favorite filter
  if (state.showOnlyFavorites) {
    state.pdfs = state.pdfs.filter(pdf => state.favoritePdfs.has(pdf.id))
  }
  
  // Apply sorting
  sortPDFs()
}

// Load data from API
async function loadCategories() {
  try {
    const response = await fetch('/api/categories')
    state.categories = await response.json()
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

async function loadTags() {
  try {
    const response = await fetch('/api/tags')
    state.tags = await response.json()
  } catch (error) {
    console.error('Failed to load tags:', error)
  }
}

async function loadPDFs() {
  // Use cached data instead of API call (no skeleton for filtering)
  applyFiltersFromAllPdfs()
  renderPDFList()
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
    case 'popular':
      state.pdfs.sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
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

// Show skeleton screen
function showSkeletonScreen() {
  const container = document.getElementById('pdf-list')
  if (!container) return
  
  const skeletonCards = Array.from({ length: 8 }, (_, i) => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton-tags">
        <div class="skeleton skeleton-tag"></div>
        <div class="skeleton skeleton-tag"></div>
      </div>
      <div class="skeleton skeleton-date"></div>
    </div>
  `).join('')
  
  container.innerHTML = skeletonCards
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
      <!-- Resource Count and Clear Filter - Simple Design -->
      <div class="flex items-center justify-between px-2 flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <span class="text-gray-500 text-sm">資料の数:</span>
          <span class="text-gray-700 text-sm font-medium">${state.pdfs.length}件</span>
        </div>
        <div class="flex items-center gap-2">
          ${filterText.length > 0 ? `
            <button 
              onclick="clearAllFilters()" 
              class="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
            >
              <i class="fas fa-times-circle"></i>
              <span class="hidden sm:inline">フィルタをクリア</span>
            </button>
          ` : ''}
        </div>
      </div>
      
      <!-- Sort Options and Favorite Filter in One Row (No Wrap on Mobile) -->
      <div class="flex items-center gap-2 px-2 overflow-x-auto">
        <button 
          onclick="changeSortBy('newest')" 
          class="sort-btn ${state.sortBy === 'newest' ? 'active' : ''} px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0"
        >
          <i class="fas fa-clock mr-1"></i>新着順
        </button>
        <button 
          onclick="changeSortBy('oldest')" 
          class="sort-btn ${state.sortBy === 'oldest' ? 'active' : ''} px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0"
        >
          <i class="fas fa-history mr-1"></i>古い順
        </button>
        <button 
          onclick="changeSortBy('popular')" 
          class="sort-btn ${state.sortBy === 'popular' ? 'active' : ''} px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0"
        >
          <i class="fas fa-fire mr-1"></i>人気順
        </button>
        <button 
          onclick="toggleFavoriteFilter()" 
          class="favorite-filter-btn ${state.showOnlyFavorites ? 'active' : ''} px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0"
        >
          <i class="fas fa-heart"></i>
          <span>お気に入り${state.showOnlyFavorites ? `(${state.favoritePdfs.size})` : ''}</span>
        </button>
      </div>
    </div>
  `
  
  // Show bulk download button if category is selected
  if (state.selectedCategory) {
    const selectedCat = state.categories.find(cat => cat.id === state.selectedCategory)
    const downloadUrl = selectedCat?.download_url
    
    // Always use button with confirmation, whether download URL is set or not
    html += `
      <div class="col-span-full mb-4">
        <button 
          onclick="showBulkDownloadConfirmation()"
          class="w-full px-6 py-4 bg-gradient-to-r from-primary to-red-600 text-white rounded-xl hover:from-red-600 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-2xl font-bold text-lg flex items-center justify-center gap-3"
        >
          <i class="fas fa-download text-2xl"></i>
          <span>カテゴリ内を全ダウンロード</span>
        </button>
      </div>
    `
  }
  
  html += state.pdfs.map((pdf, index) => {
    // Only use Google Drive URL
    const downloadUrl = pdf.google_drive_url || ''
    const downloaded = isDownloaded(pdf.id)
    const favorite = isFavorite(pdf.id)
    const bgColor = downloaded ? 'bg-[#f4eee0]' : 'bg-white'
    
    // Check if uploaded within 7 days
    const isNew = isWithin7Days(pdf.created_at)
    
    return `
    <div 
      onclick="${downloadUrl ? `showDownloadConfirmation(${pdf.id}, '${escapeHtml(pdf.title)}', '${downloadUrl}')` : `alert('このPDFのURLが設定されていません')`}"
      class="pdf-card ${bgColor} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 cursor-pointer"
      style="position: relative;"
    >
      <div class="p-4">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="text-sm font-bold text-gray-800 leading-snug break-words flex-1">
            ${escapeHtml(pdf.title)}
          </h3>
          ${isNew ? '<span class="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded border border-yellow-300 flex-shrink-0">NEW</span>' : ''}
        </div>
        
        ${pdf.tags && pdf.tags.length > 0 ? `
          <div class="flex flex-wrap gap-1 mb-2">
            ${pdf.tags.map(tag => `
              <span class="badge badge-tag text-xs px-2 py-1">
                ${escapeHtml(tag.name)}
              </span>
            `).join('')}
          </div>
        ` : ''}
        
        <div class="flex items-center justify-between text-xs text-gray-500 mt-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span>${formatDate(pdf.created_at)}</span>
            <span>総DL数: ${pdf.download_count || 0}件</span>
            ${downloaded ? '<span class="text-primary font-semibold"><i class="fas fa-check-circle mr-1"></i>ダウンロード済み</span>' : ''}
          </div>
          <div class="flex items-center gap-2">
            <button 
              onclick="sharePDF(event, ${pdf.id}, '${escapeHtml(pdf.title)}', '${downloadUrl}')"
              class="share-btn-small"
              title="シェア"
              style="flex-shrink: 0;"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
            <button 
              onclick="toggleFavorite(event, ${pdf.id})"
              class="favorite-btn-small ${favorite ? 'active' : ''}"
              title="${favorite ? 'お気に入りから削除' : 'お気に入りに追加'}"
              style="flex-shrink: 0;"
            >
              <i class="fas fa-heart"></i>
            </button>
          </div>
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
async function confirmDownload(pdfId, url) {
  // Mark as downloaded
  markAsDownloaded(pdfId)
  
  // Increment download count
  try {
    await fetch(`/api/pdfs/${pdfId}/download`, { method: 'POST' })
    // Update local state
    const pdf = state.allPdfs.find(p => p.id === pdfId)
    if (pdf) {
      pdf.download_count = (pdf.download_count || 0) + 1
    }
  } catch (error) {
    console.error('Failed to increment download count:', error)
  }
  
  // Open Google Drive URL in new tab
  window.open(url, '_blank')
  
  // Close modal
  closeDownloadModal()
  
  // Re-render PDF list to update card color and count
  renderPDFList()
}

// Filter functions
function showBulkDownloadConfirmation() {
  if (!state.selectedCategory) return
  
  // Get URLs from cached data
  const pdfsInCategory = state.allPdfs.filter(pdf => 
    pdf.category_id === state.selectedCategory && pdf.google_drive_url
  )
  
  if (pdfsInCategory.length === 0) {
    alert('このカテゴリにはファイルがありません')
    return
  }
  
  // Get category name
  const category = state.categories.find(c => c.id === state.selectedCategory)
  const categoryName = category ? category.name : 'このカテゴリ'
  
  // Create confirmation modal
  const modalHtml = `
    <div id="bulk-download-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onclick="closeBulkDownloadModal(event)">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all" onclick="event.stopPropagation()">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary bg-opacity-10 mb-4">
            <i class="fas fa-download text-3xl text-primary"></i>
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            カテゴリ内のPDFを一括ダウンロードしますか？
          </h3>
          
          <p class="text-sm text-gray-600 mb-2">
            <span class="font-semibold text-primary">${categoryName}</span>
          </p>
          
          <p class="text-sm text-gray-500 mb-6">
            ${pdfsInCategory.length}個のファイルをまとめてダウンロードします
          </p>
          
          <div class="flex gap-3">
            <button 
              onclick="closeBulkDownloadModal()"
              class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              キャンセル
            </button>
            <button 
              onclick="confirmBulkDownload()"
              class="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-lg"
            >
              <i class="fas fa-check mr-2"></i>ダウンロード
            </button>
          </div>
        </div>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', modalHtml)
}

// Close bulk download modal
function closeBulkDownloadModal(event) {
  if (event && event.target.id !== 'bulk-download-modal') return
  const modal = document.getElementById('bulk-download-modal')
  if (modal) {
    modal.remove()
  }
}

// Confirm and start bulk download
async function confirmBulkDownload() {
  if (!state.selectedCategory) return
  
  // Get category info
  const category = state.categories.find(c => c.id === state.selectedCategory)
  const downloadUrl = category?.download_url
  
  // Close modal first
  closeBulkDownloadModal()
  
  // If category has a download URL, use it
  if (downloadUrl) {
    window.open(downloadUrl, '_blank')
    return
  }
  
  // Otherwise, download individual files
  // Get URLs from cached data
  const pdfsInCategory = state.allPdfs.filter(pdf => 
    pdf.category_id === state.selectedCategory && pdf.google_drive_url
  )
  
  // Increment download count for all PDFs in category
  try {
    await fetch(`/api/categories/${state.selectedCategory}/download`, { method: 'POST' })
    // Update local state for all PDFs in category
    pdfsInCategory.forEach(pdf => {
      pdf.download_count = (pdf.download_count || 0) + 1
      // Mark each as downloaded
      markAsDownloaded(pdf.id)
    })
  } catch (error) {
    console.error('Failed to increment download counts:', error)
  }
  
  // Open each URL in a new tab with a small delay to avoid browser blocking
  for (let i = 0; i < pdfsInCategory.length; i++) {
    setTimeout(() => {
      window.open(pdfsInCategory[i].google_drive_url, '_blank')
    }, i * 500) // 500ms delay between each
  }
  
  // Re-render to update counts and colors
  renderPDFList()
}

async function bulkDownloadCategory() {
  // Show confirmation modal instead of directly downloading
  showBulkDownloadConfirmation()
}

function filterByCategory(categoryId) {
  state.selectedCategory = categoryId
  updateURL()
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
  updateURL()
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
  
  // Update URL
  updateURL()
  
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
    updateURL()
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
    updateURL()
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

// Check if date is within 7 days
function isWithin7Days(dateString) {
  if (!dateString) return false
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
