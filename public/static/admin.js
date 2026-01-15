// Admin page state
let adminState = {
  pdfs: [],
  categories: [],
  tags: [],
  excludedTags: [],
  editingPdf: null,
  showModal: false,
  authenticated: false,
  selectedCategoryFilter: null // null means "All Categories"
}

// Enable dark mode for admin pages
function enableAdminDarkMode() {
  document.body.classList.add('admin-dark')
  document.documentElement.classList.add('admin-dark')
}

// Check authentication
async function checkAuth() {
  try {
    const response = await axios.get('/api/auth/check')
    if (response.data.authenticated) {
      adminState.authenticated = true
      return true
    }
  } catch (error) {
    console.error('Auth check failed:', error)
  }
  
  showLoginForm()
  return false
}

// Login form
function showLoginForm() {
  enableAdminDarkMode() // Enable dark mode
  const app = document.getElementById('admin-app')
  if (!app) return
  
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center login-container">
      <div class="login-box p-10 rounded-2xl shadow-2xl w-full max-w-md border-2">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4 shadow-lg">
            <i class="fas fa-flask text-3xl text-white"></i>
          </div>
          <h2 class="text-3xl font-bold login-title">
            Akagami Research
          </h2>
          <p class="login-subtitle mt-2">管理者ログイン</p>
        </div>
        <form onsubmit="handleLogin(event)" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold mb-2">パスワード</label>
            <input 
              type="password" 
              id="admin-password"
              class="login-input w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="パスワードを入力"
              required
            />
          </div>
          <button 
            type="submit"
            class="btn-primary w-full px-4 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
          >
            <i class="fas fa-sign-in-alt mr-2"></i>ログイン
          </button>
        </form>
      </div>
    </div>
  `
}

async function handleLogin(event) {
  event.preventDefault()
  const password = document.getElementById('admin-password').value
  const submitBtn = event.target.querySelector('button[type="submit"]')
  
  // Disable button and show loading
  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>ログイン中...'
  
  try {
    const response = await axios.post('/api/auth/login', { password })
    
    if (response.data.success) {
      adminState.authenticated = true
      // Load data and render admin page directly without re-checking auth
      await loadAdminData()
      renderAdminPage()
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('パスワードが正しくありません')
    
    // Re-enable button
    submitBtn.disabled = false
    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>ログイン'
  }
}

// Initialize admin app
async function initAdminApp() {
  enableAdminDarkMode() // Enable dark mode
  const isAuth = await checkAuth()
  if (!isAuth) return
  
  await loadAdminData()
  renderAdminPage()
}

async function loadAdminData() {
  try {
    const [pdfsRes, catsRes, tagsRes, excludedRes] = await Promise.all([
      axios.get('/api/pdfs'),
      axios.get('/api/categories'),
      axios.get('/api/tags'),
      axios.get('/api/excluded-tags')
    ])
    
    adminState.pdfs = pdfsRes.data
    adminState.categories = catsRes.data
    adminState.tags = tagsRes.data
    adminState.excludedTags = excludedRes.data
  } catch (error) {
    console.error('Failed to load admin data:', error)
  }
}

function renderAdminPage() {
  const app = document.getElementById('admin-app')
  if (!app) return
  
  app.innerHTML = `
    <div class="min-h-screen" style="background-color: #1a1a1a;">
      <!-- Header -->
      <header style="background-color: #2d2d2d; border-bottom: 2px solid #4b5563;">
        <div class="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold flex items-center" style="color: #f3f4f6;">
                <i class="fas fa-flask mr-2" style="color: #e75556;"></i>
                Akagami Research
              </h1>
              <p class="text-xs mt-0.5" style="color: #d1d5db;">管理画面</p>
            </div>
            <div class="flex gap-2">
              <a href="/" class="px-3 py-1.5 text-sm rounded-lg transition-all duration-300 font-medium shadow-md" style="background-color: #e75556; color: white;" aria-label="公開ページへ移動">
                <i class="fas fa-home mr-1" aria-hidden="true"></i>公開ページへ
              </a>
              <button onclick="logout()" class="px-3 py-1.5 text-sm rounded-lg transition-all duration-300 font-medium shadow-md" style="background-color: #dc2626; color: white;" aria-label="ログアウト">
                <i class="fas fa-sign-out-alt mr-1" aria-hidden="true"></i>ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <!-- Action Buttons -->
        <div class="mb-4 flex flex-wrap gap-2">
          <button onclick="showAddPdfModal()" class="px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg font-semibold" style="background-color: #e75556; color: white;" aria-label="PDFを追加">
            <i class="fas fa-plus mr-1" aria-hidden="true"></i>PDF追加
          </button>
          <button onclick="showBulkUploadModal()" class="px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg font-semibold" style="background-color: #16a34a; color: white;" aria-label="テキスト一括アップロード">
            <i class="fas fa-upload mr-1" aria-hidden="true"></i>テキスト一括アップロード
          </button>
          <button onclick="showAnalyticsModal()" class="px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg font-semibold" style="background-color: #3b82f6; color: white;" aria-label="アクセス解析">
            <i class="fas fa-chart-line mr-1" aria-hidden="true"></i>アクセス解析
          </button>
          <button onclick="showUsersModal()" class="px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg font-semibold" style="background-color: #10b981; color: white;" aria-label="登録者一覧">
            <i class="fas fa-users mr-1" aria-hidden="true"></i>登録者一覧
          </button>
          <button onclick="showManageCategoriesModal()" class="px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg font-semibold" style="background-color: #e75556; color: white;" aria-label="カテゴリ管理">
            <i class="fas fa-layer-group mr-1" aria-hidden="true"></i>カテゴリ管理
          </button>
          <button onclick="showManageTagsModal()" class="px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg font-semibold" style="background-color: #6b7280; color: white;" aria-label="タグ管理">
            <i class="fas fa-tags mr-1" aria-hidden="true"></i>タグ管理
          </button>
          <button onclick="showExcludedTagsModal()" class="px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg font-semibold" style="background-color: #4b5563; color: white;" aria-label="除外タグ管理">
            <i class="fas fa-ban mr-1" aria-hidden="true"></i>除外タグ管理
          </button>
          <a href="/admin/news" class="px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg font-semibold" style="background-color: #f59e0b; color: white;" aria-label="ニュース管理">
            <i class="fas fa-newspaper mr-1" aria-hidden="true"></i>ニュース管理
          </a>
          <a href="/admin/articles" class="px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg font-semibold" style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white;" aria-label="記事管理">
            <i class="fas fa-file-alt mr-1" aria-hidden="true"></i>記事管理
          </a>
          <a href="/admin/instagram-faq" class="px-4 py-2 text-sm rounded-lg transition-all duration-300 shadow-lg font-semibold" style="background-color: #8b5cf6; color: white;" aria-label="Instagram FAQ管理">
            <i class="fab fa-instagram mr-1" aria-hidden="true"></i>FAQ管理
          </a>
        </div>

        <!-- PDF List -->
        <div class="rounded-xl shadow-xl overflow-hidden" style="background-color: #2d2d2d; border: 2px solid #4b5563;">
          <div class="px-4 py-3" style="background-color: #3a3a3a; border-bottom: 2px solid #4b5563;">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-bold" style="color: #f3f4f6;">
                <i class="fas fa-list mr-2" style="color: #e75556;"></i>登録済みPDF一覧
              </h2>
              <div class="text-sm" style="color: #9ca3af;">
                全 <span id="pdf-count" style="color: #e75556; font-weight: bold;">${adminState.pdfs.length}</span> 件
              </div>
            </div>
            
            <!-- Category Filter Buttons -->
            <div class="flex flex-wrap gap-2">
              <button 
                onclick="filterByCategory(null)" 
                class="category-filter-btn px-3 py-1.5 text-sm rounded-lg transition-all duration-200 font-medium ${adminState.selectedCategoryFilter === null ? 'active' : ''}"
                style="${adminState.selectedCategoryFilter === null ? 'background-color: #e75556; color: white;' : 'background-color: #4b5563; color: #d1d5db;'}"
              >
                <i class="fas fa-th-large mr-1"></i>すべて
              </button>
              ${adminState.categories.map(cat => `
                <button 
                  onclick="filterByCategory(${cat.id})" 
                  class="category-filter-btn px-3 py-1.5 text-sm rounded-lg transition-all duration-200 font-medium ${adminState.selectedCategoryFilter === cat.id ? 'active' : ''}"
                  style="${adminState.selectedCategoryFilter === cat.id ? 'background-color: #e75556; color: white;' : 'background-color: #4b5563; color: #d1d5db;'}"
                >
                  <i class="fas fa-folder mr-1"></i>${escapeHtml(cat.name)}
                  <span class="ml-1 opacity-75">(${adminState.pdfs.filter(p => p.category_id === cat.id).length})</span>
                </button>
              `).join('')}
            </div>
          </div>
          <div id="admin-pdf-list">
            ${renderAdminPdfList()}
          </div>
        </div>
      </main>
    </div>

    <!-- Modal Container -->
    <div id="modal-container"></div>
  `
}

function renderAdminPdfList() {
  // Filter PDFs by selected category
  const filteredPdfs = adminState.selectedCategoryFilter === null 
    ? adminState.pdfs 
    : adminState.pdfs.filter(pdf => pdf.category_id === adminState.selectedCategoryFilter)
  
  if (filteredPdfs.length === 0) {
    return `
      <div class="px-6 py-16 text-center" style="color: #9ca3af;">
        <i class="fas fa-inbox text-7xl mb-4" style="color: #6b7280;"></i>
        <p class="text-xl font-medium">
          ${adminState.selectedCategoryFilter === null ? 'PDFが登録されていません' : 'このカテゴリにPDFが登録されていません'}
        </p>
      </div>
    `
  }
  
  return filteredPdfs.map(pdf => `
    <div class="px-4 py-2.5 transition-all duration-200" style="border-bottom: 1px solid #4b5563; background-color: #2d2d2d;">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="text-sm font-bold mb-1.5" style="color: #f3f4f6;">
            ${escapeHtml(pdf.title)}
          </h3>
          <div class="flex flex-wrap gap-1.5 items-center">
            ${pdf.category_name ? `
              <div class="relative inline-block category-change-wrapper">
                <button 
                  onclick="toggleCategoryDropdown(${pdf.id})" 
                  class="text-xs px-2 py-0.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                  style="background-color: #e75556; color: white;"
                  title="カテゴリを変更"
                >
                  <i class="fas fa-folder mr-1"></i>${escapeHtml(pdf.category_name)}
                  <i class="fas fa-caret-down ml-1"></i>
                </button>
                <div id="category-dropdown-${pdf.id}" class="hidden absolute z-10 mt-1 rounded-lg shadow-xl" style="background-color: #3a3a3a; border: 2px solid #4b5563; min-width: 200px;">
                  ${adminState.categories.map(cat => `
                    <button 
                      onclick="quickChangeCategory(${pdf.id}, ${cat.id}, '${escapeHtml(cat.name).replace(/'/g, "\\'")}')"
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors ${pdf.category_id === cat.id ? 'font-bold' : ''}"
                      style="color: ${pdf.category_id === cat.id ? '#e75556' : '#d1d5db'};"
                    >
                      <i class="fas fa-folder mr-2"></i>${escapeHtml(cat.name)}
                      ${pdf.category_id === cat.id ? '<i class="fas fa-check ml-2"></i>' : ''}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            ${pdf.tags ? pdf.tags.map(tag => `
              <span class="text-xs px-2 py-0.5 rounded-full" style="background-color: #4b5563; color: #d1d5db;">
                <i class="fas fa-tag mr-1"></i>${escapeHtml(tag.name)}
              </span>
            `).join('') : ''}
          </div>
        </div>
        <div class="flex gap-1.5 ml-4">
          <button onclick="editPdf(${pdf.id})" class="px-3 py-1.5 text-sm rounded-lg transition-all duration-300 shadow-md font-medium" style="background-color: #e75556; color: white;" aria-label="${escapeHtml(pdf.title)}を編集">
            <i class="fas fa-edit" aria-hidden="true"></i>
          </button>
          <button onclick="deletePdf(${pdf.id})" class="px-3 py-1.5 text-sm rounded-lg transition-all duration-300 shadow-md font-medium" style="background-color: #dc2626; color: white;" aria-label="${escapeHtml(pdf.title)}を削除">
            <i class="fas fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('')
}

