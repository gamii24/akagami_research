import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(renderer)

// Enable CORS for API routes
app.use('/api/*', cors())

// ============================================
// API Routes - Categories
// ============================================

// Get all categories
app.get('/api/categories', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM categories ORDER BY sort_order ASC, name ASC'
  ).all()
  return c.json(results)
})

// Create category
app.post('/api/categories', async (c) => {
  const { name, description } = await c.req.json()
  
  // Get the maximum sort_order and add 10
  const { results } = await c.env.DB.prepare(
    'SELECT MAX(sort_order) as max_order FROM categories'
  ).all()
  const maxOrder = results[0]?.max_order || 0
  const newOrder = maxOrder + 10
  
  const result = await c.env.DB.prepare(
    'INSERT INTO categories (name, description, sort_order) VALUES (?, ?, ?)'
  ).bind(name, description, newOrder).run()
  
  return c.json({ 
    id: result.meta.last_row_id, 
    name, 
    description,
    sort_order: newOrder
  })
})

// Update category
app.put('/api/categories/:id', async (c) => {
  const id = c.req.param('id')
  const { name, description, download_url, sort_order } = await c.req.json()
  
  await c.env.DB.prepare(
    'UPDATE categories SET name = ?, description = ?, download_url = ?, sort_order = ? WHERE id = ?'
  ).bind(name || '', description || '', download_url || null, sort_order !== undefined ? sort_order : null, id).run()
  
  return c.json({ success: true })
})

// Update category sort orders (for reordering)
app.post('/api/categories/reorder', async (c) => {
  const { categoryOrders } = await c.req.json() // [{id: 1, sort_order: 10}, {id: 2, sort_order: 20}, ...]
  
  // Update each category's sort_order
  for (const item of categoryOrders) {
    await c.env.DB.prepare(
      'UPDATE categories SET sort_order = ? WHERE id = ?'
    ).bind(item.sort_order, item.id).run()
  }
  
  return c.json({ success: true })
})

// Delete category
app.delete('/api/categories/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare(
    'DELETE FROM categories WHERE id = ?'
  ).bind(id).run()
  
  return c.json({ success: true })
})

// Get all PDF URLs for a category (for bulk download)
app.get('/api/categories/:id/download-urls', async (c) => {
  const id = c.req.param('id')
  
  const { results } = await c.env.DB.prepare(`
    SELECT google_drive_url, title
    FROM pdfs
    WHERE category_id = ?
    ORDER BY created_at DESC
  `).bind(id).all()
  
  return c.json(results)
})

// ============================================
// API Routes - Tags
// ============================================

// Get all tags
app.get('/api/tags', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM tags ORDER BY name'
  ).all()
  return c.json(results)
})

// Create tag
app.post('/api/tags', async (c) => {
  const { name } = await c.req.json()
  const result = await c.env.DB.prepare(
    'INSERT INTO tags (name) VALUES (?)'
  ).bind(name).run()
  
  return c.json({ 
    id: result.meta.last_row_id, 
    name 
  })
})

// Delete tag
app.delete('/api/tags/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare(
    'DELETE FROM tags WHERE id = ?'
  ).bind(id).run()
  
  return c.json({ success: true })
})

// ============================================
// API Routes - PDFs
// ============================================

// Get all PDFs with filters (Optimized - Single Query with GROUP_CONCAT)
app.get('/api/pdfs', async (c) => {
  const category = c.req.query('category')
  const tag = c.req.query('tag')
  const search = c.req.query('search')
  
  // Optimized query: Get PDFs with tags in a single query using GROUP_CONCAT
  // Only select necessary fields to reduce response size
  let query = `
    SELECT 
      p.id, 
      p.title, 
      p.google_drive_url,
      p.category_id,
      p.download_count,
      p.created_at,
      c.name as category_name,
      GROUP_CONCAT(t.id || ':' || t.name, '||') as tags_concat
    FROM pdfs p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN pdf_tags pt ON p.id = pt.pdf_id
    LEFT JOIN tags t ON pt.tag_id = t.id
  `
  
  const conditions = []
  const bindings = []
  
  if (category) {
    conditions.push('p.category_id = ?')
    bindings.push(category)
  }
  
  if (tag) {
    conditions.push('pt.tag_id = ?')
    bindings.push(tag)
  }
  
  if (search) {
    conditions.push('(p.title LIKE ? OR p.description LIKE ?)')
    bindings.push(`%${search}%`, `%${search}%`)
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }
  
  query += ' GROUP BY p.id ORDER BY p.created_at DESC'
  
  const { results } = await c.env.DB.prepare(query).bind(...bindings).all()
  
  // Parse tags from concatenated string
  for (const pdf of results as any[]) {
    if (pdf.tags_concat) {
      pdf.tags = pdf.tags_concat.split('||').map((tagStr: string) => {
        const [id, name] = tagStr.split(':')
        return { id: parseInt(id), name }
      })
    } else {
      pdf.tags = []
    }
    delete pdf.tags_concat // Remove temporary field
  }
  
  return c.json(results)
})

