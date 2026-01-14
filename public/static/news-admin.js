// News Admin Page State
let newsState = {
  newsArticles: [],
  editingNews: null,
  authenticated: false
}

// Enable dark mode
function enableAdminDarkMode() {
  document.body.classList.add('admin-dark')
  document.documentElement.classList.add('admin-dark')
}

// Check authentication
async function checkAuth() {
  try {
    const response = await axios.get('/api/auth/check')
    if (response.data.authenticated) {
      newsState.authenticated = true
      return true
    }
  } catch (error) {
    console.error('Auth check failed:', error)
  }
  
  window.location.href = '/admin'
  return false
}

// Initialize news admin app
async function initNewsAdmin() {
  enableAdminDarkMode()
  const isAuth = await checkAuth()
  if (!isAuth) return
  
  await loadNewsArticles()
  renderNewsAdminPage()
}

// Load news articles
async function loadNewsArticles() {
  try {
    const response = await axios.get('/api/news')
    newsState.newsArticles = response.data
  } catch (error) {
    console.error('Failed to load news articles:', error)
    showToast('ニュース記事の読み込みに失敗しました', 'error')
  }
}

// Render news admin page
function renderNewsAdminPage() {
  const app = document.getElementById('news-admin-app')
  if (!app) return
  
  app.innerHTML = `
    <div class="min-h-screen" style="background-color: #1a1a1a;">
      <!-- Header -->
      <header style="background-color: #2d2d2d; border-bottom: 2px solid #4b5563;">
        <div class="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold flex items-center" style="color: #f3f4f6;">
                <i class="fas fa-newspaper mr-2" style="color: #f59e0b;"></i>
                ニュース管理
              </h1>
              <p class="text-xs mt-0.5" style="color: #d1d5db;">Akagami Research</p>
            </div>
            <div class="flex gap-2">
              <a href="/admin" class="px-3 py-1.5 text-sm rounded-lg transition-all duration-300 font-medium shadow-md" style="background-color: #6b7280; color: white;" aria-label="管理画面に戻る">
                <i class="fas fa-arrow-left mr-1" aria-hidden="true"></i>管理画面に戻る
              </a>
              <a href="/" class="px-3 py-1.5 text-sm rounded-lg transition-all duration-300 font-medium shadow-md" style="background-color: #e75556; color: white;" aria-label="公開ページへ移動">
                <i class="fas fa-home mr-1" aria-hidden="true"></i>公開ページへ
              </a>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <!-- Quick Paste Form -->
        <div class="mb-6 rounded-xl shadow-xl overflow-hidden" style="background-color: #2d2d2d; border: 2px solid #10b981;">
          <div class="px-6 py-4" style="background-color: #059669; border-bottom: 2px solid #10b981;">
            <h2 class="text-lg font-bold text-white">
              <i class="fas fa-paste mr-2"></i>
              コピペで簡単登録
            </h2>
            <p class="text-sm text-white opacity-90 mt-1">タイトル、要約をまとめてコピペして、ボタン1つで登録！</p>
          </div>
          
          <div class="p-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2" style="color: #d1d5db;">
                  記事情報を貼り付け <span style="color: #10b981;">*</span>
                  <span class="text-xs opacity-75 ml-2">（タイトル、要約を含むテキストをコピペ）</span>
                </label>
                <textarea 
                  id="bulk-input" 
                  rows="8" 
                  class="w-full px-4 py-3 rounded-lg font-mono text-sm" 
                  style="background-color: #1a1a1a; border: 2px solid #10b981; color: #f3f4f6;" 
                  placeholder="例:

タイトル
GoogleがAI動画生成ツールVeoを強化し縦型動画と高画質出力に対応

要約
GoogleはAI動画生成ツールVeoの最新版を発表し、画像からの動画生成、縦型動画対応..."></textarea>
              </div>
              
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2" style="color: #d1d5db;">記事URL <span style="color: #10b981;">*</span></label>
                  <input type="url" id="bulk-url" class="w-full px-4 py-2 rounded-lg" style="background-color: #1a1a1a; border: 1px solid #4b5563; color: #f3f4f6;" placeholder="https://example.com/article">
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2" style="color: #d1d5db;">カテゴリ <span style="color: #10b981;">*</span></label>
                  <select id="bulk-category" class="w-full px-4 py-2 rounded-lg" style="background-color: #1a1a1a; border: 1px solid #4b5563; color: #f3f4f6;">
                    <option value="SNS">SNS</option>
                    <option value="テクノロジー">テクノロジー</option>
                    <option value="その他">その他</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium mb-2" style="color: #d1d5db;">言語 <span style="color: #10b981;">*</span></label>
                  <select id="bulk-language" class="w-full px-4 py-2 rounded-lg" style="background-color: #1a1a1a; border: 1px solid #4b5563; color: #f3f4f6;">
                    <option value="en">英語</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              </div>
              
              <button 
                type="button" 
                onclick="parseBulkInput()" 
                class="w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg text-white" 
                style="background-color: #10b981;">
                <i class="fas fa-magic mr-2"></i>自動解析して登録
              </button>
            </div>
          </div>
        </div>

        <!-- News List -->
        <div class="rounded-xl shadow-xl overflow-hidden" style="background-color: #2d2d2d; border: 2px solid #4b5563;">
          <div class="px-6 py-4" style="background-color: #3a3a3a; border-bottom: 2px solid #4b5563;">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold" style="color: #f3f4f6;">
                <i class="fas fa-list mr-2" style="color: #f59e0b;"></i>登録済みニュース記事
              </h2>
              <div class="text-sm" style="color: #9ca3af;">
                全 <span id="news-count" style="color: #f59e0b; font-weight: bold;">${newsState.newsArticles.length}</span> 件
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <div id="news-list" class="space-y-4">
              ${renderNewsList()}
            </div>
          </div>
        </div>
      </main>
    </div>
  `
}

