// Admin page state
let adminState = {
  pdfs: [],
  categories: [],
  tags: [],
  editingPdf: null,
  showModal: false,
  authenticated: false
}

// Check authentication
function checkAuth() {
  const isAuth = sessionStorage.getItem('admin_authenticated')
  if (!isAuth) {
    showLoginForm()
    return false
  }
  adminState.authenticated = true
  return true
}

// Login form
function showLoginForm() {
  const app = document.getElementById('admin-app')
  if (!app) return
  
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-light">
      <div class="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border-2 border-primary/20">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 shadow-lg">
            <i class="fas fa-flask text-3xl text-white"></i>
          </div>
          <h2 class="text-3xl font-bold text-darker">
            Akagami Research
          </h2>
          <p class="text-dark mt-2">管理者ログイン</p>
        </div>
        <form onsubmit="handleLogin(event)" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-darker mb-2">パスワード</label>
            <input 
              type="password" 
              id="admin-password"
              class="w-full px-4 py-3 border-2 border-dark/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-light transition-all"
              placeholder="パスワードを入力"
              required
            />
          </div>
          <button 
            type="submit"
            class="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:from-secondary hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
          >
            <i class="fas fa-sign-in-alt mr-2"></i>ログイン
          </button>
        </form>
        <p class="mt-6 text-sm text-dark text-center">
          <i class="fas fa-info-circle mr-1"></i>
          デフォルトパスワード: <code class="bg-light px-3 py-1 rounded border border-primary/30 font-mono">admin123</code>
        </p>
      </div>
    </div>
  `
}

function handleLogin(event) {
  event.preventDefault()
  const password = document.getElementById('admin-password').value
  
  // Simple password check (in production, use proper authentication)
  if (password === 'admin123') {
    sessionStorage.setItem('admin_authenticated', 'true')
    adminState.authenticated = true
    initAdminApp()
  } else {
    alert('パスワードが正しくありません')
  }
}

// Initialize admin app
async function initAdminApp() {
  if (!checkAuth()) return
  
  await loadAdminData()
  renderAdminPage()
}

async function loadAdminData() {
  try {
    const [pdfsRes, catsRes, tagsRes] = await Promise.all([
      axios.get('/api/pdfs'),
      axios.get('/api/categories'),
      axios.get('/api/tags')
    ])
    
    adminState.pdfs = pdfsRes.data
    adminState.categories = catsRes.data
    adminState.tags = tagsRes.data
  } catch (error) {
    console.error('Failed to load admin data:', error)
  }
}

function renderAdminPage() {
  const app = document.getElementById('admin-app')
  if (!app) return
  
  app.innerHTML = `
    <div class="min-h-screen bg-light">
      {/* Header */}
      <header class="bg-gradient-to-r from-darker to-dark shadow-xl border-b-4 border-primary">
        <div class="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-white flex items-center">
                <i class="fas fa-flask text-secondary mr-3"></i>
                Akagami Research
              </h1>
              <p class="text-light text-sm mt-1 opacity-80">管理画面</p>
            </div>
            <div class="flex gap-3">
              <a href="/" class="px-5 py-2.5 bg-primary rounded-lg hover:bg-secondary transition-all duration-300 text-white font-medium shadow-md">
                <i class="fas fa-home mr-2"></i>公開ページへ
              </a>
              <button onclick="logout()" class="px-5 py-2.5 bg-accent rounded-lg hover:bg-dark transition-all duration-300 text-white font-medium shadow-md">
                <i class="fas fa-sign-out-alt mr-2"></i>ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Action Buttons */}
        <div class="mb-8 flex flex-wrap gap-4">
          <button onclick="showAddPdfModal()" class="admin-btn px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:from-secondary hover:to-primary transition-all duration-300 shadow-lg font-semibold">
            <i class="fas fa-plus mr-2"></i>PDF追加
          </button>
          <button onclick="showManageCategoriesModal()" class="admin-btn px-6 py-3 bg-gradient-to-r from-accent to-primary text-white rounded-xl hover:from-primary hover:to-accent transition-all duration-300 shadow-lg font-semibold">
            <i class="fas fa-layer-group mr-2"></i>カテゴリ管理
          </button>
          <button onclick="showManageTagsModal()" class="admin-btn px-6 py-3 bg-gradient-to-r from-dark to-accent text-white rounded-xl hover:from-accent hover:to-dark transition-all duration-300 shadow-lg font-semibold">
            <i class="fas fa-tags mr-2"></i>タグ管理
          </button>
        </div>

        {/* PDF List */}
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-primary/10">
          <div class="px-6 py-5 bg-gradient-to-r from-light to-white border-b-2 border-primary/20">
            <h2 class="text-2xl font-bold text-darker">
              <i class="fas fa-list mr-2 text-primary"></i>登録済みPDF一覧
            </h2>
          </div>
          <div id="admin-pdf-list" class="divide-y divide-primary/10">
            ${renderAdminPdfList()}
          </div>
        </div>
      </main>
    </div>

    {/* Modal Container */}
    <div id="modal-container"></div>
  `
}

function renderAdminPdfList() {
  if (adminState.pdfs.length === 0) {
    return `
      <div class="px-6 py-16 text-center text-dark">
        <i class="fas fa-inbox text-7xl mb-4 text-accent opacity-50"></i>
        <p class="text-xl font-medium">PDFが登録されていません</p>
      </div>
    `
  }
  
  return adminState.pdfs.map(pdf => `
    <div class="px-6 py-5 hover:bg-light/50 transition-all duration-200">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-bold text-darker mb-2">
            ${escapeHtml(pdf.title)}
          </h3>
          <p class="text-sm text-dark mb-3">
            ${escapeHtml(pdf.description || '')}
          </p>
          <div class="flex flex-wrap gap-2">
            ${pdf.category_name ? `
              <span class="badge badge-category text-xs shadow-sm">
                <i class="fas fa-folder mr-1"></i>${escapeHtml(pdf.category_name)}
              </span>
            ` : ''}
            ${pdf.tags ? pdf.tags.map(tag => `
              <span class="badge badge-tag text-xs">
                <i class="fas fa-tag mr-1"></i>${escapeHtml(tag.name)}
              </span>
            `).join('') : ''}
          </div>
        </div>
        <div class="flex gap-2 ml-4">
          <button onclick="editPdf(${pdf.id})" class="px-4 py-2.5 bg-gradient-to-r from-accent to-dark text-white rounded-lg hover:from-dark hover:to-accent transition-all duration-300 shadow-md font-medium">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deletePdf(${pdf.id})" class="px-4 py-2.5 bg-gradient-to-r from-secondary to-primary text-white rounded-lg hover:from-primary hover:to-secondary transition-all duration-300 shadow-md font-medium">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('')
}

