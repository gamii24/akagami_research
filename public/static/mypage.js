// ============================================
// My Page JavaScript - Full Implementation
// ============================================

let userData = null
let categories = []
let notificationSettings = []

// SNS Legends Quotes Database
const snsQuotes = [
  {
    author: 'マーク・ザッカーバーグ',
    role: 'Meta (Facebook) 創業者・CEO',
    quote: 'アイデアは重要ではない。実行こそがすべてだ。',
    icon: 'fab fa-facebook'
  },
  {
    author: 'マーク・ザッカーバーグ',
    role: 'Meta (Facebook) 創業者・CEO',
    quote: '完璧を待つより、まず完成させることが重要だ。',
    icon: 'fab fa-facebook'
  },
  {
    author: 'イーロン・マスク',
    role: 'X (Twitter) オーナー・テスラCEO',
    quote: '失敗はオプションだ。失敗しないなら、十分に革新的ではない。',
    icon: 'fab fa-x-twitter'
  },
  {
    author: 'イーロン・マスク',
    role: 'X (Twitter) オーナー・テスラCEO',
    quote: 'ブランドは製品やサービスへの信頼の積み重ねだ。',
    icon: 'fab fa-x-twitter'
  },
  {
    author: 'ジャック・ドーシー',
    role: 'Twitter (X) 共同創業者',
    quote: '最も強力な人々は、情報を共有する人々だ。',
    icon: 'fab fa-twitter'
  },
  {
    author: 'ケビン・シストロム',
    role: 'Instagram 共同創業者',
    quote: 'シンプルさが究極の洗練である。',
    icon: 'fab fa-instagram'
  },
  {
    author: 'ケビン・シストロム',
    role: 'Instagram 共同創業者',
    quote: '完璧主義は、スタートアップを殺す最速の方法だ。',
    icon: 'fab fa-instagram'
  },
  {
    author: 'スーザン・ウォシッキー',
    role: '元YouTube CEO',
    quote: 'クリエイターがいなければ、YouTubeは何もない。',
    icon: 'fab fa-youtube'
  },
  {
    author: 'リード・ホフマン',
    role: 'LinkedIn 共同創業者',
    quote: '恥ずかしくない製品なら、リリースが遅すぎる。',
    icon: 'fab fa-linkedin'
  },
  {
    author: 'ブライアン・チェスキー',
    role: 'Airbnb 共同創業者・CEO',
    quote: 'スケールしないことをしろ。',
    icon: 'fas fa-home'
  },
  {
    author: 'ジャン・クム',
    role: 'WhatsApp 共同創業者',
    quote: '広告はないほうがいい。プライバシーを尊重しろ。',
    icon: 'fab fa-whatsapp'
  },
  {
    author: 'エヴァン・スピーゲル',
    role: 'Snapchat 創業者・CEO',
    quote: '人々は、永続的なものよりも一時的なものに正直になる。',
    icon: 'fab fa-snapchat'
  },
  {
    author: 'チャン・イーミン',
    role: 'ByteDance (TikTok) 創業者',
    quote: 'グローバルに考え、ローカルに実行せよ。',
    icon: 'fab fa-tiktok'
  },
  {
    author: 'スティーブ・ジョブズ',
    role: 'Apple 共同創業者',
    quote: '顧客が望むものを提供するな。彼らが必要とするものを提供しろ。',
    icon: 'fab fa-apple'
  }
]

// Get random quote
function getRandomQuote() {
  return snsQuotes[Math.floor(Math.random() * snsQuotes.length)]
}

// Load and display random quote
function loadRandomQuote() {
  const quote = getRandomQuote()
  const quoteContent = document.getElementById('quote-content')
  
  if (!quoteContent) return
  
  quoteContent.innerHTML = `
    <div class="mb-4">
      <i class="${quote.icon} text-4xl text-primary mb-3"></i>
    </div>
    <blockquote class="text-lg font-medium text-gray-800 italic mb-4 leading-relaxed">
      "${quote.quote}"
    </blockquote>
    <div class="text-sm text-gray-600">
      <p class="font-semibold">${escapeHtml(quote.author)}</p>
      <p class="text-xs">${escapeHtml(quote.role)}</p>
    </div>
  `
}

