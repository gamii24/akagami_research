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
      CASE WHEN p.pdf_file_data IS NOT NULL THEN 1 ELSE 0 END as has_file,
      p.file_name,
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

// Upload PDF file
app.post('/api/pdfs/upload', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string || ''
    const category_id = formData.get('category_id') as string || null
    const tag_ids_str = formData.get('tag_ids') as string || '[]'
    const tag_ids = JSON.parse(tag_ids_str)
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }
    
    // Check file size (limit to 2MB for D1)
    if (file.size > 2 * 1024 * 1024) {
      return c.json({ error: 'ファイルサイズが大きすぎます（最大2MB）' }, 400)
    }
    
    // Read file as base64 (handle large files with chunking)
    const arrayBuffer = await file.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    let binary = ''
    const chunkSize = 8192
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize)
      binary += String.fromCharCode.apply(null, Array.from(chunk))
    }
    const base64 = btoa(binary)
    
    // Insert PDF with file data
    const result = await c.env.DB.prepare(`
      INSERT INTO pdfs (
        title, 
        description, 
        category_id,
        file_name,
        file_size,
        pdf_file_data
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      title,
      description,
      category_id,
      file.name,
      `${(file.size / 1024).toFixed(2)} KB`,
      base64
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
      file_name: file.name
    })
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ error: 'アップロードに失敗しました' }, 500)
  }
})

// Download PDF file
app.get('/api/pdfs/:id/download', async (c) => {
  const id = c.req.param('id')
  
  const pdf = await c.env.DB.prepare(`
    SELECT pdf_file_data, file_name, title
    FROM pdfs
    WHERE id = ?
  `).bind(id).first() as any
  
  if (!pdf || !pdf.pdf_file_data) {
    return c.json({ error: 'PDF not found' }, 404)
  }
  
  // Decode base64 to binary
  const binaryString = atob(pdf.pdf_file_data)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  const fileName = pdf.file_name || `${pdf.title}.pdf`
  
  return new Response(bytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
    },
  })
})

// Bulk upload PDFs with auto-categorization
app.post('/api/pdfs/bulk-upload', async (c) => {
  try {
    const formData = await c.req.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return c.json({ error: 'ファイルが選択されていません' }, 400)
    }
    
    // Get all categories
    const { results: categories } = await c.env.DB.prepare(
      'SELECT id, name FROM categories ORDER BY name'
    ).all()
    
    const categoryMap = new Map(categories.map((cat: any) => [cat.name.toLowerCase(), cat.id]))
    const otherCategoryId = categoryMap.get('その他') || null
    
    const uploadResults = []
    const errors = []
    
    for (const file of files) {
      try {
        // Check file size
        if (file.size > 2 * 1024 * 1024) {
          errors.push(`${file.name}: ファイルサイズが大きすぎます（最大2MB）`)
          continue
        }
        
        // Extract title from filename (remove .pdf extension)
        let title = file.name.replace(/\.pdf$/i, '')
        
        // Auto-detect category from filename
        const filenameLower = title.toLowerCase()
        let category_id = otherCategoryId
        
        // Category detection logic
        if (filenameLower.includes('youtube') || filenameLower.includes('ユーチューブ')) {
          category_id = categoryMap.get('youtube')
        } else if (filenameLower.includes('threads') || filenameLower.includes('スレッズ')) {
          category_id = categoryMap.get('threads')
        } else if (filenameLower.includes('podcast') || filenameLower.includes('ポッドキャスト')) {
          category_id = categoryMap.get('podcast')
        } else if (filenameLower.includes('line') || filenameLower.includes('ライン')) {
          category_id = categoryMap.get('line公式')
        } else if (filenameLower.includes('instagram') || filenameLower.includes('インスタ') || filenameLower.includes('インスタグラム')) {
          category_id = categoryMap.get('instagram')
        } else if (filenameLower.includes('tiktok') || filenameLower.includes('ティックトック')) {
          category_id = categoryMap.get('tiktok')
        } else if (filenameLower.includes('twitter') || filenameLower.includes('ツイッター') || filenameLower.includes(' x ') || filenameLower.startsWith('x ')) {
          category_id = categoryMap.get('x')
        } else if (filenameLower.includes('note') || filenameLower.includes('ノート')) {
          category_id = categoryMap.get('note')
        } else if (filenameLower.includes('blog') || filenameLower.includes('ブログ')) {
          category_id = categoryMap.get('ブログ')
        } else if (filenameLower.includes('marketing') || filenameLower.includes('マーケティング')) {
          category_id = categoryMap.get('マーケティング')
        } else if (filenameLower.includes('aeo') || filenameLower.includes('seo')) {
          category_id = categoryMap.get('aeo対策')
        } else if (filenameLower.includes('ai') || filenameLower.includes('生成ai') || filenameLower.includes('gpt') || filenameLower.includes('chatgpt')) {
          category_id = categoryMap.get('生成ai')
        } else if (filenameLower.includes('画像') || filenameLower.includes('動画') || filenameLower.includes('image') || filenameLower.includes('video') || filenameLower.includes('生成')) {
          category_id = categoryMap.get('画像&動画生成')
        }
        
        // Read file as base64 (handle large files with chunking)
        const arrayBuffer = await file.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        let binary = ''
        const chunkSize = 8192
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.slice(i, i + chunkSize)
          binary += String.fromCharCode.apply(null, Array.from(chunk))
        }
        const base64 = btoa(binary)
        
        // Insert PDF
        const result = await c.env.DB.prepare(`
          INSERT INTO pdfs (
            title, 
            description, 
            category_id,
            file_name,
            file_size,
            pdf_file_data
          ) VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          title,
          '',
          category_id,
          file.name,
          `${(file.size / 1024).toFixed(2)} KB`,
          base64
        ).run()
        
        const categoryName = Array.from(categoryMap.entries())
          .find(([_, id]) => id === category_id)?.[0] || 'その他'
        
        uploadResults.push({
          id: result.meta.last_row_id,
          title,
          category: categoryName,
          file_name: file.name
        })
      } catch (error) {
        errors.push(`${file.name}: ${error.message}`)
      }
    }
    
    return c.json({
      success: true,
      uploaded: uploadResults.length,
      total: files.length,
      results: uploadResults,
      errors
    })
  } catch (error) {
    console.error('Bulk upload error:', error)
    return c.json({ error: '一括アップロードに失敗しました' }, 500)
  }
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