// PDF operations
function showBulkUploadModal() {
  const modalHtml = `
    <div class="fixed inset-0 modal-overlay flex items-center justify-center z-50" onclick="closeModal(event)">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-green-500 to-green-600">
          <h2 class="text-xl font-bold text-white">
            <i class="fas fa-upload mr-2"></i>一括アップロード（コピペ対応）
          </h2>
          <button onclick="closeModal()" class="text-white hover:text-gray-200" aria-label="モーダルを閉じる">
            <i class="fas fa-times text-2xl" aria-hidden="true"></i>
          </button>
        </div>
        
        <form onsubmit="saveBulkPdfsFromText(event)" class="px-6 py-4 space-y-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">共通カテゴリ（必須）</label>
            <select 
              id="bulk-category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">カテゴリを選択してください</option>
              ${adminState.categories.map(cat => `
                <option value="${cat.id}">${escapeHtml(cat.name)}</option>
              `).join('')}
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-paste mr-1 text-green-500"></i>
              PDFリスト（タイトルとURLをタブ区切りで貼り付け）
            </label>
            <textarea 
              id="bulk-text-input"
              rows="12"
              placeholder="タイトル.pdf	https://drive.google.com/file/d/...
別のタイトル.pdf	https://drive.google.com/file/d/...
またタイトル.pdf	https://drive.google.com/file/d/...

※ タイトルとURLの間は「タブ」で区切ってください
※ 1行に1件ずつ入力してください"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
              required
            ></textarea>
            <div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-xs text-blue-800">
                <i class="fas fa-info-circle mr-1"></i>
                <strong>使い方:</strong><br>
                1. ExcelやGoogleスプレッドシートで「タイトル」と「URL」の2列を選択<br>
                2. コピー（Ctrl+C / Cmd+C）<br>
                3. 上のテキストエリアに貼り付け（Ctrl+V / Cmd+V）<br>
                4. カテゴリを選択して「一括登録」ボタンをクリック
              </p>
            </div>
          </div>
          
          <div id="preview-area" class="hidden">
            <h3 class="text-sm font-bold text-gray-700 mb-2">
              <i class="fas fa-eye mr-1"></i>プレビュー（<span id="preview-count">0</span>件）
            </h3>
            <div id="preview-list" class="max-h-48 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200"></div>
          </div>
          
          <div class="flex gap-4 pt-4 border-t">
            <button 
              type="button"
              onclick="previewBulkPdfs()"
              class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-lg"
            >
              <i class="fas fa-eye mr-2"></i>プレビュー
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg"
            >
              <i class="fas fa-check mr-2"></i>一括登録
            </button>
            <button 
              type="button"
              onclick="closeModal()"
              class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  `
  
  document.getElementById('modal-container').innerHTML = modalHtml
}