// Helper function to safely format dates
function formatDate(dateString) {
  if (!dateString) return '日付不明'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '日付不明'
    return date.toLocaleDateString('ja-JP')
  } catch (error) {
    return '日付不明'
  }
}

// Load my page data
async function loadMyPage() {
  try {
    // Check auth
    const authRes = await fetch('/api/user/me', { credentials: 'include' })
    const authData = await authRes.json()
    
    if (!authData.authenticated || !authData.user) {
      window.location.href = '/'
      return
    }
    
    userData = authData.user
    
    // Load categories
    const categoriesRes = await fetch('/api/categories')
    categories = await categoriesRes.json()
    
    // Load notification settings
    const notificationsRes = await fetch('/api/user/notifications', { credentials: 'include' })
    notificationSettings = await notificationsRes.json()
    
    // Load downloads and favorites
    const downloadsRes = await fetch('/api/user/downloads', { credentials: 'include' })
    const downloads = await downloadsRes.json()
    
    const favoritesRes = await fetch('/api/user/favorites', { credentials: 'include' })
    const favorites = await favoritesRes.json()
    
    // Debug: Log data structure
    console.log('Downloads sample:', downloads[0])
    console.log('Favorites sample:', favorites[0])
    
    // Render my page
    renderMyPage(downloads, favorites)
    
    // Load random quote after page render
    loadRandomQuote()
  } catch (error) {
    console.error('Failed to load my page:', error)
    document.getElementById('mypage-content').innerHTML = `
      <div class="text-center py-12 text-red-600">
        <i class="fas fa-exclamation-triangle text-5xl mb-4"></i>
        <p>データの読み込みに失敗しました</p>
        <button onclick="window.location.reload()" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-600">
          再読み込み
        </button>
      </div>
    `
  }
}