// Get single PDF
app.get('/api/pdfs/:id', async (c) => {
  const id = c.req.param('id')
  
  const pdf = await c.env.DB.prepare(`
    SELECT 
      p.*, 
      c.name as category_name
    FROM pdfs p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).bind(id).first()
  
  if (!pdf) {
    return c.json({ error: 'PDF not found' }, 404)
  }
  
  // Get tags
  const { results: tags } = await c.env.DB.prepare(`
    SELECT t.id, t.name
    FROM tags t
    INNER JOIN pdf_tags pt ON t.id = pt.tag_id
    WHERE pt.pdf_id = ?
  `).bind(id).all()
  
  return c.json({ ...pdf, tags })
})

// Auto-generate tags from title
function extractKeywordsFromTitle(title: string): string[] {
  // Common keywords to extract
  const keywords = [
    // SNS関連
    'YouTube', 'Instagram', 'TikTok', 'X', 'Twitter', 'Threads', 'LINE', 'Podcast',
    // マーケティング関連
    'マーケティング', 'SNS', 'ライブコマース', '広告', 'プロモーション', 'ブランディング',
    'インフルエンサー', 'アフィリエイト', 'SEO', 'コンテンツ',
    // ビジネス関連
    '個人事業主', 'フリーランス', '起業', 'スタートアップ', 'EC', '通販', 'オンライン',
    // AI関連
    'AI', '生成AI', 'ChatGPT', 'GPT', '画像生成', '動画生成', '自動化',
    // その他
    '初心者', '入門', '活用', '運用', '戦略', '分析', 'ツール', 'ガイド', '事例'
  ]
  
  const foundKeywords: string[] = []
  const lowerTitle = title.toLowerCase()
  
  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase()
    if (lowerTitle.includes(lowerKeyword)) {
      foundKeywords.push(keyword)
    }
  }
  
  return foundKeywords
}

// Helper function to create or get tag
async function createOrGetTag(db: D1Database, tagName: string): Promise<number> {
  // Check if tag exists
  const existing = await db.prepare('SELECT id FROM tags WHERE name = ?').bind(tagName).first()
  
  if (existing) {
    return existing.id as number
  }
  
  // Create new tag
  const result = await db.prepare('INSERT INTO tags (name) VALUES (?)').bind(tagName).run()
  return result.meta.last_row_id as number
}

// Create PDF
app.post('/api/pdfs', async (c) => {
  const { 
    title, 
    google_drive_url, 
    category_id, 
    tag_ids 
  } = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO pdfs (
      title, 
      google_drive_url, 
      category_id
    ) VALUES (?, ?, ?)
  `).bind(
    title, 
    google_drive_url, 
    category_id
  ).run()
  
  const pdf_id = result.meta.last_row_id
  
  // Auto-generate tags from title
  const autoKeywords = extractKeywordsFromTitle(title)
  const autoTagIds: number[] = []
  
  for (const keyword of autoKeywords) {
    const tagId = await createOrGetTag(c.env.DB, keyword)
    autoTagIds.push(tagId)
  }
  
  // Combine manual tags and auto tags
  const allTagIds = new Set([...(tag_ids || []), ...autoTagIds])
  
  // Add tags
  if (allTagIds.size > 0) {
    for (const tag_id of allTagIds) {
      await c.env.DB.prepare(
        'INSERT OR IGNORE INTO pdf_tags (pdf_id, tag_id) VALUES (?, ?)'
      ).bind(pdf_id, tag_id).run()
    }
  }
  
  return c.json({ 
    id: pdf_id, 
    title, 
    google_drive_url,
    auto_tags: autoKeywords
  })
})