async function saveBulkPdfs(event) {
  event.preventDefault()
  
  const commonCategoryId = document.getElementById('bulk-category').value || null
  const pdfs = []
  
  // Collect all PDFs with title and URL
  for (let i = 0; i < 10; i++) {
    const title = document.getElementById(`bulk-title-${i}`).value.trim()
    const url = document.getElementById(`bulk-url-${i}`).value.trim()
    
    if (title && url) {
      pdfs.push({
        title,
        google_drive_url: url,
        category_id: commonCategoryId,
        tag_ids: []
      })
    }
  }
  
  if (pdfs.length === 0) {
    alert('少なくとも1件のPDF（タイトルとURL）を入力してください')
    return
  }
  
  try {
    // Upload all PDFs
    const promises = pdfs.map(pdf => axios.post('/api/pdfs', pdf))
    await Promise.all(promises)
    
    alert(`${pdfs.length}件のPDFを登録しました！`)
    closeModal()
    await loadAdminData()
    renderAdminPage()
  } catch (error) {
    alert('一括登録に失敗しました: ' + error.message)
  }
}

function previewBulkPdfs() {
  const textInput = document.getElementById('bulk-text-input').value.trim()
  
  if (!textInput) {
    alert('PDFリストを入力してください')
    return
  }
  
  const lines = textInput.split('\n').filter(line => line.trim())
  const pdfs = []
  
  for (const line of lines) {
    // Split by tab or multiple spaces
    const parts = line.split(/\t+|\s{2,}/)
    
    if (parts.length >= 2) {
      let title = parts[0].trim()
      const url = parts[1].trim()
      
      // Remove .pdf extension if present
      if (title.endsWith('.pdf')) {
        title = title.slice(0, -4)
      }
      
      if (title && url) {
        pdfs.push({ title, url })
      }
    }
  }
  
  const previewArea = document.getElementById('preview-area')
  const previewList = document.getElementById('preview-list')
  const previewCount = document.getElementById('preview-count')
  
  if (pdfs.length === 0) {
    alert('有効なPDFが見つかりませんでした。\n\nタイトルとURLの間をタブで区切ってください。')
    return
  }
  
  previewCount.textContent = pdfs.length
  previewList.innerHTML = pdfs.map((pdf, i) => `
    <div class="p-2 bg-white rounded border border-gray-200 text-xs">
      <div class="font-bold text-gray-700">${i + 1}. ${escapeHtml(pdf.title)}</div>
      <div class="text-gray-500 truncate">${escapeHtml(pdf.url)}</div>
    </div>
  `).join('')
  
  previewArea.classList.remove('hidden')
}

