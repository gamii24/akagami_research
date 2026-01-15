// 共通ユーティリティ関数

/**
 * HTMLエスケープ
 */
function escapeHtml(text) {
  if (!text) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return String(text).replace(/[&<>"']/g, m => map[m])
}

/**
 * トースト通知を表示
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div')
  const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 
                  type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
  
  toast.className = `fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`
  toast.style.opacity = '0'
  toast.style.transform = 'translateY(20px)'
  
  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'exclamation-circle' : 
                         type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
      <span>${escapeHtml(message)}</span>
    </div>
  `
  
  document.body.appendChild(toast)
  
  // アニメーション開始
  setTimeout(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0)'
  }, 10)
  
  // 自動削除
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(20px)'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

/**
 * 日付をフォーマット
 */
function formatDate(dateString) {
  if (!dateString) return '日付不明'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '日付不明'
    
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (e) {
    console.error('Date format error:', e)
    return '日付不明'
  }
}

// Format birthday as "YYYY年MM月DD日"
function formatBirthday(dateString) {
  if (!dateString) return '誕生日未設定'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '誕生日未設定'
    
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (e) {
    console.error('Birthday format error:', e)
    return '誕生日未設定'
  }
}

/**
 * カテゴリアイコンを取得
 */
function getCategoryIcon(categoryName) {
  const icons = {
    'SNS': 'fa-share-alt',
    'YouTube': 'fa-youtube',
    'Instagram': 'fa-instagram',
    'TikTok': 'fa-video',
    'Threads': 'fa-at',
    'X (Twitter)': 'fa-twitter',
    'AI': 'fa-robot',
    'テクノロジー': 'fa-microchip',
    'マーケティング': 'fa-chart-line',
    'その他': 'fa-folder'
  }
  return icons[categoryName] || 'fa-folder'
}

/**
 * Google Analytics イベント追跡
 */
function trackGAEvent(eventName, eventParams = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams)
  }
}

/**
 * ページビュー追跡
 */
function trackPageView(pagePath, pageTitle) {
  if (typeof gtag === 'function') {
    gtag('config', 'G-JPMZ82RMGG', {
      page_path: pagePath,
      page_title: pageTitle
    })
  }
}

/**
 * ファイルダウンロード
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

/**
 * URLパラメータを取得
 */
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

/**
 * URLパラメータを設定
 */
function setUrlParam(param, value) {
  const url = new URL(window.location.href)
  if (value) {
    url.searchParams.set(param, value)
  } else {
    url.searchParams.delete(param)
  }
  window.history.pushState({}, '', url.toString())
}

/**
 * デバウンス処理
 */
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
