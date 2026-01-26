// State management - use window object to avoid redeclaration
if (!window.state) {
  window.state = {
    pdfs: [],
    articles: [], // Infographic articles
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
    showOnlyFavorites: false, // Filter to show only favorites
    showDownloadHistory: false, // Filter to show only downloaded PDFs
    multiSelectMode: false, // Multi-select mode
    selectedPdfs: new Set(), // Selected PDFs in multi-select mode
    showAllMobile: false, // Show all cards on mobile (default: false, show 15)
    viewMode: 'grid', // View mode: 'grid' or 'list'
    darkMode: false // Dark mode
  }
}
// Reference state from window (no const/let/var to avoid redeclaration)
var state = window.state;

// Utility: Convert Google Drive URL to direct image URL
function convertGoogleDriveUrl(url) {
  if (!url) return null
  
  // Already converted to googleusercontent format (best for CORS)
  if (url.includes('googleusercontent.com')) {
    return url
  }
  
  // Already converted to uc format
  if (url.includes('drive.google.com/uc?')) {
    return url
  }
  
  // Extract file ID from various Google Drive URL formats
  let fileId = null
  
  // Format: https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing or /view
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (match1) {
    fileId = match1[1]
  }
  
  // Format: https://drive.google.com/open?id={FILE_ID}
  if (!fileId) {
    const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (match2) {
      fileId = match2[1]
    }
  }
  
  // If file ID found, convert to googleusercontent format (better CORS support)
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`
  }
  
  // Return original URL if no conversion needed
  return url
}

// Google Analytics Event Tracking
function trackGAEvent(eventName, params = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, params)
  }
}

// Track page view
function trackPageView(pagePath, pageTitle) {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'G-JPMZ82RMGG', {
      page_path: pagePath,
      page_title: pageTitle
    })
  }
}

// Load downloaded PDFs from localStorage
function loadDownloadedPdfs() {
  try {
    const downloaded = localStorage.getItem('downloaded_pdfs')
    if (downloaded) {
      state.downloadedPdfs = new Set(JSON.parse(downloaded))
    }
  } catch (error) {
  }
  
  // Load favorite PDFs
  try {
    const favorites = localStorage.getItem('favorite_pdfs')
    if (favorites) {
      state.favoritePdfs = new Set(JSON.parse(favorites))
    }
  } catch (error) {
  }
  
  // Load sort preference
  try {
    const sortBy = localStorage.getItem('sort_by')
    if (sortBy && ['newest', 'oldest', 'popular'].includes(sortBy)) {
      state.sortBy = sortBy
    }
  } catch (error) {
  }
  
  // Load view mode preference
  try {
    const viewMode = localStorage.getItem('view_mode')
    if (viewMode && ['grid', 'list'].includes(viewMode)) {
      state.viewMode = viewMode
    }
  } catch (error) {
  }
  
  // Load dark mode preference
  try {
    const darkMode = localStorage.getItem('dark_mode')
    if (darkMode === 'true') {
      state.darkMode = true
      applyDarkMode()
    }
  } catch (error) {
  }
}

// Save downloaded PDF to localStorage
function markAsDownloaded(pdfId) {
  state.downloadedPdfs.add(pdfId)
  try {
    localStorage.setItem('downloaded_pdfs', JSON.stringify([...state.downloadedPdfs]))
  } catch (error) {
  }
}

// Check download milestone and show celebration
function checkDownloadMilestone(url) {
  const downloadCount = state.downloadedPdfs.size
  
  // First download popup disabled - go directly to download
  // const firstDownloadShown = localStorage.getItem('first_download_shown')
  // if (downloadCount === 1 && !firstDownloadShown) {
  //   showFirstDownloadMessage(url)
  //   localStorage.setItem('first_download_shown', 'true')
  //   return true // Milestone shown
  // }
  
  // Check if reached 5 downloads milestone
  const celebrationShown = localStorage.getItem('celebration_5_shown')
  if (downloadCount === 5 && !celebrationShown) {
    showCelebration(url)
    localStorage.setItem('celebration_5_shown', 'true')
    return true // Milestone shown
  }
  
  return false // No milestone
}

// Store pending download URL
window.pendingDownloadUrl = window.pendingDownloadUrl || null

// Show first download message (simple and clean)
function showFirstDownloadMessage(url) {
  window.pendingDownloadUrl = url
  const modalHtml = `
    <div class="first-download-modal" id="first-download-modal">
      <div class="first-download-content" onclick="event.stopPropagation()">
        <div class="first-download-emoji">📚</div>
        <h2 class="first-download-title">はじめてのダウンロード</h2>
        <p class="first-download-message">
          資料をダウンロードしていただき<br>
          ありがとうございます！<br>
          素敵な学びの時間をお過ごしください 😊
        </p>
        <button class="first-download-button" onclick="proceedToDownload()">
          <i class="fas fa-download mr-2"></i>
          ダウンロードページへ
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

// Proceed to download from first download modal
function proceedToDownload() {
  const modal = document.getElementById('first-download-modal')
  if (modal) {
    modal.remove()
  }
  if (window.pendingDownloadUrl) {
    window.open(window.pendingDownloadUrl, '_blank')
    window.pendingDownloadUrl = null
  }
}

// Check if first visit and show welcome message
function checkFirstVisit() {
  // Welcome message removed - no longer showing on first visit
  const hasVisited = localStorage.getItem('has_visited')
  
  if (!hasVisited) {
    localStorage.setItem('has_visited', 'true')
  }
}

// Show celebration modal
function showCelebration(url) {
  window.pendingDownloadUrl = url
  const modalHtml = `
    <div class="celebration-modal" id="celebration-modal">
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
        <button class="celebration-button" onclick="proceedToCelebrationDownload()">
          <i class="fas fa-download mr-2"></i>
          ダウンロードページへ 🎊
        </button>
      </div>
    </div>
  `
  
  document.body.insertAdjacentHTML('beforeend', modalHtml)
}

// Generate confetti elements (more confetti!)
function generateConfetti() {
  let confetti = ''
  const emojis = ['🎉', '🎊', '✨', '🌟', '💫', '⭐', '🎈', '🎁']
  for (let i = 0; i < 30; i++) {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]
    const left = Math.random() * 100
    const animationDelay = Math.random() * 3
    const animationDuration = 3 + Math.random() * 2
    confetti += `<div class="confetti" style="left: ${left}%; animation-delay: ${animationDelay}s; animation-duration: ${animationDuration}s;">${emoji}</div>`
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

// Proceed to download from celebration modal
function proceedToCelebrationDownload() {
  const modal = document.getElementById('celebration-modal')
  if (modal) {
    modal.remove()
  }
  if (window.pendingDownloadUrl) {
    window.open(window.pendingDownloadUrl, '_blank')
    window.pendingDownloadUrl = null
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
  
  const isAdding = !state.favoritePdfs.has(pdfId)
  
  if (state.favoritePdfs.has(pdfId)) {
    state.favoritePdfs.delete(pdfId)
  } else {
    state.favoritePdfs.add(pdfId)
  }
  
  // Track favorite event
  const pdf = state.allPdfs.find(p => p.id === pdfId)
  if (pdf) {
    trackGAEvent(isAdding ? 'favorite_add' : 'favorite_remove', {
      pdf_id: pdfId,
      pdf_title: pdf.title,
      category: pdf.category_name || 'Unknown'
    })
  }
  
  // Save to localStorage
  try {
    localStorage.setItem('favorite_pdfs', JSON.stringify([...state.favoritePdfs]))
  } catch (error) {
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
  
  // Track share event
  const pdf = state.allPdfs.find(p => p.id === pdfId)
  trackGAEvent('share', {
    pdf_id: pdfId,
    pdf_title: title,
    category: pdf && pdf.category_name ? pdf.category_name : 'Unknown',
    method: navigator.share ? 'web_share_api' : 'clipboard'
  })
  
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

// showToast is now in utils.js

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
  
  // Phase 2: Load PDFs and articles in background (can be slower)
  await Promise.all([
    loadAllPdfsOnce(),
    loadArticles()
  ])
  
  // Re-render category filter with counts
  renderCategoryFilter()
  
  // Render PDF list (includes articles)
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
  }
}

// Load published articles
async function loadArticles() {
  try {
    const response = await fetch('/api/articles')
    state.articles = await response.json()
  } catch (error) {
    console.error('Failed to load articles:', error)
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
  
  // Apply download history filter
  if (state.showDownloadHistory) {
    state.pdfs = state.pdfs.filter(pdf => state.downloadedPdfs.has(pdf.id))
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
  }
}

async function loadTags() {
  try {
    const response = await fetch('/api/tags')
    state.tags = await response.json()
  } catch (error) {
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
  }
  
  // Re-sort and re-render
  sortPDFs()
  renderPDFList()
}

// Change view mode
function changeViewMode(mode) {
  state.viewMode = mode
  
  // Save to localStorage
  try {
    localStorage.setItem('view_mode', mode)
  } catch (error) {
  }
  
  // Re-render
  renderPDFList()
}

// Render functions
function renderCategoryFilter() {
  const container = document.getElementById('category-filter')
  if (!container) return
  
  const totalCount = Object.values(state.categoryCounts).reduce((sum, count) => sum + count, 0)
  
  // Sort categories by count (descending)
  const sortedCategories = [...state.categories].sort((a, b) => {
    const countA = state.categoryCounts[a.id] || 0
    const countB = state.categoryCounts[b.id] || 0
    return countB - countA
  })
  
  const html = `
    <div class="mb-8">
      <h2 class="text-base font-semibold mb-3 text-darker flex items-center">
        <i class="fas fa-layer-group mr-2 text-primary"></i>カテゴリ
      </h2>
      <div class="space-y-1">
        <a 
          href="/categories"
          class="category-btn ${!state.selectedCategory ? 'active' : ''} w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm block hover:no-underline"
          aria-label="すべてのカテゴリを表示"
          role="link"
        >
          <span>
            <i class="fas fa-th-large mr-2 text-xs" aria-hidden="true"></i>すべて
          </span>
          ${totalCount > 0 ? `<span class="badge bg-primary text-white px-1.5 py-0.5 rounded-full text-xs font-medium">${totalCount}</span>` : ''}
        </a>
        ${sortedCategories.map(cat => {
          const count = state.categoryCounts[cat.id] || 0
          const isCurrentPage = window.location.pathname === '/categories' || window.location.pathname === '/'
          return `
            <a 
              href="/categories?category=${cat.id}"
              ${isCurrentPage ? `onclick="event.preventDefault(); filterByCategory(${cat.id}); return false;"` : ''}
              class="category-btn ${state.selectedCategory === cat.id ? 'active' : ''} w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm block hover:no-underline"
              aria-label="${escapeHtml(cat.name)}カテゴリを表示 ${count > 0 ? count + '件' : ''}"
              role="link"
            >
              <span>
                <i class="fas fa-folder mr-2 text-xs" aria-hidden="true"></i>${escapeHtml(cat.name)}
              </span>
              ${count > 0 ? `<span class="badge bg-gray-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">${count}</span>` : ''}
            </a>
          `
        }).join('')}
      </div>
    </div>
    
    <!-- Tags Section (at bottom) -->
    <div class="mb-6 pt-3 border-t-2 border-gray-200">
      <h2 class="text-base font-semibold mb-3 text-darker flex items-center">
        <i class="fas fa-tags mr-2 text-primary"></i>タグ
      </h2>
      <div class="flex flex-wrap gap-1.5">
        ${state.tags.map(tag => `
          <button 
            onclick="toggleTag(${tag.id})" 
            class="tag-btn ${state.selectedTags.includes(tag.id) ? 'active' : ''} px-2.5 py-1.5 rounded-full text-xs font-medium"
            aria-label="${escapeHtml(tag.name)}タグでフィルター"
            aria-pressed="${state.selectedTags.includes(tag.id)}"
            role="button"
          >
            <i class="fas fa-tag mr-1 text-xs" aria-hidden="true"></i>${escapeHtml(tag.name)}
          </button>
        `).join('')}
      </div>
    </div>
  `
  container.innerHTML = html
  
  // Update download history button style
  const downloadHistoryBtn = document.getElementById('download-history-btn')
  if (downloadHistoryBtn) {
    if (state.showDownloadHistory) {
      downloadHistoryBtn.classList.remove('bg-pink-50', 'hover:bg-pink-100', 'text-pink-700', 'border-pink-200')
      downloadHistoryBtn.classList.add('bg-pink-200', 'hover:bg-pink-300', 'text-pink-800', 'border-pink-400')
    } else {
      downloadHistoryBtn.classList.remove('bg-pink-200', 'hover:bg-pink-300', 'text-pink-800', 'border-pink-400')
      downloadHistoryBtn.classList.add('bg-pink-50', 'hover:bg-pink-100', 'text-pink-700', 'border-pink-200')
    }
  }
}

function renderCategoryFilterWithCounts(counts) {
  // This function is no longer needed
  renderCategoryFilter()
}

function renderTagFilter() {
  // Tags are now rendered in renderCategoryFilter
  // This function is kept for compatibility but does nothing
}

// Multi-select mode functions
function enterMultiSelectMode(pdfId) {
  state.multiSelectMode = true
  state.selectedPdfs.add(pdfId)
  renderPDFList()
  showMultiSelectToolbar()
}

function exitMultiSelectMode() {
  state.multiSelectMode = false
  state.selectedPdfs.clear()
  renderPDFList()
  hideMultiSelectToolbar()
}

function togglePdfSelection(event, pdfId) {
  event.stopPropagation()
  
  if (!state.multiSelectMode) {
    enterMultiSelectMode(pdfId)
    return
  }
  
  if (state.selectedPdfs.has(pdfId)) {
    state.selectedPdfs.delete(pdfId)
  } else {
    state.selectedPdfs.add(pdfId)
  }
  
  // If no PDFs selected, exit multi-select mode
  if (state.selectedPdfs.size === 0) {
    exitMultiSelectMode()
    return
  }
  
  renderPDFList()
  updateMultiSelectToolbar()
}

function openSelectedPdfs() {
  const selectedPdfData = state.allPdfs.filter(pdf => state.selectedPdfs.has(pdf.id))
  
  if (selectedPdfData.length === 0) {
    alert('PDFが選択されていません')
    return
  }
  
  // Confirm if many PDFs
  if (selectedPdfData.length > 5) {
    if (!confirm(`${selectedPdfData.length}個のPDFを開きますか？ブラウザがポップアップをブロックする可能性があります。`)) {
      return
    }
  }
  
  // Open each URL with delay
  selectedPdfData.forEach((pdf, index) => {
    if (pdf.google_drive_url) {
      setTimeout(() => {
        window.open(pdf.google_drive_url, '_blank')
        // Mark as downloaded
        markAsDownloaded(pdf.id)
      }, index * 300) // 300ms delay between each
    }
  })
  
  // Exit multi-select mode
  exitMultiSelectMode()
  
  // Re-render to update download status
  renderPDFList()
}

function showMultiSelectToolbar() {
  const toolbar = document.createElement('div')
  toolbar.id = 'multi-select-toolbar'
  toolbar.className = 'fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary shadow-2xl z-50 animate-slide-up'
  toolbar.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-lg font-bold text-primary flex items-center">
          <i class="fas fa-check-circle mr-2"></i>
          <span class="flex flex-col leading-tight">
            <span id="selected-count">${state.selectedPdfs.size}</span>
            <span class="text-xs">選択</span>
          </span>
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button 
          onclick="openSelectedPdfs()"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-all font-semibold shadow-lg flex items-center gap-2"
        >
          <i class="fas fa-external-link-alt"></i>
          <span class="flex flex-col leading-tight text-left">
            <span>まとめて</span>
            <span>ひらく</span>
          </span>
        </button>
        <button 
          onclick="exitMultiSelectMode()"
          class="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
        >
          やめる
        </button>
      </div>
    </div>
  `
  document.body.appendChild(toolbar)
}

function hideMultiSelectToolbar() {
  const toolbar = document.getElementById('multi-select-toolbar')
  if (toolbar) {
    toolbar.remove()
  }
}

function updateMultiSelectToolbar() {
  const countElement = document.getElementById('selected-count')
  if (countElement) {
    countElement.textContent = state.selectedPdfs.size
  }
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
    if (state.showDownloadHistory) {
      container.innerHTML = `
        <div class="col-span-full">
          <div class="bg-gradient-to-r from-pink-50 to-pink-100 border-2 border-pink-300 rounded-xl p-6 shadow-lg mb-6">
            <h2 class="text-2xl font-bold text-pink-800 flex items-center gap-3">
              <i class="fas fa-history"></i>
              <span>ダウンロード履歴</span>
            </h2>
            <p class="text-pink-700 mt-2 text-sm">
              過去にダウンロードした資料が表示されています（${state.downloadedPdfs.size}件）
            </p>
          </div>
          <div class="text-center py-16">
            <i class="fas fa-download text-7xl mb-4 text-pink-300"></i>
            <p class="text-xl font-medium text-pink-700">まだダウンロード履歴がありません</p>
            <p class="text-sm text-gray-600 mt-2">資料をダウンロードすると、ここに履歴が表示されます</p>
          </div>
        </div>
      `
    } else {
      container.innerHTML = `
        <div class="col-span-full text-center py-16 text-gray-600">
          <i class="fas fa-inbox text-7xl mb-4 text-gray-300"></i>
          <p class="text-xl font-medium">資料が見つかりませんでした</p>
        </div>
      `
    }
    return
  }
  
  let html = ''
  
  // Show download history title
  if (state.showDownloadHistory) {
    html += `
      <div class="col-span-full mb-6">
        <div class="bg-gradient-to-r from-pink-50 to-pink-100 border-2 border-pink-300 rounded-xl p-6 shadow-lg">
          <h2 class="text-2xl font-bold text-pink-800 flex items-center gap-3">
            <i class="fas fa-history"></i>
            <span>ダウンロード履歴</span>
          </h2>
          <p class="text-pink-700 mt-2 text-sm">
            過去にダウンロードした資料が表示されています（${state.downloadedPdfs.size}件）
          </p>
        </div>
      </div>
    `
  }
  
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
              aria-label="すべてのフィルタをクリア"
            >
              <i class="fas fa-times-circle" aria-hidden="true"></i>
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
          aria-label="新着順でソート"
          aria-pressed="${state.sortBy === 'newest'}"
        >
          <i class="fas fa-clock mr-1" aria-hidden="true"></i>新着順
        </button>
        <button 
          onclick="changeSortBy('oldest')" 
          class="sort-btn ${state.sortBy === 'oldest' ? 'active' : ''} px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0"
          aria-label="古い順でソート"
          aria-pressed="${state.sortBy === 'oldest'}"
        >
          <i class="fas fa-history mr-1" aria-hidden="true"></i>古い順
        </button>
        <button 
          onclick="changeSortBy('popular')" 
          class="sort-btn ${state.sortBy === 'popular' ? 'active' : ''} px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0"
          aria-label="人気順でソート"
          aria-pressed="${state.sortBy === 'popular'}"
        >
          <i class="fas fa-fire mr-1" aria-hidden="true"></i>人気順
        </button>
        <button 
          onclick="toggleFavoriteFilter()" 
          class="favorite-filter-btn ${state.showOnlyFavorites ? 'active' : ''} px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0"
          title="${state.showOnlyFavorites ? `お気に入りのみ表示中 (${state.favoritePdfs.size})` : 'お気に入りのみ表示'}"
          aria-label="${state.showOnlyFavorites ? `お気に入りフィルタを解除 (${state.favoritePdfs.size}件)` : 'お気に入りのみ表示'}"
          aria-pressed="${state.showOnlyFavorites}"
        >
          <i class="fas fa-heart"></i>
          <span class="hidden sm:inline">お気に入り</span>
          ${state.showOnlyFavorites ? `<span class="text-xs">(${state.favoritePdfs.size})</span>` : ''}
        </button>
        
        <!-- Separator (PC only) -->
        <div class="w-px h-6 bg-gray-300 flex-shrink-0 hidden lg:block"></div>
        
        <!-- View Mode Toggle (PC only) -->
        <button 
          onclick="changeViewMode('grid')" 
          class="view-mode-btn ${state.viewMode === 'grid' ? 'active' : ''} px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 hidden lg:flex"
          title="グリッド表示"
          aria-label="グリッド表示に切り替え"
          aria-pressed="${state.viewMode === 'grid'}"
        >
          <i class="fas fa-th"></i>
        </button>
        <button 
          onclick="changeViewMode('list')" 
          class="view-mode-btn ${state.viewMode === 'list' ? 'active' : ''} px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 hidden lg:flex"
          title="リスト表示"
          aria-label="リスト表示に切り替え"
          aria-pressed="${state.viewMode === 'list'}"
        >
          <i class="fas fa-list"></i>
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
  
  // Combine PDFs and articles into a unified list
  const combinedItems = [
    ...state.pdfs.map(pdf => ({ type: 'pdf', data: pdf, created_at: pdf.created_at })),
    ...state.articles
      .filter(article => article.published)
      .filter(article => {
        // Apply category filter
        if (state.selectedCategory && article.category_id !== state.selectedCategory) {
          return false
        }
        // Apply search filter
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase()
          const title = (article.title || '').toLowerCase()
          const summary = (article.summary || '').toLowerCase()
          return title.includes(query) || summary.includes(query)
        }
        return true
      })
      .map(article => ({ type: 'article', data: article, created_at: article.created_at }))
  ]
  
  // Sort combined items by created_at
  combinedItems.sort((a, b) => {
    if (state.sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at)
    } else if (state.sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at)
    }
    // For 'popular', keep original order (PDFs first, then articles)
    return 0
  })
  
  // Determine how many items to show on mobile
  const isMobile = window.innerWidth < 1024 // lg breakpoint
  const isTopPage = !state.selectedCategory && state.selectedTags.length === 0 && !state.searchQuery && !state.showOnlyFavorites && !state.showDownloadHistory
  let itemsToShow = combinedItems
  let hasMore = false
  
  // On mobile top page, limit to 15 cards unless "show all" is clicked
  if (isMobile && isTopPage && !state.showAllMobile && combinedItems.length > 15) {
    itemsToShow = combinedItems.slice(0, 15)
    hasMore = true
  }
  
  html += itemsToShow.map((item, index) => {
    // Render article card (legacy - keep for compatibility)
    if (item.type === 'article') {
      return renderArticleCard(item.data)
    }
    
    // Render infographic article card (from new unified API)
    if (item.type === 'pdf' && item.data.source_type === 'infographic') {
      return renderInfographicCard(item.data)
    }
    
    // Render PDF card
    const pdf = item.data
    // Only use Google Drive URL
    const downloadUrl = pdf.google_drive_url || ''
    const downloaded = isDownloaded(pdf.id)
    const favorite = isFavorite(pdf.id)
    const isSelected = state.selectedPdfs.has(pdf.id)
    const bgColor = isSelected ? 'bg-blue-50 border-blue-500' : (downloaded ? 'bg-[#f4eee0]' : 'bg-white')
    
    // Card click handler - Direct download without confirmation
    const cardClick = state.multiSelectMode 
      ? `togglePdfSelection(event, ${pdf.id})`
      : (downloadUrl ? `confirmDownload(${pdf.id}, '${downloadUrl}')` : `alert('このPDFのURLが設定されていません')`)
    
    // List view
    if (state.viewMode === 'list') {
      return `
      <div 
        onclick="${cardClick}"
        ontouchstart="handleTouchStart(event, ${pdf.id})"
        ontouchend="handleTouchEnd(event)"
        class="col-span-full pdf-card-list ${bgColor} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 cursor-pointer"
        style="position: relative;"
        data-pdf-id="${pdf.id}"
      >
        ${isSelected ? `
          <div class="absolute top-4 left-4 z-10 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
            <i class="fas fa-check text-lg"></i>
          </div>
        ` : ''}
        <div class="p-4 flex items-center gap-4">
          <div class="flex-1">
            <h3 class="text-base font-bold text-gray-800 leading-snug break-words mb-2">
              ${escapeHtml(pdf.title)}
            </h3>
            
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span><i class="fas fa-calendar mr-1"></i>${formatDate(pdf.created_at)}</span>
              <span><i class="fas fa-download mr-1"></i>総DL数: ${pdf.download_count || 0}件</span>
              ${pdf.category_name ? `<span><i class="fas fa-folder mr-1"></i>${escapeHtml(pdf.category_name)}</span>` : ''}
              ${downloaded ? '<span class="text-primary font-semibold"><i class="fas fa-check-circle mr-1"></i>ダウンロード済み</span>' : ''}
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              onclick="sharePDF(event, ${pdf.id}, '${escapeHtml(pdf.title)}', '${downloadUrl}')"
              class="share-btn-small"
              title="シェア"
              aria-label="${escapeHtml(pdf.title)}をシェア"
            >
              <i class="fas fa-paper-plane" aria-hidden="true"></i>
            </button>
            <button 
              onclick="toggleFavorite(event, ${pdf.id})"
              class="favorite-btn-small ${favorite ? 'active' : ''}"
              title="${favorite ? 'お気に入りから削除' : 'お気に入りに追加'}"
              aria-label="${favorite ? 'お気に入りから削除' : 'お気に入りに追加'}"
              aria-pressed="${favorite}"
            >
              <i class="fas fa-heart" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    `
    }
    
    // Grid view (default) - 4:5 ratio with thumbnail
    // If thumbnail exists: show only image
    // If no thumbnail: show title and date
    return `
    <div 
      onclick="${cardClick}"
      ontouchstart="handleTouchStart(event, ${pdf.id})"
      ontouchend="handleTouchEnd(event)"
      class="pdf-card ${bgColor} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 cursor-pointer flex flex-col"
      style="position: relative;"
      data-pdf-id="${pdf.id}"
    >
      ${isSelected ? `
        <div class="absolute top-2 left-2 z-10 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
          <i class="fas fa-check text-lg"></i>
        </div>
      ` : ''}
      
      ${pdf.thumbnail_url ? `
        <!-- Thumbnail only (4:5 ratio) - No title/date -->
        <div class="relative w-full" style="padding-bottom: 125%;">
          <img 
            src="${convertGoogleDriveUrl(pdf.thumbnail_url)}" 
            alt="${escapeHtml(pdf.title)}"
            class="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onerror="console.error('Failed to load image for PDF ${pdf.id}: ${escapeHtml(pdf.title)}', this.src); this.style.display='none'; this.parentElement.innerHTML='<div class=\\'absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600\\'><i class=\\'fas fa-file-pdf text-white text-6xl opacity-30\\'></i></div>'"
            onload="console.log('Successfully loaded image for PDF ${pdf.id}: ${escapeHtml(pdf.title)}')"
          />
          ${downloaded ? `
            <div class="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              <i class="fas fa-check-circle mr-1"></i>DL済
            </div>
          ` : ''}
          <!-- Action buttons overlay on image -->
          <div class="absolute bottom-2 right-2 flex items-center gap-2">
            <button 
              onclick="sharePDF(event, ${pdf.id}, '${escapeHtml(pdf.title)}', '${downloadUrl}')"
              class="share-btn-small bg-white bg-opacity-90 hover:bg-opacity-100"
              title="シェア"
              style="flex-shrink: 0;"
              aria-label="${escapeHtml(pdf.title)}をシェア"
            >
              <i class="fas fa-paper-plane" aria-hidden="true"></i>
            </button>
            <button 
              onclick="toggleFavorite(event, ${pdf.id})"
              class="favorite-btn-small ${favorite ? 'active' : ''} bg-white bg-opacity-90 hover:bg-opacity-100"
              title="${favorite ? 'お気に入りから削除' : 'お気に入りに追加'}"
              style="flex-shrink: 0;"
              aria-label="${favorite ? 'お気に入りから削除' : 'お気に入りに追加'}"
              aria-pressed="${favorite}"
            >
              <i class="fas fa-heart" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      ` : `
        <!-- No thumbnail - Show title and date (4:5 ratio) -->
        <div class="relative w-full" style="padding-bottom: 125%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div class="absolute inset-0 flex items-center justify-center">
            <i class="fas fa-file-pdf text-white text-6xl opacity-30"></i>
          </div>
          ${downloaded ? `
            <div class="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              <i class="fas fa-check-circle mr-1"></i>DL済
            </div>
          ` : ''}
        </div>
        
        <!-- Content - Only shown when no thumbnail -->
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="text-sm font-bold text-gray-800 leading-snug break-words mb-2 line-clamp-2 flex-1">
            ${escapeHtml(pdf.title)}
          </h3>
          
          <div class="flex items-center justify-between text-xs text-gray-500 mt-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs">${formatDate(pdf.created_at)}</span>
              <span class="text-xs">DL: ${pdf.download_count || 0}</span>
            </div>
            <div class="flex items-center gap-2">
              <button 
                onclick="sharePDF(event, ${pdf.id}, '${escapeHtml(pdf.title)}', '${downloadUrl}')"
                class="share-btn-small"
                title="シェア"
                style="flex-shrink: 0;"
                aria-label="${escapeHtml(pdf.title)}をシェア"
              >
                <i class="fas fa-paper-plane" aria-hidden="true"></i>
              </button>
              <button 
                onclick="toggleFavorite(event, ${pdf.id})"
                class="favorite-btn-small ${favorite ? 'active' : ''}"
                title="${favorite ? 'お気に入りから削除' : 'お気に入りに追加'}"
                style="flex-shrink: 0;"
                aria-label="${favorite ? 'お気に入りから削除' : 'お気に入りに追加'}"
                aria-pressed="${favorite}"
              >
                <i class="fas fa-heart" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      `}
    </div>
  `
  }).join('')
  
  // Mobile: Show "More" button if there are more cards
  if (isMobile && hasMore) {
    html += `
      <div class="col-span-full mt-6 text-center">
        <button 
          onclick="showAllMobileCards()"
          class="px-8 py-4 bg-gradient-to-r from-primary to-red-600 text-white rounded-xl hover:from-red-600 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-2xl font-bold text-lg"
          aria-label="もっと見る 残り${state.pdfs.length - 15}件"
        >
          <i class="fas fa-chevron-down mr-2"></i>
          もっと見る（残り${state.pdfs.length - 15}件）
        </button>
      </div>
    `
  }
  
  // Mobile: Show Download History button (only on top page)
  if (isMobile && isTopPage) {
    html += `
      <!-- Mobile: Download History Button -->
      <div class="col-span-full mt-8 lg:hidden">
        <button 
          onclick="toggleDownloadHistory()"
          class="w-full px-4 py-4 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl transition-colors font-bold shadow-lg border-2 border-pink-200 flex items-center justify-center gap-3"
          aria-label="ダウンロード履歴を表示"
        >
          <i class="fas fa-history text-xl"></i>
          <span>ダウンロード履歴</span>
        </button>
      </div>
    `
  }
  
  // Mobile: Show Tags Section (on all pages including category and download history)
  if (isMobile) {
    html += `
      <!-- Mobile: Tags Section -->
      <div class="col-span-full mt-6 lg:hidden">
        <div class="p-6">
          <h2 class="text-lg font-bold mb-4 text-gray-800 flex items-center">
            <i class="fas fa-tags mr-2 text-primary"></i>タグ一覧
          </h2>
          <div class="flex flex-wrap gap-2">
            ${state.tags.map(tag => `
              <button 
                onclick="toggleTag(${tag.id})" 
                class="tag-btn ${state.selectedTags.includes(tag.id) ? 'active' : ''} px-3 py-2 rounded-full text-sm font-medium"
                aria-label="${escapeHtml(tag.name)}タグでフィルター"
                aria-pressed="${state.selectedTags.includes(tag.id)}"
              >
                ${escapeHtml(tag.name)}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `
  }
  
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
  // Get PDF details for tracking
  const pdf = state.allPdfs.find(p => p.id === pdfId)
  const pdfTitle = pdf ? pdf.title : 'Unknown PDF'
  const categoryName = pdf && pdf.category_name ? pdf.category_name : 'Unknown Category'
  
  // Track PDF download event
  trackGAEvent('pdf_download', {
    pdf_id: pdfId,
    pdf_title: pdfTitle,
    category: categoryName,
    url: url
  })
  
  // Mark as downloaded
  markAsDownloaded(pdfId)
  
  // Increment download count
  try {
    await fetch(`/api/pdfs/${pdfId}/download`, { method: 'POST' })
    // Update local state
    if (pdf) {
      pdf.download_count = (pdf.download_count || 0) + 1
    }
  } catch (error) {
  }
  
  // Close download confirmation modal
  closeDownloadModal()
  
  // Check if milestone reached
  const milestoneShown = checkDownloadMilestone(url)
  
  // If no milestone, open URL directly
  if (!milestoneShown) {
    window.open(url, '_blank')
  }
  
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
  
  // Get URLs from cached data
  const pdfsInCategory = state.allPdfs.filter(pdf => 
    pdf.category_id === state.selectedCategory && pdf.google_drive_url
  )
  
  // Mark all PDFs in category as downloaded FIRST
  pdfsInCategory.forEach(pdf => {
    markAsDownloaded(pdf.id)
  })
  
  // If category has a download URL, use it
  if (downloadUrl) {
    // Increment download count for all PDFs in category
    try {
      await fetch(`/api/categories/${state.selectedCategory}/download`, { method: 'POST' })
      // Update local state for all PDFs in category
      pdfsInCategory.forEach(pdf => {
        pdf.download_count = (pdf.download_count || 0) + 1
      })
    } catch (error) {
    }
    
    // Re-render to update counts and colors BEFORE opening URL
    renderPDFList()
    
    // Open the category download URL
    window.open(downloadUrl, '_blank')
    return
  }
  
  // Otherwise, download individual files
  // Increment download count for all PDFs in category
  try {
    await fetch(`/api/categories/${state.selectedCategory}/download`, { method: 'POST' })
    // Update local state for all PDFs in category
    pdfsInCategory.forEach(pdf => {
      pdf.download_count = (pdf.download_count || 0) + 1
    })
  } catch (error) {
  }
  
  // Re-render to update counts and colors BEFORE opening URLs
  renderPDFList()
  
  // Open each URL in a new tab with a small delay to avoid browser blocking
  for (let i = 0; i < pdfsInCategory.length; i++) {
    setTimeout(() => {
      window.open(pdfsInCategory[i].google_drive_url, '_blank')
    }, i * 500) // 500ms delay between each
  }
}

async function bulkDownloadCategory() {
  // Show confirmation modal instead of directly downloading
  showBulkDownloadConfirmation()
}

function filterByCategory(categoryId) {
  // Track category selection
  const category = state.categories.find(c => c.id === categoryId)
  if (category) {
    trackGAEvent('filter_category', {
      category_id: categoryId,
      category_name: category.name
    })
  }
  
  state.selectedCategory = categoryId
  state.showDownloadHistory = false // Clear download history mode
  state.showAllMobile = false // Reset mobile "show all" state
  updateURL()
  renderCategoryFilter()
  loadPDFs()
  
  // Close mobile menu after selection
  closeMobileMenu()
}

function toggleTag(tagId) {
  const index = state.selectedTags.indexOf(tagId)
  const isAdding = index === -1
  
  if (index > -1) {
    state.selectedTags.splice(index, 1)
  } else {
    state.selectedTags.push(tagId)
  }
  
  // Track tag selection
  const tag = state.tags.find(t => t.id === tagId)
  if (tag) {
    trackGAEvent(isAdding ? 'filter_tag_add' : 'filter_tag_remove', {
      tag_id: tagId,
      tag_name: tag.name
    })
  }
  
  state.showDownloadHistory = false // Clear download history mode
  state.showAllMobile = false // Reset mobile "show all" state
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
  state.showDownloadHistory = false
  state.showAllMobile = false // Reset mobile "show all" state
  
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
    sidebar.classList.add('translate-x-full')
    overlay.classList.add('hidden')
  }
}

function searchPDFs() {
  const input = document.getElementById('search-input')
  if (input) {
    state.searchQuery = input.value
    
    // Track search event
    if (state.searchQuery) {
      trackGAEvent('search', {
        search_term: state.searchQuery
      })
    }
    
    state.showDownloadHistory = false // Clear download history mode
    state.showAllMobile = false // Reset mobile "show all" state
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
    
    // Track search event
    if (state.searchQuery) {
      trackGAEvent('search', {
        search_term: state.searchQuery,
        device: 'mobile'
      })
    }
    
    state.showDownloadHistory = false // Clear download history mode
    state.showAllMobile = false // Reset mobile "show all" state
    updateURL()
    loadPDFs()
  }
}

// Mobile menu toggle
function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebar-overlay')
  if (sidebar && overlay) {
    sidebar.classList.toggle('translate-x-full')
    overlay.classList.toggle('hidden')
  }
}

// Toggle favorite filter
function toggleFavoriteFilter() {
  state.showOnlyFavorites = !state.showOnlyFavorites
  state.showAllMobile = false // Reset mobile "show all" state
  loadPDFs()
}

// Toggle download history filter
function toggleDownloadHistory() {
  state.showDownloadHistory = !state.showDownloadHistory
  state.showAllMobile = false // Reset mobile "show all" state
  
  // When showing download history, clear other filters
  if (state.showDownloadHistory) {
    state.selectedCategory = null
    state.selectedTags = []
    state.searchQuery = ''
    state.showOnlyFavorites = false
    
    // Clear search inputs
    const searchInput = document.getElementById('search-input')
    if (searchInput) searchInput.value = ''
    
    const mobileSearchInput = document.getElementById('mobile-search-input')
    if (mobileSearchInput) mobileSearchInput.value = ''
    
    // Update URL
    updateURL()
    
    // Re-render everything
    renderCategoryFilter()
    renderTagFilter()
  }
  
  loadPDFs()
  closeMobileMenu()
}

// Show all cards on mobile
function showAllMobileCards() {
  state.showAllMobile = true
  renderPDFList()
}

// Utility functions are now in utils.js

// Render article card (for infographic articles)
// Render infographic article card (from new unified API)
function renderInfographicCard(article) {
  const categoryName = article.category_name || 'その他'
  
  return `
    <a 
      href="/article/${article.slug}"
      class="infographic-card bg-white hover:bg-pink-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-pink-400 cursor-pointer block"
      style="position: relative;"
      data-article-id="${article.id}"
    >
      <div class="p-4">
        <h3 class="text-sm font-bold text-gray-800 leading-snug break-words mb-2">
          ${escapeHtml(article.title)}
        </h3>
        
        <!-- Infographic Badge -->
        <div class="inline-flex items-center gap-1 px-2 py-1 text-white text-xs font-bold rounded shadow-md mb-2" style="background-color: #E75556;">
          <i class="fas fa-chart-bar"></i>
          <span>infographic</span>
        </div>
        
        <div class="flex items-center justify-between text-xs text-gray-500 mt-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span><i class="fas fa-calendar mr-1"></i>${formatDate(article.created_at)}</span>
            ${categoryName ? `<span><i class="fas fa-folder mr-1"></i>${escapeHtml(categoryName)}</span>` : ''}
          </div>
        </div>
      </div>
    </a>
  `
}

function renderArticleCard(article) {
  const categoryName = article.category_name || 'その他'
  
  return `
    <a 
      href="/article/${article.slug}"
      class="article-card bg-white hover:bg-pink-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-pink-400 cursor-pointer block"
      style="position: relative;"
      data-article-id="${article.id}"
    >
      <!-- Article Badge -->
      <div class="absolute top-2 right-2 z-10 px-2 py-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold rounded shadow-md flex items-center gap-1">
        <i class="fas fa-newspaper"></i>
        <span>記事</span>
      </div>
      
      ${article.thumbnail_url ? `
        <div class="aspect-video overflow-hidden bg-gray-100">
          <img 
            src="${article.thumbnail_url}" 
            alt="${escapeHtml(article.title)}"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ` : `
        <div class="aspect-video bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
          <i class="fas fa-newspaper text-6xl text-pink-300"></i>
        </div>
      `}
      
      <div class="p-4">
        <h3 class="text-sm font-bold text-gray-800 leading-snug break-words mb-2">
          ${escapeHtml(article.title)}
        </h3>
        
        ${article.summary ? `
          <p class="text-xs text-gray-600 line-clamp-2 mb-3">
            ${escapeHtml(article.summary)}
          </p>
        ` : ''}
        
        <div class="flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center gap-2">
            <span><i class="fas fa-calendar mr-1"></i>${formatDate(article.created_at)}</span>
            ${categoryName ? `<span><i class="fas fa-folder mr-1"></i>${escapeHtml(categoryName)}</span>` : ''}
          </div>
        </div>
      </div>
    </a>
  `
}

// Check if date is within 7 days
// Long press detection for multi-select
window.window.longPressTimer = window.window.longPressTimer || null
window.window.longPressTriggered = window.window.longPressTriggered || false

function handleTouchStart(event, pdfId) {
  window.longPressTriggered = false
  window.longPressTimer = setTimeout(() => {
    window.longPressTriggered = true
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
    event.preventDefault()
    enterMultiSelectMode(pdfId)
  }, 500) // 500ms for long press
}

function handleTouchEnd(event) {
  if (window.longPressTimer) {
    clearTimeout(window.longPressTimer)
  }
  if (window.longPressTriggered) {
    event.preventDefault()
    event.stopPropagation()
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}

// Dark Mode Functions
function toggleDarkMode() {
  state.darkMode = !state.darkMode
  
  // Save to localStorage
  try {
    localStorage.setItem('dark_mode', state.darkMode.toString())
  } catch (error) {
  }
  
  // Apply dark mode
  if (state.darkMode) {
    applyDarkMode()
  } else {
    removeDarkMode()
  }
  
  // Update button text and icons
  updateDarkModeButtons()
}

function applyDarkMode() {
  document.body.classList.add('dark-mode')
  document.documentElement.classList.add('dark')
}

function removeDarkMode() {
  document.body.classList.remove('dark-mode')
  document.documentElement.classList.remove('dark')
}

function updateDarkModeButtons() {
  // Update footer button
  const footerIcon = document.getElementById('dark-mode-icon-footer')
  const footerText = document.getElementById('dark-mode-text-footer')
  
  if (footerIcon && footerText) {
    if (state.darkMode) {
      footerIcon.className = 'fas fa-sun'
      footerText.textContent = 'ライトモードに切り替え'
    } else {
      footerIcon.className = 'fas fa-moon'
      footerText.textContent = 'ダークモードに切り替え'
    }
  }
  
  // Update sidebar button
  const sidebarIcon = document.getElementById('dark-mode-icon-sidebar')
  const sidebarText = document.getElementById('dark-mode-text-sidebar')
  
  if (sidebarIcon && sidebarText) {
    if (state.darkMode) {
      sidebarIcon.className = 'fas fa-sun'
      sidebarText.textContent = 'ライトモード'
    } else {
      sidebarIcon.className = 'fas fa-moon'
      sidebarText.textContent = 'ダークモード'
    }
  }
}

// Show infographic articles only
function showInfographics() {
  // Clear filters
  state.selectedCategory = null
  state.selectedTags = []
  state.searchQuery = ''
  state.showOnlyFavorites = false
  state.showDownloadHistory = false
  
  // Filter to show only infographic articles
  state.pdfs = state.articles.slice()
  
  // Update UI
  renderPdfList()
  
  // Clear category selection in sidebar
  const categoryButtons = document.querySelectorAll('#category-filter button')
  categoryButtons.forEach(btn => btn.classList.remove('active'))
  
  // Show toast
  showToast(`インフォグラフィック記事: ${state.articles.length}件を表示`, 'info')
  
  // Track event
  trackGAEvent('filter_infographics', {
    count: state.articles.length
  })
  
  // Close mobile menu if open
  if (window.innerWidth < 1024) {
    toggleMobileMenu()
  }
}