async function saveBulkPdfsFromText(event) {
  event.preventDefault()
  
  const categoryId = document.getElementById('bulk-category').value
  const textInput = document.getElementById('bulk-text-input').value.trim()
  
  if (!categoryId) {
    alert('カテゴリを選択してください')
    return
  }
  
  if (!textInput) {
    alert('PDFリストを入力してください')
    return
  }
  
  const lines = textInput.split('\n').filter(line => line.trim())
  const pdfs = []
  
  for (const line of lines) {
    // Split by tab or multiple spaces
    const parts = line.split(/\t+|\s{2,}/)
    
    if (parts.length >= 2) {
      let title = parts[0].trim()
      const url = parts[1].trim()
      
      // Remove .pdf extension if present
      if (title.endsWith('.pdf')) {
        title = title.slice(0, -4)
      }
      
      if (title && url) {
        pdfs.push({
          title,
          google_drive_url: url,
          category_id: categoryId,
          tag_ids: []
        })
      }
    }
  }
  
  if (pdfs.length === 0) {
    alert('有効なPDFが見つかりませんでした。\n\nタイトルとURLの間をタブで区切ってください。')
    return
  }
  
  try {
    // Upload all PDFs
    const promises = pdfs.map(pdf => axios.post('/api/pdfs', pdf))
    await Promise.all(promises)
    
    alert(`${pdfs.length}件のPDFを登録しました！`)
    closeModal()
    await loadAdminData()
    renderAdminPage()
  } catch (error) {
    alert('一括登録に失敗しました: ' + error.message)
  }
}

function showAddPdfModal() {
  adminState.editingPdf = null
  showPdfModal()
}

async function editPdf(id) {
  try {
    const response = await axios.get(`/api/pdfs/${id}`)
    adminState.editingPdf = response.data
    showPdfModal()
  } catch (error) {
    alert('PDFの読み込みに失敗しました')
  }
}

function showPdfModal() {
  const isEdit = !!adminState.editingPdf
  const pdf = adminState.editingPdf || {}
  
  const modalHtml = `
    <div class="fixed inset-0 modal-overlay flex items-center justify-center z-50" onclick="closeModal(event)">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">
            <i class="fas fa-file-pdf mr-2"></i>${isEdit ? 'PDF編集' : 'PDF追加'}
          </h2>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700" aria-label="モーダルを閉じる">
            <i class="fas fa-times text-2xl" aria-hidden="true"></i>
          </button>
        </div>
        
        <form onsubmit="savePdf(event)" class="px-6 py-4 space-y-4" id="pdf-form">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">タイトル *</label>
            <input 
              type="text" 
              id="pdf-title"
              value="${escapeHtml(pdf.title || '')}"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Google Drive URL ${isEdit ? '' : '*'}</label>
            <input 
              type="url" 
              id="pdf-url"
              value="${escapeHtml(pdf.google_drive_url || '')}"
              placeholder="https://drive.google.com/file/d/..."
              ${!isEdit ? 'required' : ''}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="mt-1 text-xs text-gray-500">
              <i class="fas fa-info-circle mr-1"></i>Google Driveで「リンクを知っている全員」に共有設定してください
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
            <select 
                id="pdf-category"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">なし</option>
                ${adminState.categories.map(cat => `
                  <option value="${cat.id}" ${pdf.category_id === cat.id ? 'selected' : ''}>
                    ${escapeHtml(cat.name)}
                  </option>
                `).join('')}
              </select>
            </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">タグ</label>
            <div class="flex flex-wrap gap-2">
              ${adminState.tags.map(tag => {
                const isChecked = pdf.tags && pdf.tags.some(t => t.id === tag.id)
                return `
                  <label class="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      name="pdf-tags" 
                      value="${tag.id}"
                      ${isChecked ? 'checked' : ''}
                      class="mr-2 rounded"
                    />
                    <span class="text-sm">${escapeHtml(tag.name)}</span>
                  </label>
                `
              }).join('')}
            </div>
          </div>
          
          <div class="flex gap-4 pt-4">
            <button 
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i class="fas fa-save mr-2"></i>${isEdit ? '更新' : '追加'}
            </button>
            <button 
              type="button"
              onclick="closeModal()"
              class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  `
  
  document.getElementById('modal-container').innerHTML = modalHtml
}

async function savePdf(event) {
  event.preventDefault()
  
  const title = document.getElementById('pdf-title').value
  const google_drive_url = document.getElementById('pdf-url').value
  const category_id = document.getElementById('pdf-category').value || null
  
  const tagCheckboxes = document.querySelectorAll('input[name="pdf-tags"]:checked')
  const tag_ids = Array.from(tagCheckboxes).map(cb => parseInt(cb.value))
  
  const data = {
    title,
    google_drive_url,
    category_id,
    tag_ids
  }
  
  try {
    if (adminState.editingPdf) {
      await axios.put(`/api/pdfs/${adminState.editingPdf.id}`, data)
    } else {
      await axios.post('/api/pdfs', data)
    }
    
    closeModal()
    await loadAdminData()
    renderAdminPage()
  } catch (error) {
    alert('保存に失敗しました: ' + (error.response?.data?.error || error.message))
  }
}

async function deletePdf(id) {
  if (!confirm('このPDFを削除してもよろしいですか？')) return
  
  try {
    await axios.delete(`/api/pdfs/${id}`)
    await loadAdminData()
    renderAdminPage()
  } catch (error) {
    alert('削除に失敗しました')
  }
}