// Update PDF
app.put('/api/pdfs/:id', async (c) => {
  const id = c.req.param('id')
  const { 
    title, 
    google_drive_url, 
    category_id,
    tag_ids 
  } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE pdfs 
    SET 
      title = ?, 
      google_drive_url = ?, 
      category_id = ?
    WHERE id = ?
  `).bind(
    title, 
    google_drive_url, 
    category_id,
    id
  ).run()
  
  // Update tags
  await c.env.DB.prepare(
    'DELETE FROM pdf_tags WHERE pdf_id = ?'
  ).bind(id).run()
  
  if (tag_ids && tag_ids.length > 0) {
    for (const tag_id of tag_ids) {
      await c.env.DB.prepare(
        'INSERT INTO pdf_tags (pdf_id, tag_id) VALUES (?, ?)'
      ).bind(id, tag_id).run()
    }
  }
  
  return c.json({ success: true })
})

// Delete PDF
app.delete('/api/pdfs/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare(
    'DELETE FROM pdfs WHERE id = ?'
  ).bind(id).run()
  
  return c.json({ success: true })
})

// Increment download count for a single PDF
app.post('/api/pdfs/:id/download', async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare(
    'UPDATE pdfs SET download_count = download_count + 1 WHERE id = ?'
  ).bind(id).run()
  
  return c.json({ success: true })
})

// Increment download count for all PDFs in a category
app.post('/api/categories/:id/download', async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare(
    'UPDATE pdfs SET download_count = download_count + 1 WHERE category_id = ?'
  ).bind(id).run()
  
  return c.json({ success: true })
})

// Note: Direct PDF upload is disabled.
// All PDFs should be stored on Google Drive and referenced by URL.

// ============================================
// Frontend Routes
// ============================================

// Home page (public view)
app.get('/', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header class="bg-primary shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <a href="/" class="hover:opacity-80 transition-opacity">
              <h1 class="text-3xl font-bold text-white tracking-wide">
                Akagami Research
              </h1>
              <p class="text-white text-sm mt-1 opacity-90">♡ 赤髪の資料保管庫 ♡</p>
            </a>
            {/* Mobile Menu Button */}
            <button 
              onclick="toggleMobileMenu()"
              class="lg:hidden text-white p-2 hover:bg-red-600 rounded-lg transition-colors"
            >
              <i class="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay for Mobile */}
      <div 
        id="sidebar-overlay" 
        class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden lg:hidden"
        onclick="toggleMobileMenu()"
      ></div>

      {/* Mobile Search Bar - Show only on mobile */}
      <div class="lg:hidden bg-white border-b-2 border-gray-100 sticky top-0 z-30">
        <div class="max-w-7xl mx-auto px-4 py-3">
          <div class="relative">
            <input 
              type="text" 
              id="mobile-search-input"
              placeholder="キーワードで検索..."
              class="w-full pl-4 pr-12 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
            />
            <button 
              id="mobile-search-btn"
              class="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-md"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* PDF List - Show first on mobile */}
          <div class="lg:col-span-3 order-1 lg:order-2">
            <div id="pdf-list" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div class="col-span-full text-center py-12 text-gray-600">
                <i class="fas fa-spinner fa-spin text-5xl mb-4 text-primary"></i>
                <p class="text-lg">読み込み中...</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Show second on mobile (below cards) */}
          <aside 
            id="sidebar"
            class="lg:col-span-1 order-2 lg:order-1 fixed lg:static inset-y-0 right-0 transform translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:z-auto w-80 lg:w-auto"
          >
            <div class="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-8 border-2 border-primary h-full lg:h-auto overflow-y-auto">
              {/* Close button for mobile */}
              <button 
                onclick="toggleMobileMenu()"
                class="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <i class="fas fa-times text-2xl"></i>
              </button>
              
              {/* Search - Desktop Only */}
              <div class="mb-8 hidden lg:block">
                <h2 class="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <i class="fas fa-search mr-2 text-primary"></i>検索
                </h2>
                <div class="relative">
                  <input 
                    type="text" 
                    id="search-input"
                    placeholder="キーワードで検索..."
                    class="w-full pl-4 pr-12 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
                  />
                  <button 
                    id="search-btn"
                    class="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-md"
                  >
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div id="category-filter"></div>

              {/* Tag Filter */}
              <div id="tag-filter"></div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer class="bg-gray-50 border-t border-gray-200 py-6 mt-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-sm text-gray-500">&copy; 2026 Akagami Research. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
})

// Admin page
app.get('/admin', (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Akagami Research - 管理画面</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: '#e75556',
                    secondary: '#e75556',
                    accent: '#e75556',
                    dark: '#333333',
                    darker: '#1a1a1a',
                    light: '#ffffff',
                  }
                }
              }
            }
          `
        }} />
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
        <link href="/static/admin-dark.css" rel="stylesheet" />
      </head>
      <body class="bg-white">
        <div id="admin-app">
          <div class="text-center py-12 text-gray-500">
            <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
            <p>読み込み中...</p>
          </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/admin.js"></script>
      </body>
    </html>
  )
})

export default app
