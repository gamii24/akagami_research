// Articles Admin Page - Card-based Layout with Monaco Editor

let articlesState = {
  articles: [],
  categories: [],
  editingArticle: null,
  editor: null,
  quillEditor: null,
  editorMode: 'visual', // 'visual' or 'code'
  viewMode: 'grid' // 'grid' or 'list'
}

// Initialize
async function init() {
  await loadCategories()
  await loadArticles()
  initMonaco()
}

// Load categories
async function loadCategories() {
  try {
    const response = await axios.get('/api/categories')
    articlesState.categories = response.data
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// Load all articles (both published and unpublished)
async function loadArticles() {
  try {
    const response = await axios.get('/api/admin/articles', { withCredentials: true })
    articlesState.articles = response.data || []
    renderArticleList()
  } catch (error) {
    console.error('Failed to load articles:', error)
    
    // Check if it's an authentication error
    if (error.response && error.response.status === 401) {
      showToast('ログインが必要です。ログインページにリダイレクトします...', 'error')
      setTimeout(() => {
        window.location.href = '/admin'
      }, 2000)
      return
    }
    
    // Show error and render empty list
    articlesState.articles = []
    renderArticleList()
    showToast('記事の読み込みに失敗しました', 'error')
  }
}

// Initialize Monaco Editor
function initMonaco() {
  require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } })
  
  require(['vs/editor/editor.main'], function() {
    console.log('Monaco Editor loaded')
  })
}

// Render article list (card-based layout like PDFs)
function renderArticleList() {
  const app = document.getElementById('articles-admin-app')
  
  const html = `
    <div class="min-h-screen bg-gray-900">
      <!-- Header -->
      <div class="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-white">
                <i class="fas fa-newspaper text-primary mr-2"></i>
                記事管理
              </h1>
              <p class="text-sm text-gray-400 mt-1">インフォグラフィック記事の作成・編集</p>
            </div>
            <div class="flex gap-2">
              <a href="/admin" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">
                <i class="fas fa-arrow-left mr-2"></i>戻る
              </a>
              <button onclick="showArticleForm()" class="px-6 py-2 bg-primary hover:bg-red-600 text-white rounded-lg transition-colors font-semibold">
                <i class="fas fa-plus mr-2"></i>新規記事作成
              </button>
            </div>
          </div>
          
          <!-- View Mode Toggle -->
          <div class="flex items-center gap-4 mt-4">
            <div class="text-sm text-gray-400">
              記事数: <span class="text-white font-semibold">${articlesState.articles.length}</span>件
            </div>
            <div class="flex gap-2 ml-auto">
              <button 
                onclick="setViewMode('grid')" 
                class="px-3 py-1.5 rounded ${articlesState.viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors"
                aria-label="グリッド表示"
              >
                <i class="fas fa-th"></i>
              </button>
              <button 
                onclick="setViewMode('list')" 
                class="px-3 py-1.5 rounded ${articlesState.viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors"
                aria-label="リスト表示"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Article Cards -->
      <div class="max-w-7xl mx-auto px-4 py-6">
        ${articlesState.articles.length === 0 ? `
          <div class="text-center py-20">
            <i class="fas fa-inbox text-6xl text-gray-600 mb-4"></i>
            <p class="text-gray-400 text-lg">記事がまだありません</p>
            <button onclick="showArticleForm()" class="mt-4 px-6 py-2 bg-primary hover:bg-red-600 text-white rounded-lg transition-colors">
              <i class="fas fa-plus mr-2"></i>最初の記事を作成
            </button>
          </div>
        ` : `
          <div class="${articlesState.viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}">
            ${articlesState.articles.map(article => renderArticleCard(article)).join('')}
          </div>
        `}
      </div>
    </div>

    <!-- Article Form Modal -->
    <div id="article-modal" class="fixed inset-0 bg-black bg-opacity-75 z-50 hidden flex items-start justify-center overflow-y-auto py-8">
      <div class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl mx-4 border border-gray-700">
        <!-- Modal will be populated by showArticleForm() -->
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="delete-modal" class="fixed inset-0 bg-black bg-opacity-75 z-50 hidden flex items-center justify-center">
      <div class="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-700 p-6">
        <!-- Modal will be populated by confirmDelete() -->
      </div>
    </div>

    <!-- Toast Notification -->
    <div id="toast" class="fixed bottom-4 right-4 transform transition-all duration-300 translate-y-20 opacity-0 z-50">
      <div class="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl border border-gray-700">
        <span id="toast-message"></span>
      </div>
    </div>
  `
  
  app.innerHTML = html
}