// Category management
function showManageCategoriesModal() {
  const modalHtml = `
    <div class="fixed inset-0 modal-overlay flex items-center justify-center z-50" onclick="closeModal(event)">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">
            <i class="fas fa-folder mr-2"></i>カテゴリ管理
          </h2>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700" aria-label="モーダルを閉じる">
            <i class="fas fa-times text-2xl" aria-hidden="true"></i>
          </button>
        </div>
        
        <div class="px-6 py-4">
          <form onsubmit="addCategory(event)" class="mb-6 flex gap-2">
            <input 
              type="text" 
              id="new-category-name"
              placeholder="新しいカテゴリ名"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <i class="fas fa-plus mr-2"></i>追加
            </button>
          </form>
          
          <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800">
              <i class="fas fa-info-circle mr-1"></i>
              <strong>並び替え：</strong>↑↓ボタンでカテゴリの表示順を変更できます
            </p>
          </div>
          
          <div class="space-y-3" id="categories-list">
            ${adminState.categories.map((cat, index) => `
              <div class="p-4 bg-gray-50 rounded-lg border border-gray-200" data-category-id="${cat.id}">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="flex flex-col gap-1">
                      <button 
                        onclick="moveCategoryUp(${index})"
                        ${index === 0 ? 'disabled' : ''}
                        class="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i class="fas fa-arrow-up"></i>
                      </button>
                      <button 
                        onclick="moveCategoryDown(${index})"
                        ${index === adminState.categories.length - 1 ? 'disabled' : ''}
                        class="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i class="fas fa-arrow-down"></i>
                      </button>
                    </div>
                    <span class="font-bold text-lg">${escapeHtml(cat.name)}</span>
                  </div>
                  <div class="flex gap-2">
                    <button 
                      onclick="editCategory(${cat.id})"
                      class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      <i class="fas fa-edit"></i> 編集
                    </button>
                    <button 
                      onclick="deleteCategory(${cat.id})"
                      class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                ${cat.download_url ? `
                  <div class="text-sm text-gray-600 mt-2">
                    <i class="fas fa-link mr-1"></i>
                    <span class="font-medium">ダウンロードURL:</span>
                    <a href="${escapeHtml(cat.download_url)}" target="_blank" class="text-blue-600 hover:underline ml-1">
                      ${escapeHtml(cat.download_url)}
                    </a>
                  </div>
                ` : '<div class="text-sm text-gray-400 mt-2"><i class="fas fa-info-circle mr-1"></i>ダウンロードURL未設定</div>'}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `
  
  document.getElementById('modal-container').innerHTML = modalHtml
}

function editCategory(id) {
  const category = adminState.categories.find(cat => cat.id === id)
  if (!category) return
  
  const modalHtml = `
    <div class="fixed inset-0 modal-overlay flex items-center justify-center z-50" onclick="closeModal(event)">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">
            <i class="fas fa-edit mr-2"></i>カテゴリ編集
          </h2>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700" aria-label="モーダルを閉じる">
            <i class="fas fa-times text-2xl" aria-hidden="true"></i>
          </button>
        </div>
        
        <form onsubmit="updateCategory(event, ${id})" class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">カテゴリ名</label>
            <input 
              type="text" 
              id="edit-category-name"
              value="${escapeHtml(category.name)}"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">説明（オプション）</label>
            <input 
              type="text" 
              id="edit-category-description"
              value="${escapeHtml(category.description || '')}"
              placeholder="カテゴリの説明"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-download mr-1 text-blue-500"></i>
              一括ダウンロードURL（オプション）
            </label>
            <input 
              type="url" 
              id="edit-category-download-url"
              value="${escapeHtml(category.download_url || '')}"
              placeholder="https://drive.google.com/..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="mt-1 text-xs text-gray-500">
              <i class="fas fa-info-circle mr-1"></i>
              このURLが設定されている場合、「カテゴリ内のファイルを全ダウンロード」ボタンをクリックするとこのURLに飛びます
            </p>
          </div>
          
          <div class="flex gap-4 pt-4">
            <button 
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i class="fas fa-save mr-2"></i>更新
            </button>
            <button 
              type="button"
              onclick="showManageCategoriesModal()"
              class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              戻る
            </button>
          </div>
        </form>
      </div>
    </div>
  `
  
  document.getElementById('modal-container').innerHTML = modalHtml
}

async function updateCategory(event, id) {
  event.preventDefault()
  
  const name = document.getElementById('edit-category-name').value
  const description = document.getElementById('edit-category-description').value
  const download_url = document.getElementById('edit-category-download-url').value
  
  try {
    await axios.put(`/api/categories/${id}`, { 
      name, 
      description: description || '',
      download_url: download_url || null
    })
    await loadAdminData()
    showManageCategoriesModal()
  } catch (error) {
    alert('カテゴリの更新に失敗しました')
  }
}

async function addCategory(event) {
  event.preventDefault()
  const name = document.getElementById('new-category-name').value
  
  try {
    console.log('Adding category:', name)
    const response = await axios.post('/api/categories', { name, description: '' })
    console.log('Category added successfully:', response.data)
    
    console.log('Loading admin data...')
    await loadAdminData()
    console.log('Admin data loaded successfully')
    
    console.log('Showing manage categories modal...')
    showManageCategoriesModal()
    console.log('Done!')
  } catch (error) {
    console.error('Failed to add category:', error)
    console.error('Error response:', error.response)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    alert('カテゴリの追加に失敗しました: ' + (error.response?.data?.error || error.message))
  }
}

async function deleteCategory(id) {
  if (!confirm('このカテゴリを削除してもよろしいですか？')) return
  
  try {
    await axios.delete(`/api/categories/${id}`)
    await loadAdminData()
    showManageCategoriesModal()
  } catch (error) {
    alert('カテゴリの削除に失敗しました')
  }
}

// Move category up in order
async function moveCategoryUp(index) {
  if (index === 0) return
  
  const categories = [...adminState.categories]
  const temp = categories[index]
  categories[index] = categories[index - 1]
  categories[index - 1] = temp
  
  await saveCategoryOrder(categories)
}

// Move category down in order
async function moveCategoryDown(index) {
  if (index === adminState.categories.length - 1) return
  
  const categories = [...adminState.categories]
  const temp = categories[index]
  categories[index] = categories[index + 1]
  categories[index + 1] = temp
  
  await saveCategoryOrder(categories)
}

// Save new category order to database
async function saveCategoryOrder(categories) {
  try {
    // Assign new sort_order values (10, 20, 30, ...)
    const categoryOrders = categories.map((cat, index) => ({
      id: cat.id,
      sort_order: (index + 1) * 10
    }))
    
    await axios.post('/api/categories/reorder', { categoryOrders })
    await loadAdminData()
    showManageCategoriesModal()
  } catch (error) {
    alert('カテゴリの並び替えに失敗しました')
  }
}

// Tag management
function showManageTagsModal() {
  const modalHtml = `
    <div class="fixed inset-0 modal-overlay flex items-center justify-center z-50" onclick="closeModal(event)">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">
            <i class="fas fa-tags mr-2"></i>タグ管理
          </h2>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700" aria-label="モーダルを閉じる">
            <i class="fas fa-times text-2xl" aria-hidden="true"></i>
          </button>
        </div>
        
        <div class="px-6 py-4">
          <form onsubmit="addTag(event)" class="mb-6 flex gap-2">
            <input 
              type="text" 
              id="new-tag-name"
              placeholder="新しいタグ名"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="submit"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <i class="fas fa-plus mr-2"></i>追加
            </button>
          </form>
          
          <div class="flex flex-wrap gap-2" id="tags-list">
            ${adminState.tags.map(tag => `
              <div class="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
                <span class="text-sm font-medium">${escapeHtml(tag.name)}</span>
                <button 
                  onclick="deleteTag(${tag.id})"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `
  
  document.getElementById('modal-container').innerHTML = modalHtml
}

async function addTag(event) {
  event.preventDefault()
  const name = document.getElementById('new-tag-name').value
  
  try {
    await axios.post('/api/tags', { name })
    await loadAdminData()
    showManageTagsModal()
  } catch (error) {
    alert('タグの追加に失敗しました')
  }
}

async function deleteTag(id) {
  if (!confirm('このタグを削除してもよろしいですか？\n（削除したタグは自動的に除外リストに追加されます）')) return
  
  try {
    await axios.delete(`/api/tags/${id}`)
    await loadAdminData()
    showManageTagsModal()
  } catch (error) {
    alert('タグの削除に失敗しました')
  }
}

// Excluded tags management
function showExcludedTagsModal() {
  const modalHtml = `
    <div class="fixed inset-0 modal-overlay flex items-center justify-center z-50" onclick="closeModal(event)">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">
            <i class="fas fa-ban mr-2"></i>除外タグ管理
          </h2>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700" aria-label="モーダルを閉じる">
            <i class="fas fa-times text-2xl" aria-hidden="true"></i>
          </button>
        </div>
        
        <div class="px-6 py-4">
          <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-sm text-gray-700">
              <i class="fas fa-info-circle mr-2 text-yellow-600"></i>
              除外タグに追加された単語は、PDFタイトルから自動生成されなくなります。<br>
              タグ管理で削除したタグも自動的にここに追加されます。
            </p>
          </div>
          
          <form onsubmit="addExcludedTag(event)" class="mb-6 flex gap-2">
            <input 
              type="text" 
              id="new-excluded-tag-name"
              placeholder="除外するタグ名"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <button 
              type="submit"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <i class="fas fa-plus mr-2"></i>除外リストに追加
            </button>
          </form>
          
          <div class="space-y-2" id="excluded-tags-list">
            ${adminState.excludedTags.length === 0 ? `
              <p class="text-gray-500 text-center py-8">除外タグがありません</p>
            ` : ''}
            ${adminState.excludedTags.map(tag => `
              <div class="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <span class="text-sm font-medium text-gray-700">
                  <i class="fas fa-ban mr-2 text-gray-500"></i>${escapeHtml(tag.tag_name)}
                </span>
                <button 
                  onclick="removeExcludedTag(${tag.id})"
                  class="text-red-500 hover:text-red-700 transition-colors"
                  title="除外リストから削除"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `
  
  document.getElementById('modal-container').innerHTML = modalHtml
}

async function addExcludedTag(event) {
  event.preventDefault()
  const tagName = document.getElementById('new-excluded-tag-name').value
  
  try {
    await axios.post('/api/excluded-tags', { tag_name: tagName })
    await loadAdminData()
    showExcludedTagsModal()
  } catch (error) {
    alert('除外タグの追加に失敗しました')
  }
}

async function removeExcludedTag(id) {
  if (!confirm('この除外タグを削除してもよろしいですか？\n（今後このタグが自動生成されるようになります）')) return
  
  try {
    await axios.delete(`/api/excluded-tags/${id}`)
    await loadAdminData()
    showExcludedTagsModal()
  } catch (error) {
    alert('除外タグの削除に失敗しました')
  }
}

// Modal utilities
function closeModal(event) {
  if (event && event.target !== event.currentTarget) return
  document.getElementById('modal-container').innerHTML = ''
}

async function logout() {
  try {
    await axios.post('/api/auth/logout')
  } catch (error) {
    console.error('Logout error:', error)
  }
  
  adminState.authenticated = false
  location.reload()
}

// Utility functions are now in utils.js

// ============================================
// Analytics Modal
// ============================================

async function showAnalyticsModal() {
  try {
    // Fetch analytics data
    const [overviewRes, topPdfsRes, categoriesRes] = await Promise.all([
      axios.get('/api/analytics/overview'),
      axios.get('/api/analytics/pdfs'),
      axios.get('/api/analytics/categories')
    ])
    
    const overview = overviewRes.data
    const topPdfs = topPdfsRes.data
    const categories = categoriesRes.data
    
    const modal = document.getElementById('modal-container')
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onclick="closeModal(event)">
        <div class="rounded-2xl shadow-2xl w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto" style="background-color: #2d2d2d; border: 2px solid #4b5563;" onclick="event.stopPropagation()">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold flex items-center" style="color: #f3f4f6;">
              <i class="fas fa-chart-line mr-3" style="color: #3b82f6;"></i>
              アクセス解析ダッシュボード
            </h2>
            <button onclick="closeModal(event)" class="text-3xl hover:opacity-70 transition-opacity" style="color: #9ca3af;">
              &times;
            </button>
          </div>
          
          <!-- Google Analytics Notice -->
          <div class="mb-6 p-4 rounded-lg" style="background-color: #3b82f6; background-image: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
            <div class="flex items-start gap-3">
              <i class="fas fa-info-circle text-2xl text-white mt-1"></i>
              <div class="flex-1">
                <h3 class="text-white font-bold text-lg mb-1">Google Analytics連携済み</h3>
                <p class="text-blue-100 text-sm mb-2">
                  測定ID: <span class="font-mono font-semibold">G-JPMZ82RMGG</span>
                </p>
                <p class="text-blue-100 text-sm">
                  リアルタイムアクセス解析は <a href="https://analytics.google.com/analytics/web/#/p13287130556/reports/intelligenthome" target="_blank" class="underline font-semibold hover:text-white">Google Analyticsダッシュボード</a> でご確認ください。
                </p>
              </div>
            </div>
          </div>
          
          <!-- Overview Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <div class="p-4 rounded-lg" style="background-color: #3a3a3a; border: 2px solid #4b5563;">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm" style="color: #9ca3af;">総PDF数</span>
                <i class="fas fa-file-pdf" style="color: #ef4444;"></i>
              </div>
              <div class="text-3xl font-bold" style="color: #f3f4f6;">${overview.totalPdfs}</div>
            </div>
            
            <div class="p-4 rounded-lg" style="background-color: #3a3a3a; border: 2px solid #4b5563;">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm" style="color: #9ca3af;">総ダウンロード数</span>
                <i class="fas fa-download" style="color: #3b82f6;"></i>
              </div>
              <div class="text-3xl font-bold" style="color: #f3f4f6;">${overview.totalDownloads}</div>
            </div>
            
            <div class="p-4 rounded-lg" style="background-color: #3a3a3a; border: 2px solid #4b5563;">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm" style="color: #9ca3af;">カテゴリ数</span>
                <i class="fas fa-layer-group" style="color: #10b981;"></i>
              </div>
              <div class="text-3xl font-bold" style="color: #f3f4f6;">${overview.totalCategories}</div>
            </div>
            
            <div class="p-4 rounded-lg" style="background-color: #3a3a3a; border: 2px solid #4b5563;">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm" style="color: #9ca3af;">タグ数</span>
                <i class="fas fa-tags" style="color: #f59e0b;"></i>
              </div>
              <div class="text-3xl font-bold" style="color: #f3f4f6;">${overview.totalTags}</div>
            </div>
            
            <div class="p-4 rounded-lg" style="background-color: #3a3a3a; border: 2px solid #4b5563;">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm" style="color: #9ca3af;">直近7日の新規PDF</span>
                <i class="fas fa-star" style="color: #fbbf24;"></i>
              </div>
              <div class="text-3xl font-bold" style="color: #f3f4f6;">${overview.recentPdfs}</div>
            </div>
          </div>
          
          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Top 10 PDFs -->
            <div class="p-4 rounded-lg" style="background-color: #3a3a3a; border: 2px solid #4b5563;">
              <h3 class="text-lg font-bold mb-4 flex items-center" style="color: #f3f4f6;">
                <i class="fas fa-trophy mr-2" style="color: #fbbf24;"></i>
                人気PDF トップ10
              </h3>
              <div class="space-y-2 max-h-96 overflow-y-auto">
                ${topPdfs.map((pdf, index) => `
                  <div class="p-3 rounded-lg flex items-center gap-3" style="background-color: #2d2d2d;">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style="background-color: ${index < 3 ? '#fbbf24' : '#4b5563'}; color: ${index < 3 ? '#1f2937' : '#f3f4f6'};">
                      ${index + 1}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate" style="color: #f3f4f6;">${escapeHtml(pdf.title)}</p>
                      <p class="text-xs" style="color: #9ca3af;">${escapeHtml(pdf.category_name || 'カテゴリなし')}</p>
                    </div>
                    <div class="flex-shrink-0 text-right">
                      <p class="text-lg font-bold" style="color: #3b82f6;">${pdf.download_count}</p>
                      <p class="text-xs" style="color: #9ca3af;">DL</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Categories Stats -->
            <div class="p-4 rounded-lg" style="background-color: #3a3a3a; border: 2px solid #4b5563;">
              <h3 class="text-lg font-bold mb-4 flex items-center" style="color: #f3f4f6;">
                <i class="fas fa-layer-group mr-2" style="color: #10b981;"></i>
                カテゴリ別統計
              </h3>
              <div class="space-y-2 max-h-96 overflow-y-auto">
                ${categories.map((cat) => `
                  <div class="p-3 rounded-lg" style="background-color: #2d2d2d;">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium" style="color: #f3f4f6;">
                        <i class="${getCategoryIcon(cat.name)} mr-2" style="color: #e75556;"></i>
                        ${escapeHtml(cat.name)}
                      </span>
                      <span class="text-xs px-2 py-1 rounded-full" style="background-color: #4b5563; color: #d1d5db;">
                        ${cat.pdf_count} 件
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="flex-1 h-2 rounded-full overflow-hidden" style="background-color: #1f2937;">
                        <div class="h-full rounded-full" style="background-color: #3b82f6; width: ${Math.min(100, (cat.total_downloads / overview.totalDownloads) * 100)}%;"></div>
                      </div>
                      <span class="text-sm font-bold" style="color: #3b82f6;">${cat.total_downloads || 0} DL</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="mt-6 pt-4 border-t-2" style="border-color: #4b5563;">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <p class="text-sm" style="color: #9ca3af;">
                <i class="fas fa-clock mr-1"></i>
                最終更新: ${new Date().toLocaleString('ja-JP')}
              </p>
              <button onclick="closeModal(event)" class="px-4 py-2 rounded-lg font-semibold" style="background-color: #4b5563; color: #f3f4f6;">
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  } catch (error) {
    console.error('Failed to load analytics:', error)
    alert('アクセス解析データの読み込みに失敗しました')
  }
}

// Initialize on page load
if (window.location.pathname === '/admin') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminApp)
  } else {
    initAdminApp()
  }
}

// Users Modal
let usersCache = []

async function showUsersModal() {
  try {
    const response = await axios.get('/api/analytics/users', {
      withCredentials: true
    })
    
    usersCache = response.data
    
    const modalHtml = `
      <div class="modal-overlay" onclick="closeModal(event)" id="users-modal">
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;" onclick="event.stopPropagation()">
          <div style="position: sticky; top: 0; background: #1f2937; z-index: 10; padding: 20px; border-bottom: 1px solid #374151;">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-white text-2xl font-bold">
                <i class="fas fa-users mr-2"></i>登録者一覧
              </h2>
              <button onclick="closeModal()" class="text-gray-400 hover:text-white text-2xl">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <p class="text-gray-400 text-sm">総登録者数: ${usersCache.length}名</p>
          </div>
          
          <div style="padding: 20px;">
            <!-- Users Table -->
            <div class="overflow-x-auto">
              <table class="w-full" style="border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #374151;">
                    <th class="text-left text-white font-bold py-3 px-4" style="background: #1f2937;">会員番号</th>
                    <th class="text-left text-white font-bold py-3 px-4" style="background: #1f2937;">名前</th>
                    <th class="text-left text-white font-bold py-3 px-4" style="background: #1f2937;">メールアドレス</th>
                    <th class="text-left text-white font-bold py-3 px-4" style="background: #1f2937;">登録日</th>
                    <th class="text-left text-white font-bold py-3 px-4" style="background: #1f2937;">最終ログイン</th>
                    <th class="text-left text-white font-bold py-3 px-4" style="background: #1f2937;">認証方法</th>
                  </tr>
                </thead>
                <tbody>
                  ${usersCache.map((user, index) => `
                    <tr style="border-bottom: 1px solid #374151; ${index % 2 === 0 ? 'background: #111827;' : 'background: #1f2937;'}">
                      <td class="text-white py-3 px-4">${user.id}</td>
                      <td class="text-white py-3 px-4 font-medium">${escapeHtml(user.name)}</td>
                      <td class="text-gray-300 py-3 px-4 font-mono text-sm">${escapeHtml(user.email)}</td>
                      <td class="text-gray-400 py-3 px-4 text-sm">
                        ${new Date(user.created_at).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td class="text-gray-400 py-3 px-4 text-sm">
                        ${user.last_login ? new Date(user.last_login).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '未ログイン'}
                      </td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-1 rounded text-xs font-medium" style="${user.login_method === 'password' ? 'background: #3b82f6; color: white;' : 'background: #10b981; color: white;'}">
                          ${user.login_method === 'password' ? 'パスワード' : 'マジックリンク'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <!-- Export Button -->
            <div class="mt-6 flex justify-center">
              <button onclick="exportUsersToCSV()" class="px-6 py-3 rounded-lg font-semibold transition-all duration-300" style="background: #10b981; color: white;">
                <i class="fas fa-download mr-2"></i>CSVでエクスポート
              </button>
            </div>
          </div>
        </div>
      </div>
    `
    
    document.body.insertAdjacentHTML('beforeend', modalHtml)
  } catch (error) {
    console.error('Failed to load users:', error)
    alert('登録者データの読み込みに失敗しました: ' + (error.response?.data?.error || error.message))
  }
}

// Export users to CSV
function exportUsersToCSV() {
  const headers = ['会員番号', '名前', 'メールアドレス', '登録日', '最終ログイン', '認証方法']
  const rows = usersCache.map(user => [
    user.id,
    user.name,
    user.email,
    new Date(user.created_at).toLocaleString('ja-JP'),
    user.last_login ? new Date(user.last_login).toLocaleString('ja-JP') : '未ログイン',
    user.login_method === 'password' ? 'パスワード' : 'マジックリンク'
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `akagami_users_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

// ============================================
// Category Filter Functions
// ============================================

// Filter PDFs by category
function filterByCategory(categoryId) {
  adminState.selectedCategoryFilter = categoryId
  
  // Update PDF count
  const filteredPdfs = categoryId === null 
    ? adminState.pdfs 
    : adminState.pdfs.filter(pdf => pdf.category_id === categoryId)
  
  const pdfCountElement = document.getElementById('pdf-count')
  if (pdfCountElement) {
    pdfCountElement.textContent = filteredPdfs.length
  }
  
  // Re-render the admin page
  renderAdminPage()
}

// Toggle category dropdown
function toggleCategoryDropdown(pdfId) {
  const dropdown = document.getElementById(`category-dropdown-${pdfId}`)
  if (!dropdown) return
  
  // Close all other dropdowns first
  document.querySelectorAll('[id^="category-dropdown-"]').forEach(d => {
    if (d.id !== `category-dropdown-${pdfId}`) {
      d.classList.add('hidden')
    }
  })
  
  // Toggle current dropdown
  dropdown.classList.toggle('hidden')
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.category-change-wrapper')) {
    document.querySelectorAll('[id^="category-dropdown-"]').forEach(d => {
      d.classList.add('hidden')
    })
  }
})

// Quick change category
async function quickChangeCategory(pdfId, newCategoryId, newCategoryName) {
  try {
    // Close dropdown
    const dropdown = document.getElementById(`category-dropdown-${pdfId}`)
    if (dropdown) {
      dropdown.classList.add('hidden')
    }
    
    // Find the PDF
    const pdf = adminState.pdfs.find(p => p.id === pdfId)
    if (!pdf) {
      throw new Error('PDF not found')
    }
    
    // If same category, do nothing
    if (pdf.category_id === newCategoryId) {
      return
    }
    
    // Update via API
    const response = await axios.put(`/api/pdfs/${pdfId}`, {
      title: pdf.title,
      google_drive_url: pdf.google_drive_url,
      category_id: newCategoryId,
      tag_ids: pdf.tags ? pdf.tags.map(t => t.id) : []
    })
    
    if (response.data.success) {
      // Update local state
      pdf.category_id = newCategoryId
      pdf.category_name = newCategoryName
      
      // Show success message
      showToast(`「${pdf.title}」のカテゴリを「${newCategoryName}」に変更しました`, 'success')
      
      // Re-render the list
      document.getElementById('admin-pdf-list').innerHTML = renderAdminPdfList()
    }
  } catch (error) {
    console.error('Failed to change category:', error)
    showToast('カテゴリの変更に失敗しました', 'error')
  }
}

// showToast is now in utils.js

// Initialize admin app on page load
document.addEventListener('DOMContentLoaded', initAdminApp)

