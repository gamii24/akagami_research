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
  showOnlyFavorites: false, // Filter to show only favorites
  showDownloadHistory: false, // Filter to show only downloaded PDFs
  multiSelectMode: false, // Multi-select mode
  selectedPdfs: new Set(), // Selected PDFs in multi-select mode
  showAllMobile: false, // Show all cards on mobile (default: false, show 15)
  viewMode: 'grid', // View mode: 'grid' or 'list'
  darkMode: false // Dark mode
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
  
  // Load view mode preference
  try {
    const viewMode = localStorage.getItem('view_mode')
    if (viewMode && ['grid', 'list'].includes(viewMode)) {
      state.viewMode = viewMode
    }
  } catch (error) {
    console.error('Failed to load view mode:', error)
  }
  
  // Load dark mode preference
  try {
    const darkMode = localStorage.getItem('dark_mode')
    if (darkMode === 'true') {
      state.darkMode = true
      applyDarkMode()
    }
  } catch (error) {
    console.error('Failed to load dark mode:', error)
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

// Check download milestone and show celebration
function checkDownloadMilestone(url) {
  const downloadCount = state.downloadedPdfs.size
  
  // Check if first download
  const firstDownloadShown = localStorage.getItem('first_download_shown')
  if (downloadCount === 1 && !firstDownloadShown) {
    showFirstDownloadMessage(url)
    localStorage.setItem('first_download_shown', 'true')
    return true // Milestone shown
  }
  
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
let pendingDownloadUrl = null

// Show first download message (simple and clean)
function showFirstDownloadMessage(url) {
  pendingDownloadUrl = url
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
  if (pendingDownloadUrl) {
    window.open(pendingDownloadUrl, '_blank')
    pendingDownloadUrl = null
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

// Show welcome message (Instagram like style with SNS logos)
function showWelcomeMessage() {
  const modalHtml = `
    <div class="welcome-modal" id="welcome-modal" onclick="closeWelcome(event)">
      <div class="welcome-content" onclick="event.stopPropagation()">
        <div class="floating-sns-logos">
          <div class="floating-sns-logo"><i class="fab fa-youtube"></i></div>
          <div class="floating-sns-logo"><i class="fab fa-instagram"></i></div>
          <div class="floating-sns-logo"><i class="fab fa-tiktok"></i></div>
          <div class="floating-sns-logo"><i class="fab fa-x-twitter"></i></div>
          <div class="floating-sns-logo"><i class="fab fa-threads"></i></div>
          <div class="floating-sns-logo"><i class="fas fa-podcast"></i></div>
          <div class="floating-sns-logo"><i class="fab fa-line"></i></div>
          <div class="floating-sns-logo"><i class="fas fa-robot"></i></div>
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
function showCelebration(url) {
  pendingDownloadUrl = url
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
  if (pendingDownloadUrl) {
    window.open(pendingDownloadUrl, '_blank')
    pendingDownloadUrl = null
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
  
  // Re-render category filter with counts
  renderCategoryFilter()
  
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

// Change view mode
function changeViewMode(mode) {
  state.viewMode = mode
  
  // Save to localStorage
  try {
    localStorage.setItem('view_mode', mode)
  } catch (error) {
    console.error('Failed to save view mode:', error)
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
        ${sortedCategories.map(cat => {
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
    
    <!-- Tags Section (at bottom) -->
    <div class="mb-6 pt-4 border-t-2 border-gray-200">
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
          title="${state.showOnlyFavorites ? `お気に入りのみ表示中 (${state.favoritePdfs.size})` : 'お気に入りのみ表示'}"
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
        >
          <i class="fas fa-th"></i>
        </button>
        <button 
          onclick="changeViewMode('list')" 
          class="view-mode-btn ${state.viewMode === 'list' ? 'active' : ''} px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 hidden lg:flex"
          title="リスト表示"
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
  
  // Determine how many PDFs to show on mobile
  const isMobile = window.innerWidth < 1024 // lg breakpoint
  const isTopPage = !state.selectedCategory && state.selectedTags.length === 0 && !state.searchQuery && !state.showOnlyFavorites && !state.showDownloadHistory
  let pdfsToShow = state.pdfs
  let hasMore = false
  
  // On mobile top page, limit to 15 cards unless "show all" is clicked
  if (isMobile && isTopPage && !state.showAllMobile && state.pdfs.length > 15) {
    pdfsToShow = state.pdfs.slice(0, 15)
    hasMore = true
  }
  
  html += pdfsToShow.map((pdf, index) => {
    // Only use Google Drive URL
    const downloadUrl = pdf.google_drive_url || ''
    const downloaded = isDownloaded(pdf.id)
    const favorite = isFavorite(pdf.id)
    const isSelected = state.selectedPdfs.has(pdf.id)
    const bgColor = isSelected ? 'bg-blue-50 border-blue-500' : (downloaded ? 'bg-[#f4eee0]' : 'bg-white')
    
    // Check if uploaded within 7 days
    const isNew = isWithin7Days(pdf.created_at)
    
    // Card click handler
    const cardClick = state.multiSelectMode 
      ? `togglePdfSelection(event, ${pdf.id})`
      : (downloadUrl ? `showDownloadConfirmation(${pdf.id}, '${escapeHtml(pdf.title)}', '${downloadUrl}')` : `alert('このPDFのURLが設定されていません')`)
    
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
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-base font-bold text-gray-800 leading-snug break-words">
                ${escapeHtml(pdf.title)}
              </h3>
              ${isNew ? '<span class="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded border border-yellow-300">NEW</span>' : ''}
            </div>
            
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
            >
              <i class="fas fa-paper-plane"></i>
            </button>
            <button 
              onclick="toggleFavorite(event, ${pdf.id})"
              class="favorite-btn-small ${favorite ? 'active' : ''}"
              title="${favorite ? 'お気に入りから削除' : 'お気に入りに追加'}"
            >
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `
    }
    
    // Grid view (default)
    return `
    <div 
      onclick="${cardClick}"
      ontouchstart="handleTouchStart(event, ${pdf.id})"
      ontouchend="handleTouchEnd(event)"
      class="pdf-card ${bgColor} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 cursor-pointer"
      style="position: relative;"
      data-pdf-id="${pdf.id}"
    >
      ${isSelected ? `
        <div class="absolute top-2 left-2 z-10 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
          <i class="fas fa-check text-lg"></i>
        </div>
      ` : ''}
      <div class="p-4">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="text-sm font-bold text-gray-800 leading-snug break-words flex-1">
            ${escapeHtml(pdf.title)}
          </h3>
          ${isNew ? '<span class="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded border border-yellow-300 flex-shrink-0">NEW</span>' : ''}
        </div>
        
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
  
  // Mobile: Show "More" button if there are more cards
  if (isMobile && hasMore) {
    html += `
      <div class="col-span-full mt-6 text-center">
        <button 
          onclick="showAllMobileCards()"
          class="px-8 py-4 bg-gradient-to-r from-primary to-red-600 text-white rounded-xl hover:from-red-600 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-2xl font-bold text-lg"
        >
          <i class="fas fa-chevron-down mr-2"></i>
          もっと見る（残り${state.pdfs.length - 15}件）
        </button>
      </div>
    `
  }
  
  // Mobile: Show Download History button and Tags after cards
  if (isMobile && isTopPage) {
    html += `
      <!-- Mobile: Download History Button -->
      <div class="col-span-full mt-8 lg:hidden">
        <button 
          onclick="toggleDownloadHistory()"
          class="w-full px-4 py-4 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl transition-colors font-bold shadow-lg border-2 border-pink-200 flex items-center justify-center gap-3"
        >
          <i class="fas fa-history text-xl"></i>
          <span>ダウンロード履歴</span>
        </button>
      </div>
      
      <!-- Mobile: Tags Section -->
      <div class="col-span-full mt-6 lg:hidden">
        <div class="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <h2 class="text-lg font-bold mb-4 text-gray-800 flex items-center">
            <i class="fas fa-tags mr-2 text-primary"></i>タグ一覧
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
  if (index > -1) {
    state.selectedTags.splice(index, 1)
  } else {
    state.selectedTags.push(tagId)
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
    sidebar.classList.remove('show-mobile')
    overlay.classList.remove('show')
  }
}

function searchPDFs() {
  const input = document.getElementById('search-input')
  if (input) {
    state.searchQuery = input.value
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
    sidebar.classList.toggle('show-mobile')
    overlay.classList.toggle('show')
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

// Long press detection for multi-select
let longPressTimer = null
let longPressTriggered = false

function handleTouchStart(event, pdfId) {
  longPressTriggered = false
  longPressTimer = setTimeout(() => {
    longPressTriggered = true
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
    event.preventDefault()
    enterMultiSelectMode(pdfId)
  }, 500) // 500ms for long press
}

function handleTouchEnd(event) {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
  }
  if (longPressTriggered) {
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
    console.error('Failed to save dark mode:', error)
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
}

function removeDarkMode() {
  document.body.classList.remove('dark-mode')
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