// Render my page
function renderMyPage(downloads, favorites) {
  const content = document.getElementById('mypage-content')
  
  content.innerHTML = `
    <!-- Page Title -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-1">
        <i class="fas fa-user-circle text-primary mr-2"></i>MY PAGE
      </h2>
      <p class="text-gray-600 text-sm">アカウント情報と設定の管理</p>
    </div>

    <!-- User Info Card - Compact -->
    <div class="bg-white rounded-lg shadow-md border-2 border-gray-200 p-4 mb-6">
      <div class="flex items-center gap-4">
        <div class="relative">
          ${userData.profilePhotoUrl ? `
            <img src="${escapeHtml(userData.profilePhotoUrl)}" 
              alt="Profile Photo" 
              class="w-16 h-16 rounded-full border-2 border-primary object-cover">
          ` : `
            <div class="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-primary text-primary">
              ${userData.name.charAt(0).toUpperCase()}
            </div>
          `}
          <button onclick="document.getElementById('profile-photo-input').click()" 
            class="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1.5 shadow hover:bg-red-600 transition-colors text-xs">
            <i class="fas fa-camera"></i>
          </button>
          <input type="file" id="profile-photo-input" accept="image/*" class="hidden" onchange="uploadProfilePhoto(event)">
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-bold text-gray-800 truncate">${escapeHtml(userData.name)} さん</h3>
          <p class="text-sm text-gray-600 truncate"><i class="fas fa-envelope mr-1"></i>${escapeHtml(userData.email)}</p>
          <p class="text-xs text-gray-500 mt-1">
            <i class="fas fa-calendar mr-1"></i>${formatDate(userData.createdAt)} 登録
            <span class="ml-3">
              <i class="fas fa-id-card mr-1"></i>会員番号: ${userData.id}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Inspirational Quote Section -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-quote-left text-primary mr-3"></i>
        今日の名言
      </h3>
      <div id="quote-content" class="text-center py-4">
        <!-- Quote will be inserted here -->
      </div>
      <button onclick="loadRandomQuote()" 
        class="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
        <i class="fas fa-sync-alt mr-2"></i>別の名言を見る
      </button>
    </div>

    <!-- Favorites Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-heart text-primary mr-3"></i>
        お気に入り
        <span class="ml-3 text-sm font-normal text-gray-600">(${favorites.length}件)</span>
      </h3>
      
      ${favorites.length > 0 ? `
        <div class="space-y-3">
          ${favorites.slice(0, 10).map(f => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex-1">
                <h4 class="font-normal text-sm text-gray-800 mb-1">${escapeHtml(f.title)}</h4>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span><i class="fas fa-folder mr-1"></i>${escapeHtml(f.category_name || f.categoryName || 'カテゴリ不明')}</span>
                  <span><i class="fas fa-clock mr-1"></i>${formatDate(f.created_at || f.createdAt)}</span>
                </div>
              </div>
              <a href="${escapeHtml(f.googleDriveUrl)}" target="_blank" rel="noopener noreferrer"
                class="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors" title="開く">
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          `).join('')}
        </div>
        ${favorites.length > 10 ? `
          <p class="text-center text-gray-600 mt-4 text-sm">
            最新10件を表示中 (全${favorites.length}件)
          </p>
        ` : ''}
      ` : `
        <p class="text-center text-gray-500 py-8">
          <i class="fas fa-inbox text-5xl mb-3 opacity-50"></i><br>
          まだお気に入りがありません
        </p>
      `}
    </div>

    <!-- Download History Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-download text-primary mr-3"></i>
        ダウンロード履歴
        <span class="ml-3 text-sm font-normal text-gray-600">(${downloads.length}件)</span>
      </h3>
      
      ${downloads.length > 0 ? `
        <div class="space-y-3">
          ${downloads.slice(0, 10).map(d => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex-1">
                <h4 class="font-normal text-sm text-gray-800 mb-1">${escapeHtml(d.title)}</h4>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span><i class="fas fa-folder mr-1"></i>${escapeHtml(d.category_name || d.categoryName || 'カテゴリ不明')}</span>
                  <span><i class="fas fa-clock mr-1"></i>${formatDate(d.downloaded_at || d.downloadedAt)}</span>
                </div>
              </div>
              <a href="${escapeHtml(d.googleDriveUrl)}" target="_blank" rel="noopener noreferrer"
                class="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors" title="開く">
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          `).join('')}
        </div>
        ${downloads.length > 10 ? `
          <p class="text-center text-gray-600 mt-4 text-sm">
            最新10件を表示中 (全${downloads.length}件)
          </p>
        ` : ''}
      ` : `
        <p class="text-center text-gray-500 py-8">
          <i class="fas fa-inbox text-5xl mb-3 opacity-50"></i><br>
          まだダウンロード履歴がありません
        </p>
      `}
    </div>

    <!-- Notification Settings Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-bell text-primary mr-3"></i>
        メール通知設定
      </h3>
      <p class="text-gray-600 mb-6 text-sm">
        興味のあるSNSカテゴリを選択してください。チェックを入れたカテゴリの新着資料を毎週月曜日にメールでお知らせします。
      </p>
      
      <div id="notification-categories" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        ${renderNotificationCategories()}
      </div>
      
      <button onclick="saveNotificationSettings()" 
        class="mt-6 w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
        <i class="fas fa-save mr-2"></i>通知設定を保存
      </button>
    </div>

    <!-- SNS Information Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-share-alt text-primary mr-3"></i>
        SNS情報
      </h3>
      <p class="text-gray-600 mb-4 text-sm">
        あなたのSNSアカウント情報を登録してください。プロフィールに表示されます。
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fab fa-youtube text-red-600 mr-2"></i>YouTube チャンネルURL
          </label>
          <input type="url" id="youtube-url" 
            value="${userData.youtubeUrl || ''}"
            placeholder="https://youtube.com/@your-channel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fab fa-instagram text-pink-600 mr-2"></i>Instagram アカウント
          </label>
          <input type="text" id="instagram-handle" 
            value="${userData.instagramHandle || ''}"
            placeholder="@your_account"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fab fa-tiktok text-black mr-2"></i>TikTok アカウント
          </label>
          <input type="text" id="tiktok-handle" 
            value="${userData.tiktokHandle || ''}"
            placeholder="@your_account"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fab fa-twitter text-blue-400 mr-2"></i>X (Twitter) アカウント
          </label>
          <input type="text" id="twitter-handle" 
            value="${userData.twitterHandle || ''}"
            placeholder="@your_account"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
        </div>
      </div>
      
      <button onclick="saveSnsInfo()" 
        class="mt-4 w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
        <i class="fas fa-save mr-2"></i>SNS情報を保存
      </button>
    </div>

    <!-- Account Actions -->
    <div class="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-cog text-primary mr-3"></i>
        アカウント管理
      </h3>
      
      <div class="space-y-3">
        <button onclick="if(confirm('ログアウトしますか?')) handleLogout()"
          class="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
          <i class="fas fa-sign-out-alt mr-2"></i>ログアウト
        </button>
      </div>
    </div>
  `
}