// Render individual article card (similar to PDF card design)
function renderArticleCard(article) {
  const categoryName = article.category_name || '未分類'
  const categoryColor = article.category_name ? 'bg-blue-600' : 'bg-gray-600'
  const publishedBadge = article.published ? 
    '<span class="px-2 py-1 bg-green-600 text-white text-xs rounded font-medium">公開中</span>' :
    '<span class="px-2 py-1 bg-gray-600 text-white text-xs rounded font-medium">下書き</span>'
  
  const createdDate = new Date(article.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
  
  // Check if article is new (within 7 days)
  const isNew = isWithin7Days(article.created_at)
  
  if (articlesState.viewMode === 'grid') {
    return `
      <div class="bg-gray-800 rounded-xl border-2 border-gray-700 hover:border-primary transition-all overflow-hidden group">
        <!-- Card Header with gradient -->
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="${categoryColor} text-white text-xs px-2 py-1 rounded font-medium">
                  ${escapeHtml(categoryName)}
                </span>
                ${publishedBadge}
                ${isNew ? '<span class="px-2 py-1 bg-yellow-500 text-gray-900 text-xs rounded font-bold">NEW</span>' : ''}
              </div>
              <h3 class="text-white font-bold text-lg line-clamp-2 group-hover:text-yellow-300 transition-colors">
                ${escapeHtml(article.title)}
              </h3>
            </div>
            <i class="fas fa-newspaper text-white text-2xl opacity-50"></i>
          </div>
        </div>
        
        <!-- Card Body -->
        <div class="p-4">
          ${article.summary ? `
            <p class="text-gray-300 text-sm line-clamp-3 mb-3">
              ${escapeHtml(article.summary)}
            </p>
          ` : ''}
          
          <div class="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <i class="fas fa-calendar"></i>
            <span>${createdDate}</span>
            <span class="mx-2">•</span>
            <code class="text-cyan-400">${escapeHtml(article.slug)}</code>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2">
            <a href="/article/${encodeURIComponent(article.slug)}" target="_blank" class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm text-center transition-colors">
              <i class="fas fa-eye mr-1"></i>プレビュー
            </a>
            <button onclick="editArticle(${article.id})" class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
              <i class="fas fa-edit mr-1"></i>編集
            </button>
            <button onclick="confirmDelete(${article.id}, '${escapeHtml(article.title).replace(/'/g, "\\'")}' )" class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `
  } else {
    // List view
    return `
      <div class="bg-gray-800 rounded-lg border-2 border-gray-700 hover:border-primary transition-all p-4 group">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <i class="fas fa-newspaper text-white text-2xl"></i>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="${categoryColor} text-white text-xs px-2 py-1 rounded font-medium">
                    ${escapeHtml(categoryName)}
                  </span>
                  ${publishedBadge}
                  ${isNew ? '<span class="px-2 py-1 bg-yellow-500 text-gray-900 text-xs rounded font-bold">NEW</span>' : ''}
                </div>
                <h3 class="text-white font-bold text-lg group-hover:text-yellow-300 transition-colors">
                  ${escapeHtml(article.title)}
                </h3>
                ${article.summary ? `
                  <p class="text-gray-300 text-sm mt-1 line-clamp-2">
                    ${escapeHtml(article.summary)}
                  </p>
                ` : ''}
              </div>
            </div>
            
            <div class="flex items-center gap-4 text-xs text-gray-400 mb-3">
              <span><i class="fas fa-calendar mr-1"></i>${createdDate}</span>
              <code class="text-cyan-400">${escapeHtml(article.slug)}</code>
            </div>
            
            <div class="flex gap-2">
              <a href="/article/${encodeURIComponent(article.slug)}" target="_blank" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                <i class="fas fa-eye mr-1"></i>プレビュー
              </a>
              <button onclick="editArticle(${article.id})" class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                <i class="fas fa-edit mr-1"></i>編集
              </button>
              <button onclick="confirmDelete(${article.id}, '${escapeHtml(article.title).replace(/'/g, "\\'")}' )" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                <i class="fas fa-trash mr-1"></i>削除
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

// Check if date is within 7 days
function isWithin7Days(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now - date
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return diffDays <= 7
}

// Set view mode
function setViewMode(mode) {
  articlesState.viewMode = mode
  renderArticleList()
}

// Show article form (create or edit)
function showArticleForm(articleId = null) {
  const article = articleId ? articlesState.articles.find(a => a.id === articleId) : null
  articlesState.editingArticle = article
  
  const modal = document.getElementById('article-modal')
  const isEdit = article !== null
  
  const modalContent = `
    <div class="p-6 border-b border-gray-700">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">
          <i class="fas fa-${isEdit ? 'edit' : 'plus-circle'} text-primary mr-2"></i>
          ${isEdit ? '記事を編集' : '新規記事作成'}
        </h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-white transition-colors">
          <i class="fas fa-times text-2xl"></i>
        </button>
      </div>
    </div>
    
    <form id="article-form" onsubmit="saveArticle(event)" class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Left Column -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              <i class="fas fa-heading text-primary mr-2"></i>タイトル <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="title" 
              value="${article ? escapeHtml(article.title) : ''}"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              required
              placeholder="記事のタイトルを入力"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              <i class="fas fa-link text-primary mr-2"></i>Slug（URL用） <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="slug" 
              value="${article ? escapeHtml(article.slug) : ''}"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary font-mono text-sm"
              required
              pattern="[a-z0-9-]+"
              placeholder="例: threads-case-study-2026"
            />
            <p class="text-xs text-gray-400 mt-1">半角英数字とハイフンのみ使用可</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              <i class="fas fa-folder text-primary mr-2"></i>カテゴリ
            </label>
            <select 
              name="category_id" 
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              <option value="">カテゴリなし</option>
              ${articlesState.categories.map(cat => `
                <option value="${cat.id}" ${article && article.category_id === cat.id ? 'selected' : ''}>
                  ${escapeHtml(cat.name)}
                </option>
              `).join('')}
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              <i class="fas fa-align-left text-primary mr-2"></i>要約（サマリー）
            </label>
            <textarea 
              name="summary" 
              rows="3"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="記事の簡単な説明（任意）"
            >${article && article.summary ? escapeHtml(article.summary) : ''}</textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              <i class="fas fa-image text-primary mr-2"></i>サムネイル画像URL（任意）
            </label>
            <input 
              type="url" 
              name="thumbnail_url" 
              value="${article && article.thumbnail_url ? escapeHtml(article.thumbnail_url) : ''}"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="published" 
                ${article && article.published ? 'checked' : ''}
                class="w-5 h-5 rounded bg-gray-700 border-gray-600 text-primary focus:ring-primary focus:ring-2"
              />
              <span class="text-sm text-gray-300">
                <i class="fas fa-globe text-green-500 mr-1"></i>公開する
              </span>
            </label>
            
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-300">
                <i class="fas fa-sort-numeric-down text-primary mr-1"></i>表示順:
              </label>
              <input 
                type="number" 
                name="sort_order" 
                value="${article && article.sort_order !== null ? article.sort_order : 0}"
                class="w-20 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-primary text-center"
                min="0"
              />
            </div>
          </div>
        </div>
        
        <!-- Right Column - Content Editor -->
        <div class="lg:col-span-1">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-300">
              <i class="fas fa-edit text-primary mr-2"></i>記事コンテンツ <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <button 
                type="button"
                onclick="switchEditorMode('visual')"
                class="px-3 py-1 text-xs rounded transition-colors ${articlesState.editorMode === 'visual' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
                id="visual-mode-btn"
              >
                <i class="fas fa-eye mr-1"></i>ビジュアル
              </button>
              <button 
                type="button"
                onclick="switchEditorMode('code')"
                class="px-3 py-1 text-xs rounded transition-colors ${articlesState.editorMode === 'code' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
                id="code-mode-btn"
              >
                <i class="fas fa-code mr-1"></i>コード
              </button>
            </div>
          </div>
          
          <!-- Quill Editor (Visual Mode) -->
          <div id="visual-editor-container" class="border-2 border-gray-600 rounded-lg overflow-hidden" style="height: 500px; ${articlesState.editorMode === 'visual' ? '' : 'display: none;'}">
            <div id="quill-editor" style="height: 100%; background: white;"></div>
          </div>
          
          <!-- Monaco Editor (Code Mode) -->
          <div id="code-editor-container" class="border-2 border-gray-600 rounded-lg overflow-hidden" style="height: 500px; ${articlesState.editorMode === 'code' ? '' : 'display: none;'}">
            <div id="monaco-editor" style="width: 100%; height: 100%;"></div>
          </div>
          
          <p class="text-xs text-gray-400 mt-2">
            <i class="fas fa-info-circle mr-1"></i>
            ビジュアルモード: リッチテキストエディタで直感的に編集 | コードモード: HTMLコードを直接編集
          </p>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 pt-6 border-t border-gray-700">
        <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          <i class="fas fa-times mr-2"></i>キャンセル
        </button>
        <button type="submit" class="px-6 py-2 bg-primary hover:bg-red-600 text-white rounded-lg transition-colors font-semibold">
          <i class="fas fa-save mr-2"></i>${isEdit ? '更新' : '作成'}
        </button>
      </div>
    </form>
  `
  
  modal.querySelector('.bg-gray-800').innerHTML = modalContent
  modal.classList.remove('hidden')
  
  // Initialize editors with longer delay to ensure DOM is ready
  setTimeout(() => {
    initArticleEditor(article ? article.content : '')
  }, 300)
}

// Switch between visual and code editor modes
function switchEditorMode(mode) {
  if (articlesState.editorMode === mode) return
  
  // Save current content before switching
  let currentContent = ''
  if (articlesState.editorMode === 'visual' && articlesState.quillEditor) {
    currentContent = articlesState.quillEditor.root.innerHTML
  } else if (articlesState.editorMode === 'code' && articlesState.editor) {
    currentContent = articlesState.editor.getValue()
  }
  
  // Switch mode
  articlesState.editorMode = mode
  
  // Update visibility and button styles
  const visualContainer = document.getElementById('visual-editor-container')
  const codeContainer = document.getElementById('code-editor-container')
  const visualBtn = document.getElementById('visual-mode-btn')
  const codeBtn = document.getElementById('code-mode-btn')
  
  if (mode === 'visual') {
    // Show visual editor, hide code editor
    if (visualContainer) visualContainer.style.display = ''
    if (codeContainer) codeContainer.style.display = 'none'
    
    // Update button styles
    if (visualBtn) {
      visualBtn.className = 'px-3 py-1 text-xs rounded transition-colors bg-primary text-white'
    }
    if (codeBtn) {
      codeBtn.className = 'px-3 py-1 text-xs rounded transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600'
    }
    
    // Update Quill content
    if (articlesState.quillEditor) {
      articlesState.quillEditor.root.innerHTML = currentContent
    }
  } else {
    // Show code editor, hide visual editor
    if (visualContainer) visualContainer.style.display = 'none'
    if (codeContainer) codeContainer.style.display = ''
    
    // Update button styles
    if (visualBtn) {
      visualBtn.className = 'px-3 py-1 text-xs rounded transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600'
    }
    if (codeBtn) {
      codeBtn.className = 'px-3 py-1 text-xs rounded transition-colors bg-primary text-white'
    }
    
    // Update Monaco content
    if (articlesState.editor) {
      articlesState.editor.setValue(currentContent)
    }
  }
}

// Initialize Monaco Editor for article content
function initArticleEditor(content) {
  // Check if Quill is loaded
  if (typeof Quill === 'undefined') {
    console.error('Quill is not loaded!')
    setTimeout(() => initArticleEditor(content), 500)
    return
  }
  
  // Initialize Quill Editor (Visual Mode)
  const quillContainer = document.getElementById('quill-editor')
  if (quillContainer) {
    console.log('Initializing Quill editor...', { content })
    
    try {
      articlesState.quillEditor = new Quill('#quill-editor', {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
          ]
        },
        placeholder: '記事の内容を入力してください...'
      })
      
      // Ensure editor is enabled
      articlesState.quillEditor.enable(true)
      console.log('Quill editor initialized successfully:', {
        isEnabled: !articlesState.quillEditor.isEnabled || articlesState.quillEditor.isEnabled(),
        editor: articlesState.quillEditor
      })
      
      // Set initial content
      if (content) {
        articlesState.quillEditor.root.innerHTML = content
      }
      
      // Focus the editor
      setTimeout(() => {
        if (articlesState.quillEditor) {
          articlesState.quillEditor.focus()
        }
      }, 100)
    } catch (error) {
      console.error('Failed to initialize Quill:', error)
    }
  } else {
    console.error('Quill editor container not found!')
  }
  
  // Initialize Monaco Editor (Code Mode)
  require(['vs/editor/editor.main'], function() {
    const container = document.getElementById('monaco-editor')
    if (!container) return
    
    articlesState.editor = monaco.editor.create(container, {
      value: content || '',
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true
    })
  })
}

// Edit article
function editArticle(articleId) {
  showArticleForm(articleId)
}

// Get content from current active editor
function getEditorContent() {
  if (articlesState.editorMode === 'visual' && articlesState.quillEditor) {
    return articlesState.quillEditor.root.innerHTML
  } else if (articlesState.editorMode === 'code' && articlesState.editor) {
    return articlesState.editor.getValue()
  }
  return ''
}

// Save article (create or update)
async function saveArticle(event) {
  event.preventDefault()
  
  const form = event.target
  const formData = new FormData(form)
  
  const articleData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    category_id: formData.get('category_id') ? parseInt(formData.get('category_id')) : null,
    thumbnail_url: formData.get('thumbnail_url') || null,
    content: getEditorContent(),
    summary: formData.get('summary') || null,
    published: formData.has('published'),
    sort_order: parseInt(formData.get('sort_order')) || 0
  }
  
  // Validation
  if (!articleData.title || !articleData.slug || !articleData.content) {
    showToast('必須項目を入力してください', 'error')
    return
  }
  
  try {
    const isEdit = articlesState.editingArticle !== null
    const url = isEdit ? `/api/admin/articles/${articlesState.editingArticle.id}` : '/api/admin/articles'
    const method = isEdit ? 'put' : 'post'
    
    const response = await axios[method](url, articleData, { withCredentials: true })
    
    showToast(isEdit ? '記事を更新しました' : '記事を作成しました', 'success')
    
    // Open article page in new tab
    const articleUrl = `/article/${encodeURIComponent(articleData.slug)}`
    window.open(articleUrl, '_blank')
    
    closeModal()
    await loadArticles()
  } catch (error) {
    console.error('Failed to save article:', error)
    showToast(error.response?.data?.error || '保存に失敗しました', 'error')
  }
}

// Confirm delete
function confirmDelete(articleId, articleTitle) {
  const modal = document.getElementById('delete-modal')
  
  modal.querySelector('.bg-gray-800').innerHTML = `
    <div class="text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-exclamation-triangle text-red-600 text-3xl"></i>
      </div>
      <h3 class="text-xl font-bold text-white mb-2">記事を削除しますか？</h3>
      <p class="text-gray-300 mb-6">
        「${articleTitle}」を削除します。<br/>
        この操作は取り消せません。
      </p>
      <div class="flex gap-3">
        <button onclick="closeDeleteModal()" class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          キャンセル
        </button>
        <button onclick="deleteArticle(${articleId})" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold">
          削除する
        </button>
      </div>
    </div>
  `
  
  modal.classList.remove('hidden')
}

// Delete article
async function deleteArticle(articleId) {
  try {
    await axios.delete(`/api/admin/articles/${articleId}`, { withCredentials: true })
    showToast('記事を削除しました', 'success')
    closeDeleteModal()
    await loadArticles()
  } catch (error) {
    console.error('Failed to delete article:', error)
    showToast('削除に失敗しました', 'error')
  }
}

// Close modal
function closeModal() {
  document.getElementById('article-modal').classList.add('hidden')
  if (articlesState.editor) {
    articlesState.editor.dispose()
    articlesState.editor = null
  }
  articlesState.editingArticle = null
}

// Close delete modal
function closeDeleteModal() {
  document.getElementById('delete-modal').classList.add('hidden')
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast')
  const toastMessage = document.getElementById('toast-message')
  
  // Check if elements exist
  if (!toast || !toastMessage) {
    console.warn('Toast elements not found, message:', message)
    return
  }
  
  toastMessage.textContent = message
  
  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  }
  
  const toastContent = toast.querySelector('.bg-gray-800')
  if (toastContent) {
    toastContent.className = `${bgColors[type] || bgColors.info} text-white px-6 py-3 rounded-lg shadow-xl`
  }
  
  toast.classList.remove('translate-y-20', 'opacity-0')
  toast.classList.add('translate-y-0', 'opacity-100')
  
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0')
    toast.classList.remove('translate-y-0', 'opacity-100')
  }, 3000)
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