// Render news list
function renderNewsList() {
  if (newsState.newsArticles.length === 0) {
    return `
      <p class="text-center py-8" style="color: #9ca3af;">
        <i class="fas fa-inbox text-4xl mb-2 block"></i>
        まだニュース記事が登録されていません
      </p>
    `
  }
  
  return newsState.newsArticles.map(news => `
    <div class="p-4 rounded-lg" style="background-color: #1a1a1a; border: 1px solid #4b5563;">
      <div class="flex justify-between items-start mb-2">
        <div class="flex-1">
          <h3 class="font-semibold mb-1" style="color: #f3f4f6;">${escapeHtml(news.title)}</h3>
          <p class="text-sm mb-2" style="color: #9ca3af;">${escapeHtml(news.summary)}</p>
          <div class="flex gap-2 text-xs mb-2 items-center">
            <select 
              onchange="updateCategory(${news.id}, this.value)" 
              class="px-2 py-1 rounded text-xs font-semibold" 
              style="background-color: #f59e0b; color: white; border: none; cursor: pointer;"
              title="カテゴリを変更">
              <option value="SNS" ${news.category === 'SNS' ? 'selected' : ''}>SNS</option>
              <option value="テクノロジー" ${news.category === 'テクノロジー' ? 'selected' : ''}>テクノロジー</option>
              <option value="その他" ${news.category === 'その他' ? 'selected' : ''}>その他</option>
            </select>
            <span style="color: #9ca3af;">${news.published_at ? new Date(news.published_at).toLocaleDateString('ja-JP') : '日付未設定'}</span>
          </div>
          <a href="${news.url}" target="_blank" class="text-xs hover:underline" style="color: #60a5fa;">
            <i class="fas fa-external-link-alt mr-1"></i>${news.url}
          </a>
        </div>
        <div class="ml-4 flex gap-2">
          <button onclick="deleteNews(${news.id}, '${escapeHtml(news.title).replace(/'/g, "\\'")}')  " class="px-3 py-2 rounded text-sm transition-colors" style="background-color: #dc2626; color: white;" title="削除">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('')
}

// Delete news
async function deleteNews(id, title) {
  if (!confirm(`「${title}」を削除しますか？`)) {
    return
  }
  
  try {
    const response = await axios.delete(`/api/news/${id}`)
    
    if (response.data.success) {
      showToast('ニュース記事を削除しました', 'success')
      
      // Reload and re-render
      await loadNewsArticles()
      document.getElementById('news-list').innerHTML = renderNewsList()
      document.getElementById('news-count').textContent = newsState.newsArticles.length
    }
  } catch (error) {
    console.error('Failed to delete news:', error)
    showToast('ニュース記事の削除に失敗しました', 'error')
  }
}

// showToast is now in utils.js

// escapeHtml is now in utils.js

// Parse bulk input and auto-fill form
async function parseBulkInput() {
  const bulkText = document.getElementById('bulk-input').value.trim()
  const url = document.getElementById('bulk-url').value.trim()
  const category = document.getElementById('bulk-category').value
  const language = document.getElementById('bulk-language').value
  
  if (!bulkText || !url) {
    showToast('記事情報とURLを入力してください', 'error')
    return
  }
  
  try {
    // Parse the text
    const lines = bulkText.split('\n').map(line => line.trim()).filter(line => line)
    
    let title = ''
    let summary = ''
    
    let currentSection = ''
    let summaryLines = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Detect section headers
      if (line === 'タイトル' || line.toLowerCase() === 'title') {
        currentSection = 'title'
        continue
      } else if (line === '要約' || line.toLowerCase() === 'summary' || line === '概要') {
        currentSection = 'summary'
        continue
      }
      
      // Store content based on current section
      if (currentSection === 'title' && !title) {
        title = line
      } else if (currentSection === 'summary') {
        summaryLines.push(line)
      }
    }
    
    summary = summaryLines.join('\n')
    
    // Validation
    if (!title) {
      showToast('タイトルが見つかりませんでした', 'error')
      return
    }
    
    if (!summary) {
      showToast('要約が見つかりませんでした', 'error')
      return
    }
    
    // Prepare data
    const data = {
      title,
      summary,
      url,
      category,
      language
    }
    
    // Save to API
    const response = await axios.post('/api/news', data)
    
    if (response.data.success) {
      showToast('ニュース記事を追加しました！', 'success')
      
      // Clear bulk input
      document.getElementById('bulk-input').value = ''
      document.getElementById('bulk-url').value = ''
      
      // Reload and re-render
      await loadNewsArticles()
      document.getElementById('news-list').innerHTML = renderNewsList()
      document.getElementById('news-count').textContent = newsState.newsArticles.length
    }
  } catch (error) {
    console.error('Failed to parse and save:', error)
    showToast('記事の解析または保存に失敗しました', 'error')
  }
}

// Update category
async function updateCategory(id, newCategory) {
  try {
    // Get the full news article data
    const news = newsState.newsArticles.find(n => n.id === id)
    if (!news) {
      showToast('記事が見つかりませんでした', 'error')
      return
    }
    
    // Send full data with updated category
    const response = await axios.put(`/api/news/${id}`, {
      title: news.title,
      summary: news.summary,
      url: news.url,
      category: newCategory,
      language: news.language,
      published_at: news.published_at
    })
    
    if (response.data.success) {
      showToast(`カテゴリを「${newCategory}」に変更しました`, 'success')
      
      // Update local state
      news.category = newCategory
    }
  } catch (error) {
    console.error('Failed to update category:', error)
    showToast('カテゴリの変更に失敗しました', 'error')
    
    // Reload to restore original state
    await loadNewsArticles()
    document.getElementById('news-list').innerHTML = renderNewsList()
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initNewsAdmin)