// Render notification categories
function renderNotificationCategories() {
  return categories.map(category => {
    const setting = notificationSettings.find(s => s.categoryId === category.id) || {
      notificationEnabled: false
    }
    
    return `
      <div class="relative">
        <input type="checkbox" 
          id="notify-${category.id}" 
          ${setting.notificationEnabled ? 'checked' : ''}
          class="peer hidden">
        <label for="notify-${category.id}" 
          class="block px-2 py-2.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer transition-all hover:border-primary hover:bg-gray-100 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white text-center">
          <i class="fas fa-check absolute top-1 right-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity text-xs"></i>
          <span class="font-medium text-xs">${escapeHtml(category.name)}</span>
        </label>
      </div>
    `
  }).join('')
}

// Upload profile photo
async function uploadProfilePhoto(event) {
  const file = event.target.files[0]
  if (!file) return
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('ファイルサイズは5MB以下にしてください')
    return
  }
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    alert('画像ファイルを選択してください')
    return
  }
  
  try {
    // Convert to base64
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result
      
      // Save to server
      const res = await fetch('/api/user/profile-photo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ photoUrl: base64 })
      })
      
      if (!res.ok) throw new Error('Failed to upload')
      
      // Reload page to show new photo
      window.location.reload()
    }
    reader.readAsDataURL(file)
  } catch (error) {
    console.error('Failed to upload profile photo:', error)
    alert('プロフィール写真のアップロードに失敗しました')
  }
}

// Save SNS information
async function saveSnsInfo() {
  const button = event.target
  const originalHtml = button.innerHTML
  
  try {
    button.disabled = true
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>保存中...'
    
    const snsData = {
      youtubeUrl: document.getElementById('youtube-url').value.trim(),
      instagramHandle: document.getElementById('instagram-handle').value.trim(),
      tiktokHandle: document.getElementById('tiktok-handle').value.trim(),
      twitterHandle: document.getElementById('twitter-handle').value.trim()
    }
    
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(snsData)
    })
    
    if (!res.ok) throw new Error('Failed to save')
    
    button.innerHTML = '<i class="fas fa-check mr-2"></i>保存完了！'
    button.classList.remove('bg-primary', 'hover:bg-red-600')
    button.classList.add('bg-green-600')
    
    setTimeout(() => {
      button.innerHTML = originalHtml
      button.classList.remove('bg-green-600')
      button.classList.add('bg-primary', 'hover:bg-red-600')
      button.disabled = false
    }, 2000)
  } catch (error) {
    console.error('Failed to save SNS info:', error)
    alert('SNS情報の保存に失敗しました')
    button.innerHTML = originalHtml
    button.disabled = false
  }
}

// Save notification settings
async function saveNotificationSettings() {
  const button = event.target
  const originalHtml = button.innerHTML
  
  try {
    button.disabled = true
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>保存中...'
    
    const settings = categories.map(category => {
      const enabled = document.getElementById(`notify-${category.id}`).checked
      
      return {
        categoryId: category.id,
        notificationEnabled: enabled,
        frequency: 'weekly'  // Always set to weekly
      }
    })
    
    const res = await fetch('/api/user/notifications/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ settings })
    })
    
    if (!res.ok) throw new Error('Failed to save')
    
    button.innerHTML = '<i class="fas fa-check mr-2"></i>保存完了！'
    button.classList.remove('bg-primary', 'hover:bg-red-600')
    button.classList.add('bg-green-600')
    
    setTimeout(() => {
      button.innerHTML = originalHtml
      button.classList.remove('bg-green-600')
      button.classList.add('bg-primary', 'hover:bg-red-600')
      button.disabled = false
    }, 2000)
  } catch (error) {
    console.error('Failed to save notification settings:', error)
    alert('通知設定の保存に失敗しました')
    button.innerHTML = originalHtml
    button.disabled = false
  }
}

// Get account age in days
function getAccountAge() {
  const created = new Date(userData.createdAt)
  const now = new Date()
  const days = Math.floor((now - created) / (1000 * 60 * 60 * 24))
  return `${days}日`
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text || ''
  return div.innerHTML
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
  loadMyPage()
})
