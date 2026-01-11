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
    'SELECT * FROM categories ORDER BY name'
  ).all()
  return c.json(results)
})

// Create category
app.post('/api/categories', async (c) => {
  const { name, description } = await c.req.json()
  const result = await c.env.DB.prepare(
    'INSERT INTO categories (name, description) VALUES (?, ?)'
  ).bind(name, description).run()
  
  return c.json({ 
    id: result.meta.last_row_id, 
    name, 
    description 
  })
})

// Update category
app.put('/api/categories/:id', async (c) => {
  const id = c.req.param('id')
  const { name, description, download_url } = await c.req.json()
  
  await c.env.DB.prepare(
    'UPDATE categories SET name = ?, description = ?, download_url = ? WHERE id = ?'
  ).bind(name || '', description || '', download_url || null, id).run()
  
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

// Get all PDFs with filters
app.get('/api/pdfs', async (c) => {
  const category = c.req.query('category')
  const tag = c.req.query('tag')
  const search = c.req.query('search')
  
  let query = `
    SELECT DISTINCT 
      p.id, 
      p.title, 
      p.description, 
      p.google_drive_url,
      p.category_id,
      p.thumbnail_url,
      p.file_size,
      p.page_count,
      p.created_at,
      p.updated_at,
      c.name as category_name
    FROM pdfs p
    LEFT JOIN categories c ON p.category_id = c.id
  `
  
  const conditions = []
  const bindings = []
  
  if (category) {
    conditions.push('p.category_id = ?')
    bindings.push(category)
  }
  
  if (tag) {
    query += ' INNER JOIN pdf_tags pt ON p.id = pt.pdf_id'
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
  
  query += ' ORDER BY p.created_at DESC'
  
  const { results } = await c.env.DB.prepare(query).bind(...bindings).all()
  
  // Get tags for each PDF
  for (const pdf of results as any[]) {
    const { results: tags } = await c.env.DB.prepare(`
      SELECT t.id, t.name
      FROM tags t
      INNER JOIN pdf_tags pt ON t.id = pt.tag_id
      WHERE pt.pdf_id = ?
    `).bind(pdf.id).all()
    pdf.tags = tags
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

// Create PDF
app.post('/api/pdfs', async (c) => {
  const { 
    title, 
    description, 
    google_drive_url, 
    category_id, 
    thumbnail_url,
    file_size,
    page_count,
    tag_ids 
  } = await c.req.json()
  
  const result = await c.env.DB.prepare(`
    INSERT INTO pdfs (
      title, 
      description, 
      google_drive_url, 
      category_id,
      thumbnail_url,
      file_size,
      page_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    title, 
    description, 
    google_drive_url, 
    category_id,
    thumbnail_url || null,
    file_size || null,
    page_count || null
  ).run()
  
  const pdf_id = result.meta.last_row_id
  
  // Add tags
  if (tag_ids && tag_ids.length > 0) {
    for (const tag_id of tag_ids) {
      await c.env.DB.prepare(
        'INSERT INTO pdf_tags (pdf_id, tag_id) VALUES (?, ?)'
      ).bind(pdf_id, tag_id).run()
    }
  }
  
  return c.json({ 
    id: pdf_id, 
    title, 
    description, 
    google_drive_url 
  })
})

// Update PDF
app.put('/api/pdfs/:id', async (c) => {
  const id = c.req.param('id')
  const { 
    title, 
    description, 
    google_drive_url, 
    category_id,
    thumbnail_url,
    file_size,
    page_count,
    tag_ids 
  } = await c.req.json()
  
  await c.env.DB.prepare(`
    UPDATE pdfs 
    SET 
      title = ?, 
      description = ?, 
      google_drive_url = ?, 
      category_id = ?,
      thumbnail_url = ?,
      file_size = ?,
      page_count = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    title, 
    description, 
    google_drive_url, 
    category_id,
    thumbnail_url || null,
    file_size || null,
    page_count || null,
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
              <p class="text-white text-sm mt-1 opacity-90">資料管理システム</p>
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
            <div id="pdf-list" class="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
          <a 
            href="/admin" 
            class="text-sm text-gray-500 hover:text-primary transition-colors"
          >
            管理画面
          </a>
        </div>
      </footer>
    </div>
  )
})

// Admin page
app.get('/admin', (c) => {
  return c.render(
    <div id="admin-app">
      <div class="text-center py-12 text-gray-500">
        <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
        <p>読み込み中...</p>
      </div>
    </div>
  )
})

export default app
