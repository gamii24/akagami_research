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

// Delete category
app.delete('/api/categories/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare(
    'DELETE FROM categories WHERE id = ?'
  ).bind(id).run()
  
  return c.json({ success: true })
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
    <div class="min-h-screen">
      {/* Header */}
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900">
              <i class="fas fa-file-pdf text-red-500 mr-3"></i>
              PDF資料管理システム
            </h1>
            <a 
              href="/admin" 
              class="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <i class="fas fa-cog mr-2"></i>管理画面
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
              {/* Search */}
              <div class="mb-6">
                <h2 class="text-lg font-semibold mb-3 text-gray-700">
                  <i class="fas fa-search mr-2"></i>検索
                </h2>
                <div class="flex gap-2">
                  <input 
                    type="text" 
                    id="search-input"
                    placeholder="キーワードで検索..."
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    id="search-btn"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

          {/* PDF List */}
          <div class="lg:col-span-3">
            <div id="pdf-list" class="space-y-6">
              <div class="text-center py-12 text-gray-500">
                <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
                <p>読み込み中...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
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
