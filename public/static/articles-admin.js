// Articles Admin Page - Infographic Article Management

let articlesState = {
  articles: [],
  categories: [],
  editingArticle: null,
  editor: null
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

// Load all articles
async function loadArticles() {
  try {
    const response = await axios.get('/api/admin/articles', { withCredentials: true })
    articlesState.articles = response.data
    renderArticleList()
  } catch (error) {
    console.error('Failed to load articles:', error)
    showToast('記事の読み込みに失敗しました', 'error')
  }
}

// Render article list
function renderArticleList() {
  const app = document.getElementById('articles-admin-app')
  
  const html = `
    <div class="min-h-screen">
      {/* Header */}
      <div class="bg-darker border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">
                <i class="fas fa-newspaper text-primary mr-3"></i>
                インフォグラフィック記事管理
              </h1>
              <p class="text-gray-400">記事の作成・編集・削除</p>
            </div>
            <div class="flex gap-3">
              <a href="/admin" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                <i class="fas fa-arrow-left mr-2"></i>管理画面へ戻る
              </a>
              <button onclick="showArticleForm()" class="px-6 py-2 bg-primary hover:bg-red-600 text-white rounded-lg transition-colors font-semibold">
                <i class="fas fa-plus mr-2"></i>新規記事作成
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article List */}
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="bg-darker rounded-xl border border-gray-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">タイトル</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">カテゴリ</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Slug</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-300">公開</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-300">表示順</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-300">作成日</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold text-gray-300">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                ${articlesState.articles.length === 0 ? `
                  <tr>
                    <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                      <i class="fas fa-inbox text-4xl mb-4 block"></i>
                      記事がまだありません
                    </td>
                  </tr>
                ` : articlesState.articles.map(article => `
                  <tr class="hover:bg-gray-800 transition-colors">
                    <td class="px-6 py-4">
                      <div class="text-white font-medium">${escapeHtml(article.title)}</div>
                      ${article.summary ? `<div class="text-sm text-gray-400 mt-1 line-clamp-1">${escapeHtml(article.summary)}</div>` : ''}
                    </td>
                    <td class="px-6 py-4">
                      ${article.category_name ? `
                        <span class="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">
                          ${escapeHtml(article.category_name)}
                        </span>
                      ` : `<span class="text-gray-500 text-sm">未分類</span>`}
                    </td>
                    <td class="px-6 py-4">
                      <code class="text-sm text-cyan-400">${escapeHtml(article.slug)}</code>
                    </td>
                    <td class="px-6 py-4 text-center">
                      ${article.published ? 
                        '<span class="inline-flex items-center px-2 py-1 bg-green-900 text-green-200 rounded text-xs"><i class="fas fa-check mr-1"></i>公開中</span>' : 
                        '<span class="inline-flex items-center px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"><i class="fas fa-eye-slash mr-1"></i>非公開</span>'
                      }
                    </td>
                    <td class="px-6 py-4 text-center text-gray-300">
                      ${article.sort_order}
                    </td>
                    <td class="px-6 py-4 text-center text-gray-400 text-sm">
                      ${new Date(article.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <a href="/article/${article.slug}" target="_blank" class="px-3 py-1 bg-blue-900 hover:bg-blue-800 text-blue-200 rounded transition-colors text-sm">
                          <i class="fas fa-eye"></i>
                        </a>
                        <button onclick="editArticle(${article.id})" class="px-3 py-1 bg-yellow-900 hover:bg-yellow-800 text-yellow-200 rounded transition-colors text-sm">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteArticle(${article.id}, '${escapeHtml(article.title).replace(/'/g, "\\'")}')" class="px-3 py-1 bg-red-900 hover:bg-red-800 text-red-200 rounded transition-colors text-sm">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    {/* Article Form Modal */}
    <div id="article-form-modal" class="fixed inset-0 bg-black bg-opacity-75 z-50 hidden items-center justify-center p-4 overflow-y-auto">
      <div class="bg-darker rounded-xl border border-gray-700 w-full max-w-6xl my-8">
        <div class="border-b border-gray-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 id="form-title" class="text-2xl font-bold text-white"></h2>
            <button onclick="hideArticleForm()" class="text-gray-400 hover:text-white transition-colors">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          {/* Basic Info */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">タイトル *</label>
              <input type="text" id="article-title" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary" placeholder="記事のタイトル">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Slug (URL用) *</label>
              <input type="text" id="article-slug" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm" placeholder="threads-case-study-2026">
              <p class="text-xs text-gray-500 mt-1">英数字・ハイフン・アンダースコアのみ</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">カテゴリ</label>
              <select id="article-category" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">未分類</option>
                ${articlesState.categories.map(cat => `
                  <option value="${cat.id}">${escapeHtml(cat.name)}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">表示順</label>
              <input type="number" id="article-sort-order" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary" value="0">
            </div>
            <div class="flex items-end">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="article-published" class="w-5 h-5 text-primary bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-primary">
                <span class="text-sm font-semibold text-gray-300">公開する</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">サムネイルURL</label>
            <input type="text" id="article-thumbnail" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm" placeholder="https://example.com/thumbnail.jpg">
            <p class="text-xs text-gray-500 mt-1">カード表示用の画像URL</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">要約（カード表示用）</label>
            <textarea id="article-summary" rows="3" class="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="カードに表示される記事の要約"></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">記事本文（HTML） *</label>
            <div id="monaco-editor-container" class="border border-gray-600 rounded-lg overflow-hidden" style="height: 500px;"></div>
            <p class="text-xs text-gray-500 mt-1">サンプルのようなHTMLコードを貼り付けてください</p>
          </div>
        </div>

        <div class="border-t border-gray-700 px-6 py-4 flex justify-end gap-3">
          <button onclick="hideArticleForm()" class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            キャンセル
          </button>
          <button onclick="previewArticle()" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <i class="fas fa-eye mr-2"></i>プレビュー
          </button>
          <button onclick="saveArticle()" class="px-6 py-2 bg-primary hover:bg-red-600 text-white rounded-lg transition-colors font-semibold">
            <i class="fas fa-save mr-2"></i>保存
          </button>
        </div>
      </div>
    </div>
  `
  
  app.innerHTML = html
}

// Show article form
function showArticleForm(article = null) {
  articlesState.editingArticle = article
  
  const modal = document.getElementById('article-form-modal')
  const title = document.getElementById('form-title')
  
  if (article) {
    title.textContent = '記事を編集'
    document.getElementById('article-title').value = article.title
    document.getElementById('article-slug').value = article.slug
    document.getElementById('article-category').value = article.category_id || ''
    document.getElementById('article-thumbnail').value = article.thumbnail_url || ''
    document.getElementById('article-summary').value = article.summary || ''
    document.getElementById('article-sort-order').value = article.sort_order || 0
    document.getElementById('article-published').checked = article.published
  } else {
    title.textContent = '新規記事作成'
    document.getElementById('article-title').value = ''
    document.getElementById('article-slug').value = ''
    document.getElementById('article-category').value = ''
    document.getElementById('article-thumbnail').value = ''
    document.getElementById('article-summary').value = ''
    document.getElementById('article-sort-order').value = 0
    document.getElementById('article-published').checked = false
  }
  
  modal.classList.remove('hidden')
  modal.classList.add('flex')
  
  // Initialize Monaco Editor
  initMonacoEditor(article ? article.content : '')
}

// Hide article form
function hideArticleForm() {
  const modal = document.getElementById('article-form-modal')
  modal.classList.add('hidden')
  modal.classList.remove('flex')
  articlesState.editingArticle = null
  
  // Dispose editor
  if (articlesState.editor) {
    articlesState.editor.dispose()
    articlesState.editor = null
  }
}

// Initialize Monaco Editor
function initMonacoEditor(content) {
  require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } })
  
  require(['vs/editor/editor.main'], function() {
    const container = document.getElementById('monaco-editor-container')
    
    articlesState.editor = monaco.editor.create(container, {
      value: content,
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      wordWrap: 'on',
      lineNumbers: 'on',
      scrollBeyondLastLine: false
    })
  })
}

// Save article
async function saveArticle() {
  const title = document.getElementById('article-title').value.trim()
  const slug = document.getElementById('article-slug').value.trim()
  const categoryId = document.getElementById('article-category').value
  const thumbnailUrl = document.getElementById('article-thumbnail').value.trim()
  const summary = document.getElementById('article-summary').value.trim()
  const sortOrder = parseInt(document.getElementById('article-sort-order').value) || 0
  const published = document.getElementById('article-published').checked
  const content = articlesState.editor ? articlesState.editor.getValue() : ''
  
  if (!title || !slug || !content) {
    showToast('タイトル、Slug、本文は必須です', 'error')
    return
  }
  
  // Validate slug format
  if (!/^[a-z0-9-_]+$/.test(slug)) {
    showToast('Slugは英小文字・数字・ハイフン・アンダースコアのみ使用できます', 'error')
    return
  }
  
  const data = {
    title,
    slug,
    category_id: categoryId || null,
    thumbnail_url: thumbnailUrl,
    summary,
    content,
    published,
    sort_order: sortOrder
  }
  
  try {
    if (articlesState.editingArticle) {
      // Update
      await axios.put(`/api/admin/articles/${articlesState.editingArticle.id}`, data, { withCredentials: true })
      showToast('記事を更新しました', 'success')
    } else {
      // Create
      await axios.post('/api/admin/articles', data, { withCredentials: true })
      showToast('記事を作成しました', 'success')
    }
    
    hideArticleForm()
    loadArticles()
  } catch (error) {
    console.error('Failed to save article:', error)
    const message = error.response?.data?.error || '記事の保存に失敗しました'
    showToast(message, 'error')
  }
}

// Edit article
async function editArticle(id) {
  try {
    const response = await axios.get(`/api/admin/articles/${id}`, { withCredentials: true })
    showArticleForm(response.data)
  } catch (error) {
    console.error('Failed to load article:', error)
    showToast('記事の読み込みに失敗しました', 'error')
  }
}

// Delete article
async function deleteArticle(id, title) {
  if (!confirm(`「${title}」を削除しますか？この操作は取り消せません。`)) {
    return
  }
  
  try {
    await axios.delete(`/api/admin/articles/${id}`, { withCredentials: true })
    showToast('記事を削除しました', 'success')
    loadArticles()
  } catch (error) {
    console.error('Failed to delete article:', error)
    showToast('記事の削除に失敗しました', 'error')
  }
}

// Preview article
function previewArticle() {
  const content = articlesState.editor ? articlesState.editor.getValue() : ''
  
  if (!content) {
    showToast('プレビューする本文がありません', 'error')
    return
  }
  
  // Open preview in new window
  const previewWindow = window.open('', '_blank', 'width=1200,height=800')
  previewWindow.document.write(content)
  previewWindow.document.close()
}

// Initialize
async function init() {
  // Check authentication
  try {
    const response = await axios.get('/api/auth/check', { withCredentials: true })
    if (!response.data.authenticated) {
      window.location.href = '/admin'
      return
    }
  } catch (error) {
    window.location.href = '/admin'
    return
  }
  
  await loadCategories()
  await loadArticles()
}

// Run on page load
document.addEventListener('DOMContentLoaded', init)