// PDF operations
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
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-2xl"></i>
          </button>
        </div>
        
        <form onsubmit="savePdf(event)" class="px-6 py-4 space-y-4">
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
            <label class="block text-sm font-medium text-gray-700 mb-2">説明</label>
            <textarea 
              id="pdf-description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >${escapeHtml(pdf.description || '')}</textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Google Drive URL *</label>
            <input 
              type="url" 
              id="pdf-url"
              value="${escapeHtml(pdf.google_drive_url || '')}"
              placeholder="https://drive.google.com/file/d/..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p class="mt-1 text-xs text-gray-500">
              <i class="fas fa-info-circle mr-1"></i>Google Driveで「リンクを知っている全員」に共有設定してください
            </p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
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
              <label class="block text-sm font-medium text-gray-700 mb-2">ページ数</label>
              <input 
                type="number" 
                id="pdf-pages"
                value="${pdf.page_count || ''}"
                placeholder="例: 50"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ファイルサイズ</label>
            <input 
              type="text" 
              id="pdf-size"
              value="${escapeHtml(pdf.file_size || '')}"
              placeholder="例: 5.2 MB"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
  const description = document.getElementById('pdf-description').value
  const google_drive_url = document.getElementById('pdf-url').value
  const category_id = document.getElementById('pdf-category').value || null
  const page_count = document.getElementById('pdf-pages').value || null
  const file_size = document.getElementById('pdf-size').value || null
  
  const tagCheckboxes = document.querySelectorAll('input[name="pdf-tags"]:checked')
  const tag_ids = Array.from(tagCheckboxes).map(cb => parseInt(cb.value))
  
  const data = {
    title,
    description,
    google_drive_url,
    category_id,
    page_count: page_count ? parseInt(page_count) : null,
    file_size,
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
    alert('保存に失敗しました: ' + error.message)
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
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">
            <i class="fas fa-folder mr-2"></i>カテゴリ管理
          </h2>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-2xl"></i>
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
          
          <div class="space-y-2" id="categories-list">
            ${adminState.categories.map(cat => `
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span class="font-medium">${escapeHtml(cat.name)}</span>
                <button 
                  onclick="deleteCategory(${cat.id})"
                  class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
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

async function addCategory(event) {
  event.preventDefault()
  const name = document.getElementById('new-category-name').value
  
  try {
    await axios.post('/api/categories', { name, description: '' })
    await loadAdminData()
    showManageCategoriesModal()
  } catch (error) {
    alert('カテゴリの追加に失敗しました')
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

// Tag management
function showManageTagsModal() {
  const modalHtml = `
    <div class="fixed inset-0 modal-overlay flex items-center justify-center z-50" onclick="closeModal(event)">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <div class="px-6 py-4 border-b flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">
            <i class="fas fa-tags mr-2"></i>タグ管理
          </h2>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-2xl"></i>
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
  if (!confirm('このタグを削除してもよろしいですか？')) return
  
  try {
    await axios.delete(`/api/tags/${id}`)
    await loadAdminData()
    showManageTagsModal()
  } catch (error) {
    alert('タグの削除に失敗しました')
  }
}

// Modal utilities
function closeModal(event) {
  if (event && event.target !== event.currentTarget) return
  document.getElementById('modal-container').innerHTML = ''
}

function logout() {
  sessionStorage.removeItem('admin_authenticated')
  location.reload()
}

// Utility functions
function escapeHtml(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Initialize on page load
if (window.location.pathname === '/admin') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminApp)
  } else {
    initAdminApp()
  }
}
