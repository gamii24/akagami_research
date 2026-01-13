import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { renderer } from './renderer'
import { 
  generateToken, 
  setAuthCookie, 
  clearAuthCookie, 
  isAuthenticated,
  getAuthToken 
} from './auth'

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  ADMIN_PASSWORD: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// ============================================
// Security Headers Middleware
// ============================================
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind CDN and inline scripts
      "https://cdn.tailwindcss.com",
      "https://cdn.jsdelivr.net",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind and inline styles
      "https://cdn.tailwindcss.com",
      "https://cdn.jsdelivr.net"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https:",
      "http:" // For external images if needed
    ],
    fontSrc: [
      "'self'",
      "https://cdn.jsdelivr.net",
      "data:"
    ],
    connectSrc: [
      "'self'",
      "https://www.google-analytics.com",
      "https://www.googletagmanager.com"
    ],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"], // Same as X-Frame-Options: DENY
    upgradeInsecureRequests: []
  },
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
  xXssProtection: '1; mode=block',
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    payment: []
  }
}))

app.use(renderer)

// Enable CORS for API routes
app.use('/api/*', cors())

// ============================================
// Authentication APIs
// ============================================

// Login API
app.post('/api/auth/login', async (c) => {
  const { password } = await c.req.json()
  const correctPassword = c.env.ADMIN_PASSWORD || 'admin123'
  
  if (password !== correctPassword) {
    return c.json({ error: 'Invalid password' }, 401)
  }
  
  // Generate JWT token
  const secret = c.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
  const token = await generateToken(secret)
  
  // Set cookie
  setAuthCookie(c, token)
  
  return c.json({ success: true, message: 'Login successful' })
})

// Logout API
app.post('/api/auth/logout', async (c) => {
  clearAuthCookie(c)
  return c.json({ success: true, message: 'Logout successful' })
})

// Check authentication status
app.get('/api/auth/check', async (c) => {
  const secret = c.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
  const authenticated = await isAuthenticated(c, secret)
  
  return c.json({ authenticated })
})

// Auth middleware for admin APIs
async function requireAuth(c: any, next: any) {
  const secret = c.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
  const authenticated = await isAuthenticated(c, secret)
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  await next()
}

// ============================================
// API Routes - Analytics (protected)
// ============================================

