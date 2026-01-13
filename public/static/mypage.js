// ============================================
// My Page JavaScript - Full Implementation
// ============================================

let userData = null
let categories = []
let notificationSettings = []
let statsData = null
let charts = {} // Store chart instances

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
    
    // Load statistics
    const statsRes = await fetch('/api/user/stats', { credentials: 'include' })
    statsData = await statsRes.json()
    
    // Render my page
    renderMyPage(downloads, favorites)
    
    // Render charts after DOM is ready
    setTimeout(() => {
      renderCharts()
    }, 100)
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
    <div class="text-center mb-8">
      <h2 class="text-4xl font-bold text-gray-800 mb-2">
        <i class="fas fa-user-circle text-primary mr-3"></i>マイページ
      </h2>
      <p class="text-gray-600">アカウント情報と設定の管理</p>
    </div>

    <!-- User Info Card -->
    <div class="bg-gradient-to-r from-primary to-red-600 rounded-xl shadow-xl p-8 text-white mb-6">
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
          ${userData.name.charAt(0).toUpperCase()}
        </div>
        <div class="flex-1">
          <h3 class="text-3xl font-bold mb-1">${escapeHtml(userData.name)} さん</h3>
          <p class="text-lg opacity-90"><i class="fas fa-envelope mr-2"></i>${escapeHtml(userData.email)}</p>
          <p class="text-sm opacity-80 mt-2">
            <i class="fas fa-calendar mr-2"></i>
            登録日: ${new Date(userData.createdAt).toLocaleDateString('ja-JP')}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm opacity-80 mb-2">ログイン方法</p>
          <p class="text-xl font-bold">
            ${userData.loginMethod === 'password' ? '<i class="fas fa-key mr-2"></i>パスワード' : '<i class="fas fa-magic mr-2"></i>マジックリンク'}
          </p>
        </div>
      </div>
      
      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
          <i class="fas fa-download text-3xl mb-2"></i>
          <p class="text-3xl font-bold">${downloads.length}</p>
          <p class="text-sm opacity-90">ダウンロード</p>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
          <i class="fas fa-heart text-3xl mb-2"></i>
          <p class="text-3xl font-bold">${favorites.length}</p>
          <p class="text-sm opacity-90">お気に入り</p>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
          <i class="fas fa-bell text-3xl mb-2"></i>
          <p class="text-3xl font-bold">${notificationSettings.filter(n => n.notificationEnabled).length}</p>
          <p class="text-sm opacity-90">通知設定中</p>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
          <i class="fas fa-clock text-3xl mb-2"></i>
          <p class="text-3xl font-bold">${getAccountAge()}</p>
          <p class="text-sm opacity-90">利用日数</p>
        </div>
      </div>
    </div>

    <!-- Statistics & Charts Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <i class="fas fa-chart-line text-primary mr-3"></i>
        アクティビティ分析
      </h3>
      
      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Monthly Downloads Chart -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <i class="fas fa-calendar-alt text-blue-500 mr-2"></i>
            月別ダウンロード数
          </h4>
          <canvas id="monthlyChart" style="max-height: 250px;"></canvas>
        </div>
        
        <!-- Category Distribution Chart -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <i class="fas fa-folder text-purple-500 mr-2"></i>
            カテゴリ別ダウンロード
          </h4>
          <canvas id="categoryChart" style="max-height: 250px;"></canvas>
        </div>
        
        <!-- Daily Activity Chart -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <i class="fas fa-chart-bar text-green-500 mr-2"></i>
            最近30日間の活動
          </h4>
          <canvas id="dailyChart" style="max-height: 250px;"></canvas>
        </div>
        
        <!-- Weekly Activity Chart -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <i class="fas fa-clock text-orange-500 mr-2"></i>
            曜日別アクティビティ
          </h4>
          <canvas id="weeklyChart" style="max-height: 250px;"></canvas>
        </div>
      </div>
    </div>

    <!-- SNS Information Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
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

    <!-- Notification Settings Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <i class="fas fa-bell text-primary mr-3"></i>
        メール通知設定
      </h3>
      <p class="text-gray-600 mb-6 text-sm">
        興味のあるSNSカテゴリを選択してください。新しいファイルが追加されたときにメールで通知します。
      </p>
      
      <div id="notification-categories" class="space-y-3">
        ${renderNotificationCategories()}
      </div>
      
      <button onclick="saveNotificationSettings()" 
        class="mt-6 w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
        <i class="fas fa-save mr-2"></i>通知設定を保存
      </button>
    </div>

    <!-- Download History Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <i class="fas fa-download text-primary mr-3"></i>
        ダウンロード履歴
        <span class="ml-3 text-lg font-normal text-gray-600">(${downloads.length}件)</span>
      </h3>
      
      ${downloads.length > 0 ? `
        <div class="space-y-3">
          ${downloads.slice(0, 10).map(d => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex-1">
                <h4 class="font-medium text-gray-800 mb-1">${escapeHtml(d.title)}</h4>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span><i class="fas fa-folder mr-1"></i>${escapeHtml(d.categoryName)}</span>
                  <span><i class="fas fa-clock mr-1"></i>${new Date(d.downloadedAt).toLocaleDateString('ja-JP')}</span>
                </div>
              </div>
              <a href="${escapeHtml(d.googleDriveUrl)}" target="_blank" rel="noopener noreferrer"
                class="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors">
                <i class="fas fa-external-link-alt mr-2"></i>開く
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

    <!-- Favorites Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <i class="fas fa-heart text-primary mr-3"></i>
        お気に入り
        <span class="ml-3 text-lg font-normal text-gray-600">(${favorites.length}件)</span>
      </h3>
      
      ${favorites.length > 0 ? `
        <div class="space-y-3">
          ${favorites.slice(0, 10).map(f => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex-1">
                <h4 class="font-medium text-gray-800 mb-1">${escapeHtml(f.title)}</h4>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span><i class="fas fa-folder mr-1"></i>${escapeHtml(f.categoryName)}</span>
                  <span><i class="fas fa-clock mr-1"></i>${new Date(f.createdAt).toLocaleDateString('ja-JP')}</span>
                </div>
              </div>
              <a href="${escapeHtml(f.googleDriveUrl)}" target="_blank" rel="noopener noreferrer"
                class="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors">
                <i class="fas fa-external-link-alt mr-2"></i>開く
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

    <!-- Account Actions -->
    <div class="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
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
      notificationEnabled: false,
      frequency: 'immediate'
    }
    
    return `
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div class="flex items-center gap-4 flex-1">
          <label class="flex items-center cursor-pointer">
            <input type="checkbox" 
              id="notify-${category.id}" 
              ${setting.notificationEnabled ? 'checked' : ''}
              class="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary">
            <span class="ml-3 font-medium text-gray-800">${escapeHtml(category.name)}</span>
          </label>
        </div>
        <div class="flex items-center gap-3">
          <select id="freq-${category.id}" 
            ${!setting.notificationEnabled ? 'disabled' : ''}
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent ${!setting.notificationEnabled ? 'bg-gray-200' : ''}">
            <option value="immediate" ${setting.frequency === 'immediate' ? 'selected' : ''}>即時</option>
            <option value="daily" ${setting.frequency === 'daily' ? 'selected' : ''}>日次</option>
            <option value="weekly" ${setting.frequency === 'weekly' ? 'selected' : ''}>週次</option>
          </select>
        </div>
      </div>
    `
  }).join('')
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
      const frequency = document.getElementById(`freq-${category.id}`).value
      
      return {
        categoryId: category.id,
        notificationEnabled: enabled,
        frequency: frequency
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

// Render charts
function renderCharts() {
  if (!statsData) return
  
  // Destroy existing charts
  Object.values(charts).forEach(chart => {
    if (chart) chart.destroy()
  })
  
  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  }
  
  // 1. Monthly Downloads Chart (Line Chart)
  const monthlyCtx = document.getElementById('monthlyChart')
  if (monthlyCtx && statsData.monthlyDownloads) {
    const monthLabels = statsData.monthlyDownloads.map(d => {
      const [year, month] = d.month.split('-')
      return `${year}年${parseInt(month)}月`
    })
    const monthData = statsData.monthlyDownloads.map(d => d.count)
    
    charts.monthly = new Chart(monthlyCtx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'ダウンロード数',
          data: monthData,
          borderColor: '#e75556',
          backgroundColor: 'rgba(231, 85, 86, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    })
  }
  
  // 2. Category Distribution Chart (Doughnut Chart)
  const categoryCtx = document.getElementById('categoryChart')
  if (categoryCtx && statsData.categoryDownloads) {
    const categoryLabels = statsData.categoryDownloads.map(d => d.category)
    const categoryData = statsData.categoryDownloads.map(d => d.count)
    
    const colors = [
      '#e75556', '#f87171', '#fb923c', '#fbbf24', '#a3e635',
      '#34d399', '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6'
    ]
    
    charts.category = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: categoryLabels,
        datasets: [{
          data: categoryData,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        ...commonOptions,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 10,
              font: { size: 11 }
            }
          }
        }
      }
    })
  }
  
  // 3. Daily Activity Chart (Bar Chart)
  const dailyCtx = document.getElementById('dailyChart')
  if (dailyCtx && statsData.dailyActivity) {
    const dailyLabels = statsData.dailyActivity.map(d => {
      const date = new Date(d.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    })
    const dailyData = statsData.dailyActivity.map(d => d.count)
    
    charts.daily = new Chart(dailyCtx, {
      type: 'bar',
      data: {
        labels: dailyLabels,
        datasets: [{
          label: 'ダウンロード数',
          data: dailyData,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    })
  }
  
  // 4. Weekly Activity Chart (Radar Chart)
  const weeklyCtx = document.getElementById('weeklyChart')
  if (weeklyCtx && statsData.weeklyActivity) {
    const dayNames = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']
    
    // Create array with all days initialized to 0
    const weeklyData = new Array(7).fill(0)
    statsData.weeklyActivity.forEach(d => {
      const dayIndex = parseInt(d.day_of_week)
      weeklyData[dayIndex] = d.count
    })
    
    charts.weekly = new Chart(weeklyCtx, {
      type: 'radar',
      data: {
        labels: dayNames,
        datasets: [{
          label: 'アクティビティ',
          data: weeklyData,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: '#f97316',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#f97316'
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          r: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    })
  }
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text || ''
  return div.innerHTML
}

// Enable/disable frequency select when checkbox changes
document.addEventListener('change', (e) => {
  if (e.target.id && e.target.id.startsWith('notify-')) {
    const categoryId = e.target.id.replace('notify-', '')
    const freqSelect = document.getElementById(`freq-${categoryId}`)
    if (freqSelect) {
      freqSelect.disabled = !e.target.checked
      if (!e.target.checked) {
        freqSelect.classList.add('bg-gray-200')
      } else {
        freqSelect.classList.remove('bg-gray-200')
      }
    }
  }
})

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
  loadMyPage()
})