// Get PDF download statistics
app.get('/api/analytics/pdfs', requireAuth, async (c) => {
  try {
    // Get top 10 most downloaded PDFs
    const { results: topPdfs } = await c.env.DB.prepare(`
      SELECT 
        p.id,
        p.title,
        p.download_count,
        p.created_at,
        c.name as category_name
      FROM pdfs p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.download_count DESC
      LIMIT 10
    `).all()
    
    return c.json(topPdfs)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Get category statistics
app.get('/api/analytics/categories', requireAuth, async (c) => {
  try {
    const { results: categoryStats } = await c.env.DB.prepare(`
      SELECT 
        c.id,
        c.name,
        COUNT(p.id) as pdf_count,
        SUM(p.download_count) as total_downloads
      FROM categories c
      LEFT JOIN pdfs p ON c.id = p.category_id
      GROUP BY c.id, c.name
      ORDER BY total_downloads DESC
    `).all()
    
    return c.json(categoryStats)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Get overall statistics
app.get('/api/analytics/overview', requireAuth, async (c) => {
  try {
    // Total PDFs
    const totalPdfs = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM pdfs'
    ).first()
    
    // Total downloads
    const totalDownloads = await c.env.DB.prepare(
      'SELECT SUM(download_count) as count FROM pdfs'
    ).first()
    
    // Total categories
    const totalCategories = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM categories'
    ).first()
    
    // Total tags
    const totalTags = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM tags'
    ).first()
    
    // Recent PDFs (last 7 days)
    const recentPdfs = await c.env.DB.prepare(`
      SELECT COUNT(*) as count 
      FROM pdfs 
      WHERE created_at >= datetime('now', '-7 days')
    `).first()
    
    return c.json({
      totalPdfs: totalPdfs?.count || 0,
      totalDownloads: totalDownloads?.count || 0,
      totalCategories: totalCategories?.count || 0,
      totalTags: totalTags?.count || 0,
      recentPdfs: recentPdfs?.count || 0
    })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// ============================================
// API Routes - Categories
// ============================================

// Get all categories (public)
app.get('/api/categories', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM categories ORDER BY sort_order ASC, name ASC'
  ).all()
  return c.json(results)
})

// Create category (protected)
app.post('/api/categories', requireAuth, async (c) => {
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

// Update category (protected)
app.put('/api/categories/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  const { name, description, download_url, sort_order } = await c.req.json()
  
  await c.env.DB.prepare(
    'UPDATE categories SET name = ?, description = ?, download_url = ?, sort_order = ? WHERE id = ?'
  ).bind(name || '', description || '', download_url || null, sort_order !== undefined ? sort_order : null, id).run()
  
  return c.json({ success: true })
})

// Update category sort orders (for reordering) (protected)
app.post('/api/categories/reorder', requireAuth, async (c) => {
  const { categoryOrders } = await c.req.json() // [{id: 1, sort_order: 10}, {id: 2, sort_order: 20}, ...]
  
  // Update each category's sort_order
  for (const item of categoryOrders) {
    await c.env.DB.prepare(
      'UPDATE categories SET sort_order = ? WHERE id = ?'
    ).bind(item.sort_order, item.id).run()
  }
  
  return c.json({ success: true })
})

// Delete category (protected)
app.delete('/api/categories/:id', requireAuth, async (c) => {
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

// Get excluded tags (protected)
app.get('/api/excluded-tags', requireAuth, async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM excluded_tags ORDER BY tag_name'
  ).all()
  return c.json(results)
})

// Add excluded tag (protected)
app.post('/api/excluded-tags', requireAuth, async (c) => {
  const { tag_name } = await c.req.json()
  
  try {
    await c.env.DB.prepare(
      'INSERT INTO excluded_tags (tag_name) VALUES (?)'
    ).bind(tag_name).run()
    
    return c.json({ success: true })
  } catch (error: any) {
    // If tag already exists in excluded list
    if (error.message.includes('UNIQUE')) {
      return c.json({ success: true, message: 'Already excluded' })
    }
    return c.json({ error: error.message }, 500)
  }
})

// Remove excluded tag (protected)
app.delete('/api/excluded-tags/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare(
    'DELETE FROM excluded_tags WHERE id = ?'
  ).bind(id).run()
  
  return c.json({ success: true })
})

// Create tag (protected)
app.post('/api/tags', requireAuth, async (c) => {
  const { name } = await c.req.json()
  const result = await c.env.DB.prepare(
    'INSERT INTO tags (name) VALUES (?)'
  ).bind(name).run()
  
  return c.json({ 
    id: result.meta.last_row_id, 
    name 
  })
})

// Delete tag (protected)
app.delete('/api/tags/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  
  // Get tag name before deletion
  const tag = await c.env.DB.prepare(
    'SELECT name FROM tags WHERE id = ?'
  ).bind(id).first()
  
  if (tag) {
    // Add to excluded tags list
    try {
      await c.env.DB.prepare(
        'INSERT OR IGNORE INTO excluded_tags (tag_name) VALUES (?)'
      ).bind(tag.name).run()
    } catch (error) {
      console.error('Failed to add to excluded tags:', error)
    }
  }
  
  // Delete the tag
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

// Helper function to create or get tag (with exclusion check)
async function createOrGetTag(db: D1Database, tagName: string): Promise<number | null> {
  // Check if tag is in excluded list
  const excluded = await db.prepare(
    'SELECT id FROM excluded_tags WHERE tag_name = ?'
  ).bind(tagName).first()
  
  if (excluded) {
    return null // Skip this tag
  }
  
  // Check if tag exists
  const existing = await db.prepare('SELECT id FROM tags WHERE name = ?').bind(tagName).first()
  
  if (existing) {
    return existing.id as number
  }
  
  // Create new tag
  const result = await db.prepare('INSERT INTO tags (name) VALUES (?)').bind(tagName).run()
  return result.meta.last_row_id as number
}

// Create PDF (protected)
app.post('/api/pdfs', requireAuth, async (c) => {
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
    if (tagId !== null) {
      autoTagIds.push(tagId)
    }
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

// Update PDF (protected)
app.put('/api/pdfs/:id', requireAuth, async (c) => {
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

// Delete PDF (protected)
app.delete('/api/pdfs/:id', requireAuth, async (c) => {
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

// Regenerate tags for all existing PDFs (protected)
app.post('/api/pdfs/regenerate-tags', requireAuth, async (c) => {
  try {
    // Get all PDFs
    const { results: pdfs } = await c.env.DB.prepare('SELECT id, title FROM pdfs').all()
    
    let processedCount = 0
    let tagsCreated = 0
    
    for (const pdf of pdfs as any[]) {
      // Extract keywords from title
      const keywords = extractKeywordsFromTitle(pdf.title)
      
      if (keywords.length > 0) {
        // Create or get tags
        for (const keyword of keywords) {
          const tagId = await createOrGetTag(c.env.DB, keyword)
          
          if (tagId !== null) {
            // Add tag to PDF (ignore if already exists)
            await c.env.DB.prepare(
              'INSERT OR IGNORE INTO pdf_tags (pdf_id, tag_id) VALUES (?, ?)'
            ).bind(pdf.id, tagId).run()
            
            tagsCreated++
          }
        }
        processedCount++
      }
    }
    
    return c.json({ 
      success: true, 
      processed: processedCount,
      totalPdfs: pdfs.length,
      tagsCreated: tagsCreated
    })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Note: Direct PDF upload is disabled.
// All PDFs should be stored on Google Drive and referenced by URL.

// ============================================
// Frontend Routes
// ============================================

// Category-specific meta information
const categoryMeta: Record<number, { title: string; description: string; keywords: string }> = {
  1: {
    title: "YouTube資料 - Akagami Research",
    description: "YouTubeマーケティング・運用・戦略に関する資料を無料で公開。チャンネル運営、動画制作、収益化、SEO対策など、YouTube攻略のノウハウが満載。",
    keywords: "YouTube,YouTubeマーケティング,動画制作,チャンネル運営,収益化,YouTube SEO"
  },
  2: {
    title: "Threads資料 - Akagami Research",
    description: "Threadsマーケティング・運用戦略に関する資料を無料で公開。Meta社の新SNS「Threads」の効果的な活用方法、フォロワー獲得術を解説。",
    keywords: "Threads,Threadsマーケティング,Meta,SNS運用,フォロワー獲得"
  },
  3: {
    title: "Podcast資料 - Akagami Research",
    description: "ポッドキャストマーケティング・配信戦略に関する資料を無料で公開。音声メディアの活用方法、収益化、リスナー獲得のノウハウを提供。",
    keywords: "Podcast,ポッドキャスト,音声配信,音声マーケティング,リスナー獲得"
  },
  4: {
    title: "LINE公式資料 - Akagami Research",
    description: "LINE公式アカウントのマーケティング・運用戦略に関する資料を無料で公開。友だち獲得、メッセージ配信、自動応答の活用方法を解説。",
    keywords: "LINE公式,LINE公式アカウント,LINEマーケティング,友だち獲得,メッセージ配信"
  },
  5: {
    title: "Instagram資料 - Akagami Research",
    description: "Instagramマーケティング・運用戦略に関する資料を無料で公開。投稿戦略、リール活用、フォロワー増加、ストーリーズ運用など実践的なノウハウが満載。",
    keywords: "Instagram,インスタグラム,Instagramマーケティング,リール,ストーリーズ,フォロワー増加"
  },
  6: {
    title: "TikTok資料 - Akagami Research",
    description: "TikTokマーケティング・運用戦略に関する資料を無料で公開。バズる動画の作り方、アルゴリズム攻略、フォロワー獲得の実践的なノウハウを提供。",
    keywords: "TikTok,TikTokマーケティング,ショート動画,バズる方法,TikTokアルゴリズム"
  },
  7: {
    title: "X (旧Twitter) 資料 - Akagami Research",
    description: "X (旧Twitter) のマーケティング・運用戦略に関する資料を無料で公開。投稿戦略、エンゲージメント向上、フォロワー獲得の実践的なノウハウを解説。",
    keywords: "X,Twitter,Xマーケティング,Twitterマーケティング,SNS運用,フォロワー獲得"
  },
  8: {
    title: "マーケティング資料 - Akagami Research",
    description: "デジタルマーケティング・SNSマーケティングに関する資料を無料で公開。戦略立案、分析手法、広告運用、コンテンツマーケティングの実践ノウハウを提供。",
    keywords: "マーケティング,デジタルマーケティング,SNSマーケティング,広告運用,コンテンツマーケティング"
  },
  9: {
    title: "その他資料 - Akagami Research",
    description: "SNSマーケティング全般に関する資料を無料で公開。トレンド情報、ツール紹介、分析手法など、幅広いマーケティング情報を提供。",
    keywords: "SNSマーケティング,マーケティングツール,トレンド,分析手法"
  },
  10: {
    title: "生成AI資料 - Akagami Research",
    description: "生成AI・ChatGPT活用に関する資料を無料で公開。AIツールの使い方、プロンプトエンジニアリング、業務効率化の実践方法を解説。",
    keywords: "生成AI,ChatGPT,AI活用,プロンプトエンジニアリング,業務効率化,AIツール"
  },
  11: {
    title: "画像&動画生成資料 - Akagami Research",
    description: "AI画像生成・動画生成ツールの活用方法に関する資料を無料で公開。Midjourney、Stable Diffusion、動画生成AIの実践的な使い方を解説。",
    keywords: "AI画像生成,AI動画生成,Midjourney,Stable Diffusion,生成AI"
  },
  19: {
    title: "note資料 - Akagami Research",
    description: "noteマーケティング・記事作成に関する資料を無料で公開。記事の書き方、フォロワー獲得、収益化、SEO対策など実践的なノウハウを提供。",
    keywords: "note,noteマーケティング,記事作成,ライティング,収益化"
  },
  20: {
    title: "ブログ資料 - Akagami Research",
    description: "ブログマーケティング・SEO対策に関する資料を無料で公開。記事の書き方、アクセスアップ、収益化の実践的なノウハウを解説。",
    keywords: "ブログ,ブログマーケティング,SEO対策,アクセスアップ,収益化"
  },
  22: {
    title: "AEO対策資料 - Akagami Research",
    description: "AEO（Answer Engine Optimization）対策に関する資料を無料で公開。AI検索エンジン最適化、ChatGPT・Perplexity対策の実践方法を解説。",
    keywords: "AEO,Answer Engine Optimization,AI検索,ChatGPT,Perplexity,検索最適化"
  }
}

// Home page (public view)
app.get('/', (c) => {
  // Get category from query parameter
  const categoryId = c.req.query('category') ? parseInt(c.req.query('category') as string) : null
  
  // Get meta information based on category
  const meta = categoryId && categoryMeta[categoryId] 
    ? categoryMeta[categoryId]
    : {
        title: "Akagami Research - SNSマーケティング・生成AI資料保管庫",
        description: "YouTube、Instagram、TikTokなどのSNSマーケティングや生成AIに関する資料を無料で公開。カテゴリ別・タグ別に検索できる便利な資料管理システム。",
        keywords: "SNSマーケティング,YouTube,Instagram,TikTok,Threads,生成AI,マーケティング資料,無料資料,赤髪社長"
      }
  
  // Pass meta information to renderer
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header class="bg-primary shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <a href="/" class="hover:opacity-80 transition-opacity" aria-label="Akagami Research ホームページ">
              <h1 class="text-3xl font-bold text-white tracking-wide">
                Akagami Research
              </h1>
              <p class="text-white text-sm mt-1 opacity-90">♡ 赤髪の資料保管庫 ♡</p>
            </a>
            {/* Mobile Menu Button */}
            <button 
              onclick="toggleMobileMenu()"
              class="lg:hidden text-white p-2 hover:bg-red-600 rounded-lg transition-colors"
              aria-label="メニューを開く"
              aria-expanded="false"
            >
              <i class="fas fa-bars text-2xl" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay for Mobile */}
      <div 
        id="sidebar-overlay" 
        class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden lg:hidden"
        onclick="toggleMobileMenu()"
        aria-label="メニューを閉じる"
        role="button"
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
              aria-label="キーワード検索"
              role="searchbox"
            />
            <button 
              id="mobile-search-btn"
              class="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-md"
              aria-label="検索を実行"
            >
              <i class="fas fa-search" aria-hidden="true"></i>
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
                aria-label="メニューを閉じる"
              >
                <i class="fas fa-times text-2xl" aria-hidden="true"></i>
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
                    aria-label="キーワード検索"
                    role="searchbox"
                  />
                  <button 
                    id="search-btn"
                    class="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-md"
                    aria-label="検索を実行"
                  >
                    <i class="fas fa-search" aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div id="category-filter"></div>

              {/* Tag Filter */}
              <div id="tag-filter"></div>
              
              {/* Download History Button */}
              <div class="mt-6 pt-6 border-t-2 border-gray-200">
                <button 
                  onclick="toggleDownloadHistory()"
                  class="w-full px-4 py-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg transition-colors font-semibold shadow-sm border-2 border-pink-200 flex items-center justify-center gap-2"
                  id="download-history-btn"
                  aria-label="ダウンロード履歴を表示"
                >
                  <i class="fas fa-history" aria-hidden="true"></i>
                  <span>ダウンロード履歴</span>
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <div class="mt-4">
                <button 
                  onclick="toggleDarkMode()"
                  class="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium shadow-sm border-2 border-gray-300 flex items-center justify-center gap-2"
                  id="dark-mode-toggle-sidebar"
                  aria-label="ダークモード切り替え"
                  aria-pressed="false"
                >
                  <i class="fas fa-moon" id="dark-mode-icon-sidebar"></i>
                  <span id="dark-mode-text-sidebar">ダークモード</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Dark Mode Toggle - Before Footer */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div class="flex justify-center">
          <button 
            onclick="toggleDarkMode()"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors text-sm font-medium shadow-sm border border-gray-300 flex items-center gap-2"
            id="dark-mode-toggle-footer"
          >
            <i class="fas fa-moon" id="dark-mode-icon-footer"></i>
            <span id="dark-mode-text-footer">ダークモードに切り替え</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer class="bg-gray-50 border-t border-gray-200 py-8 mt-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SNS Links */}
          <div class="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-4">
            <a 
              href="https://note.com/akagami_sns" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              title="note"
            >
              <i class="fas fa-sticky-note text-xl"></i>
              <span class="text-sm font-medium">note</span>
            </a>
            <a 
              href="https://www.threads.com/@akagami0124" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              title="Threads"
            >
              <span class="text-xl">♡</span>
              <span class="text-sm font-medium">Threads</span>
            </a>
            <a 
              href="https://www.youtube.com/@akagami_sns" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              title="YouTube"
            >
              <i class="fab fa-youtube text-xl"></i>
              <span class="text-sm font-medium">YouTube</span>
            </a>
            <a 
              href="https://www.instagram.com/akagami_sns/" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              title="Instagram"
            >
              <i class="fab fa-instagram text-xl"></i>
              <span class="text-sm font-medium">Instagram</span>
            </a>
          </div>
          
          <p class="text-sm text-gray-500 text-center">&copy; 2026 Akagami Research. All rights reserved.</p>
          
          {/* Admin link - Desktop only, subtle */}
          <div class="hidden lg:block fixed bottom-4 right-4">
            <a 
              href="/admin" 
              class="text-xs text-gray-300 hover:text-gray-400 transition-colors opacity-30 hover:opacity-50"
              style="font-size: 10px;"
            >
              管理画面
            </a>
          </div>
        </div>
      </footer>
    </div>,
    {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords
    }
  )
})

// Sitemap.xml endpoint
app.get('/sitemap.xml', async (c) => {
  try {
    const baseUrl = 'https://akagami.net'
    
    // Get all categories
    const { results: categories } = await c.env.DB.prepare(
      'SELECT id, name FROM categories ORDER BY sort_order ASC'
    ).all()
    
    // Get all PDFs
    const { results: pdfs } = await c.env.DB.prepare(
      'SELECT id, title, created_at FROM pdfs ORDER BY created_at DESC'
    ).all()
    
    // Generate sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    // Homepage
    xml += '  <url>\n'
    xml += `    <loc>${baseUrl}/</loc>\n`
    xml += '    <changefreq>daily</changefreq>\n'
    xml += '    <priority>1.0</priority>\n'
    xml += '  </url>\n'
    
    // Category pages
    for (const category of categories as any[]) {
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}/?category=${category.id}</loc>\n`
      xml += `    <changefreq>weekly</changefreq>\n`
      xml += `    <priority>0.8</priority>\n`
      xml += '  </url>\n'
    }
    
    // PDF pages (as query parameters, since PDFs open in Google Drive)
    // We'll include them in sitemap for search engines to know about the content
    for (const pdf of pdfs as any[]) {
      const lastmod = pdf.created_at ? new Date(pdf.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}/?pdf=${pdf.id}</loc>\n`
      xml += `    <lastmod>${lastmod}</lastmod>\n`
      xml += `    <changefreq>monthly</changefreq>\n`
      xml += `    <priority>0.6</priority>\n`
      xml += '  </url>\n'
    }
    
    xml += '</urlset>'
    
    return c.body(xml, 200, {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    })
  } catch (error: any) {
    console.error('Failed to generate sitemap:', error)
    return c.text('Failed to generate sitemap', 500)
  }
})

// Admin page
app.get('/admin', (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Akagami Research - 管理画面</title>
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JPMZ82RMGG"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JPMZ82RMGG');
          `
        }} />
        
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
      <body class="admin-dark bg-darker">
        <div id="admin-app">
          <div class="text-center py-12 text-gray-300">
            <i class="fas fa-spinner fa-spin text-4xl mb-4 text-primary"></i>
            <p>読み込み中...</p>
          </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js" defer></script>
        <script src="/static/admin.js" defer></script>
      </body>
    </html>
  )
})

// 404 Not Found Page
app.notFound((c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>404 Not Found - Akagami Research</title>
        
        {/* Performance Optimization */}
        <link rel="preconnect" href="https://cdn.tailwindcss.com" />
        <link rel="dns-prefetch" href="https://cdn.tailwindcss.com" />
        
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: '#e75556',
                  }
                }
              }
            }
          `
        }} />
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
            .float-animation {
              animation: float 3s ease-in-out infinite;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .fade-in {
              animation: fadeIn 0.8s ease-out;
            }
          `
        }} />
      </head>
      <body class="bg-gradient-to-br from-white via-pink-50 to-red-50 min-h-screen flex items-center justify-center p-4">
        <div class="max-w-2xl w-full text-center fade-in">
          {/* Large 404 Text */}
          <div class="float-animation mb-8">
            <h1 class="text-9xl md:text-[12rem] font-bold text-primary mb-4" style="line-height: 1;">
              404
            </h1>
          </div>
          
          {/* Error Icon */}
          <div class="mb-6">
            <i class="fas fa-exclamation-triangle text-6xl text-primary opacity-80"></i>
          </div>
          
          {/* Error Message */}
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            ページが見つかりません
          </h2>
          <p class="text-lg text-gray-600 mb-8 px-4">
            お探しのページは削除されたか、URLが変更された可能性があります。
          </p>
          
          {/* Action Buttons */}
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a 
              href="/"
              class="px-8 py-4 bg-primary text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold text-lg flex items-center gap-2"
              aria-label="ホームページへ戻る"
            >
              <i class="fas fa-home" aria-hidden="true"></i>
              <span>ホームに戻る</span>
            </a>
            <button 
              onclick="history.back()"
              class="px-8 py-4 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg font-semibold text-lg border-2 border-gray-300 flex items-center gap-2"
              aria-label="前のページへ戻る"
            >
              <i class="fas fa-arrow-left" aria-hidden="true"></i>
              <span>前のページへ</span>
            </button>
          </div>
          
          {/* Helpful Links */}
          <div class="bg-white rounded-xl shadow-lg p-6 border-2 border-primary">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <i class="fas fa-link text-primary"></i>
              お役立ちリンク
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a 
                href="/?category=1"
                class="px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white rounded-lg transition-all duration-300 text-gray-700 font-medium flex items-center justify-center gap-2"
                aria-label="YouTube資料カテゴリへ"
              >
                <i class="fab fa-youtube" aria-hidden="true"></i>
                <span>YouTube資料</span>
              </a>
              <a 
                href="/?category=5"
                class="px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white rounded-lg transition-all duration-300 text-gray-700 font-medium flex items-center justify-center gap-2"
                aria-label="Instagram資料カテゴリへ"
              >
                <i class="fab fa-instagram" aria-hidden="true"></i>
                <span>Instagram資料</span>
              </a>
              <a 
                href="/?category=6"
                class="px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white rounded-lg transition-all duration-300 text-gray-700 font-medium flex items-center justify-center gap-2"
                aria-label="TikTok資料カテゴリへ"
              >
                <i class="fab fa-tiktok" aria-hidden="true"></i>
                <span>TikTok資料</span>
              </a>
              <a 
                href="/?category=9"
                class="px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white rounded-lg transition-all duration-300 text-gray-700 font-medium flex items-center justify-center gap-2"
                aria-label="生成AI資料カテゴリへ"
              >
                <i class="fas fa-robot" aria-hidden="true"></i>
                <span>生成AI資料</span>
              </a>
            </div>
          </div>
          
          {/* Footer */}
          <div class="mt-8 text-sm text-gray-500">
            <p>&copy; 2026 Akagami Research. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  )
})

export default app
