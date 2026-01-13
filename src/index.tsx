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
import {
  hashPassword,
  verifyPassword,
  generateMagicLinkToken,
  generateUserToken,
  getCurrentUser,
  setUserSessionCookie,
  clearUserSessionCookie,
  requireUserAuth
} from './user-auth'
import {
  sendEmail,
  getWelcomeEmailHtml,
  getMagicLinkEmailHtml,
  getNewPdfNotificationEmailHtml
} from './email'

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
// API Routes - User Authentication (public)
// ============================================

// User registration with password
app.post('/api/user/register', async (c) => {
  try {
    const { email, name, password, usePasswordless } = await c.req.json()
    
    if (!email || !name) {
      return c.json({ error: 'Email and name are required' }, 400)
    }
    
    // Check if user already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first()
    
    if (existingUser) {
      return c.json({ error: 'User already exists with this email' }, 400)
    }
    
    // Create user
    let passwordHash = null
    let loginMethod = 'magic_link'
    
    if (!usePasswordless && password) {
      if (password.length < 6) {
        return c.json({ error: 'Password must be at least 6 characters' }, 400)
      }
      passwordHash = await hashPassword(password)
      loginMethod = 'password'
    }
    
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, name, password_hash, login_method) VALUES (?, ?, ?, ?)'
    ).bind(email, name, passwordHash, loginMethod).run()
    
    const userId = result.meta.last_row_id as number
    
    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Akagami Research へようこそ！',
      html: getWelcomeEmailHtml(name),
      text: `こんにちは、${name}さん。Akagami Research の会員登録が完了しました！`
    })
    
    // Generate session token
    const secret = c.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
    const token = await generateUserToken(userId, secret)
    setUserSessionCookie(c, token)
    
    return c.json({ 
      success: true, 
      user: { id: userId, email, name, loginMethod }
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return c.json({ error: 'Registration failed' }, 500)
  }
})

// User login with password
app.post('/api/user/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }
    
    // Get user
    const user = await c.env.DB.prepare(
      'SELECT id, email, name, password_hash, login_method FROM users WHERE email = ?'
    ).bind(email).first()
    
    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }
    
    // Check if user uses password authentication
    if (!user.password_hash) {
      return c.json({ error: 'This account uses magic link authentication. Please use "Send Magic Link" option.' }, 400)
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.password_hash as string)
    if (!isValid) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }
    
    // Update last login
    await c.env.DB.prepare(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(user.id).run()
    
    // Generate session token
    const secret = c.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
    const token = await generateUserToken(user.id as number, secret)
    setUserSessionCookie(c, token)
    
    return c.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        loginMethod: user.login_method
      }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// Send magic link for passwordless authentication
app.post('/api/user/send-magic-link', async (c) => {
  try {
    const { email } = await c.req.json()
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }
    
    // Get user
    const user = await c.env.DB.prepare(
      'SELECT id, email, name, login_method FROM users WHERE email = ?'
    ).bind(email).first()
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return c.json({ success: true, message: 'If an account exists with this email, a magic link has been sent.' })
    }
    
    // Generate magic link token
    const token = generateMagicLinkToken()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    
    // Save token
    await c.env.DB.prepare(
      'INSERT INTO magic_link_tokens (user_id, token, expires_at) VALUES (?, ?, ?)'
    ).bind(user.id, token, expiresAt.toISOString()).run()
    
    // Send magic link email
    const magicLink = `https://akagami.net/auth/magic-link?token=${token}`
    await sendEmail({
      to: email,
      subject: 'Akagami Research ログインリンク',
      html: getMagicLinkEmailHtml(user.name as string, magicLink),
      text: `こんにちは、${user.name}さん。ログインリンク: ${magicLink} （15分間有効）`
    })
    
    return c.json({ success: true, message: 'Magic link has been sent to your email.' })
  } catch (error: any) {
    console.error('Magic link error:', error)
    return c.json({ error: 'Failed to send magic link' }, 500)
  }
})

// Verify magic link token and login
app.get('/api/user/verify-magic-link', async (c) => {
  try {
    const token = c.req.query('token')
    
    if (!token) {
      return c.json({ error: 'Token is required' }, 400)
    }
    
    // Get token info
    const tokenInfo = await c.env.DB.prepare(
      'SELECT id, user_id, expires_at, used FROM magic_link_tokens WHERE token = ?'
    ).bind(token).first()
    
    if (!tokenInfo) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }
    
    // Check if already used
    if (tokenInfo.used) {
      return c.json({ error: 'Token has already been used' }, 401)
    }
    
    // Check if expired
    const expiresAt = new Date(tokenInfo.expires_at as string)
    if (expiresAt < new Date()) {
      return c.json({ error: 'Token has expired' }, 401)
    }
    
    // Mark token as used
    await c.env.DB.prepare(
      'UPDATE magic_link_tokens SET used = TRUE WHERE id = ?'
    ).bind(tokenInfo.id).run()
    
    // Get user
    const user = await c.env.DB.prepare(
      'SELECT id, email, name, login_method FROM users WHERE id = ?'
    ).bind(tokenInfo.user_id).first()
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    // Update last login
    await c.env.DB.prepare(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(user.id).run()
    
    // Generate session token
    const secret = c.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
    const sessionToken = await generateUserToken(user.id as number, secret)
    setUserSessionCookie(c, sessionToken)
    
    return c.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        loginMethod: user.login_method
      }
    })
  } catch (error: any) {
    console.error('Magic link verification error:', error)
    return c.json({ error: 'Verification failed' }, 500)
  }
})

// User logout
app.post('/api/user/logout', async (c) => {
  clearUserSessionCookie(c)
  return c.json({ success: true })
})

// Get current user info
app.get('/api/user/me', async (c) => {
  const secret = c.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
  const currentUser = await getCurrentUser(c, secret)
  
  if (!currentUser) {
    return c.json({ authenticated: false })
  }
  
  // Get user details
  const user = await c.env.DB.prepare(
    'SELECT id, email, name, login_method, created_at, last_login FROM users WHERE id = ?'
  ).bind(currentUser.userId).first()
  
  if (!user) {
    clearUserSessionCookie(c)
    return c.json({ authenticated: false })
  }
  
  return c.json({ 
    authenticated: true, 
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      loginMethod: user.login_method,
      createdAt: user.created_at,
      lastLogin: user.last_login
    }
  })
})

// ============================================
// API Routes - User Data Sync (protected)
// ============================================

// User auth middleware
async function requireUserAuth(c: any, next: any) {
  const secret = c.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
  const currentUser = await getCurrentUser(c, secret)
  
  if (!currentUser) {
    return c.json({ error: 'Unauthorized. Please login.' }, 401)
  }
  
  c.set('userId', currentUser.userId)
  await next()
}

// Get user's download history
app.get('/api/user/downloads', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    
    const { results } = await c.env.DB.prepare(`
      SELECT 
        ud.id,
        ud.pdf_id,
        ud.downloaded_at,
        p.title,
        p.google_drive_url,
        c.name as category_name
      FROM user_downloads ud
      LEFT JOIN pdfs p ON ud.pdf_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ud.user_id = ?
      ORDER BY ud.downloaded_at DESC
    `).bind(userId).all()
    
    return c.json(results)
  } catch (error: any) {
    console.error('Get downloads error:', error)
    return c.json({ error: 'Failed to get downloads' }, 500)
  }
})

// Sync download (add to history)
app.post('/api/user/downloads', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const { pdfId } = await c.req.json()
    
    if (!pdfId) {
      return c.json({ error: 'PDF ID is required' }, 400)
    }
    
    // Check if already downloaded
    const existing = await c.env.DB.prepare(
      'SELECT id FROM user_downloads WHERE user_id = ? AND pdf_id = ?'
    ).bind(userId, pdfId).first()
    
    if (existing) {
      return c.json({ success: true, message: 'Already in download history' })
    }
    
    // Add to download history
    await c.env.DB.prepare(
      'INSERT INTO user_downloads (user_id, pdf_id) VALUES (?, ?)'
    ).bind(userId, pdfId).run()
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Sync download error:', error)
    return c.json({ error: 'Failed to sync download' }, 500)
  }
})

// Bulk sync downloads (for migrating from localStorage)
app.post('/api/user/downloads/bulk', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const { pdfIds } = await c.req.json()
    
    if (!Array.isArray(pdfIds) || pdfIds.length === 0) {
      return c.json({ error: 'PDF IDs array is required' }, 400)
    }
    
    let syncedCount = 0
    
    for (const pdfId of pdfIds) {
      // Check if already exists
      const existing = await c.env.DB.prepare(
        'SELECT id FROM user_downloads WHERE user_id = ? AND pdf_id = ?'
      ).bind(userId, pdfId).first()
      
      if (!existing) {
        await c.env.DB.prepare(
          'INSERT INTO user_downloads (user_id, pdf_id) VALUES (?, ?)'
        ).bind(userId, pdfId).run()
        syncedCount++
      }
    }
    
    return c.json({ success: true, syncedCount })
  } catch (error: any) {
    console.error('Bulk sync downloads error:', error)
    return c.json({ error: 'Failed to bulk sync downloads' }, 500)
  }
})

// Get user's favorites
app.get('/api/user/favorites', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    
    const { results } = await c.env.DB.prepare(`
      SELECT 
        uf.id,
        uf.pdf_id,
        uf.created_at,
        p.title,
        p.google_drive_url,
        c.name as category_name
      FROM user_favorites uf
      LEFT JOIN pdfs p ON uf.pdf_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE uf.user_id = ?
      ORDER BY uf.created_at DESC
    `).bind(userId).all()
    
    return c.json(results)
  } catch (error: any) {
    console.error('Get favorites error:', error)
    return c.json({ error: 'Failed to get favorites' }, 500)
  }
})

// Add to favorites
app.post('/api/user/favorites', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const { pdfId } = await c.req.json()
    
    if (!pdfId) {
      return c.json({ error: 'PDF ID is required' }, 400)
    }
    
    // Add to favorites (UNIQUE constraint will prevent duplicates)
    try {
      await c.env.DB.prepare(
        'INSERT INTO user_favorites (user_id, pdf_id) VALUES (?, ?)'
      ).bind(userId, pdfId).run()
      
      return c.json({ success: true })
    } catch (error: any) {
      if (error.message.includes('UNIQUE')) {
        return c.json({ success: true, message: 'Already in favorites' })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Add favorite error:', error)
    return c.json({ error: 'Failed to add favorite' }, 500)
  }
})

// Remove from favorites
app.delete('/api/user/favorites/:pdfId', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const pdfId = c.req.param('pdfId')
    
    await c.env.DB.prepare(
      'DELETE FROM user_favorites WHERE user_id = ? AND pdf_id = ?'
    ).bind(userId, pdfId).run()
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Remove favorite error:', error)
    return c.json({ error: 'Failed to remove favorite' }, 500)
  }
})

// Bulk sync favorites (for migrating from localStorage)
app.post('/api/user/favorites/bulk', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const { pdfIds } = await c.req.json()
    
    if (!Array.isArray(pdfIds) || pdfIds.length === 0) {
      return c.json({ error: 'PDF IDs array is required' }, 400)
    }
    
    let syncedCount = 0
    
    for (const pdfId of pdfIds) {
      try {
        await c.env.DB.prepare(
          'INSERT OR IGNORE INTO user_favorites (user_id, pdf_id) VALUES (?, ?)'
        ).bind(userId, pdfId).run()
        syncedCount++
      } catch (error) {
        // Skip if already exists
        console.warn('Failed to sync favorite:', pdfId, error)
      }
    }
    
    return c.json({ success: true, syncedCount })
  } catch (error: any) {
    console.error('Bulk sync favorites error:', error)
    return c.json({ error: 'Failed to bulk sync favorites' }, 500)
  }
})

// ============================================
// API Routes - Notification Settings (protected)
// ============================================

// Get user's notification settings
app.get('/api/user/notifications', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    
    const { results } = await c.env.DB.prepare(`
      SELECT 
        uns.id,
        uns.category_id,
        uns.notification_enabled,
        uns.frequency,
        c.name as category_name
      FROM user_notification_settings uns
      LEFT JOIN categories c ON uns.category_id = c.id
      WHERE uns.user_id = ?
      ORDER BY c.sort_order ASC, c.name ASC
    `).bind(userId).all()
    
    return c.json(results)
  } catch (error: any) {
    console.error('Get notifications error:', error)
    return c.json({ error: 'Failed to get notification settings' }, 500)
  }
})

// Update notification setting for a category
app.post('/api/user/notifications', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const { categoryId, notificationEnabled, frequency } = await c.req.json()
    
    if (categoryId === undefined) {
      return c.json({ error: 'Category ID is required' }, 400)
    }
    
    // Upsert notification setting
    await c.env.DB.prepare(`
      INSERT INTO user_notification_settings (user_id, category_id, notification_enabled, frequency)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, category_id) DO UPDATE SET
        notification_enabled = excluded.notification_enabled,
        frequency = excluded.frequency,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      userId, 
      categoryId, 
      notificationEnabled !== false, 
      frequency || 'immediate'
    ).run()
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Update notification error:', error)
    return c.json({ error: 'Failed to update notification setting' }, 500)
  }
})

// Bulk update notification settings
app.post('/api/user/notifications/bulk', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const { settings } = await c.req.json()
    
    if (!Array.isArray(settings)) {
      return c.json({ error: 'Settings array is required' }, 400)
    }
    
    for (const setting of settings) {
      await c.env.DB.prepare(`
        INSERT INTO user_notification_settings (user_id, category_id, notification_enabled, frequency)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id, category_id) DO UPDATE SET
          notification_enabled = excluded.notification_enabled,
          frequency = excluded.frequency,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        userId,
        setting.categoryId,
        setting.notificationEnabled !== false,
        setting.frequency || 'immediate'
      ).run()
    }
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Bulk update notifications error:', error)
    return c.json({ error: 'Failed to bulk update notification settings' }, 500)
  }
})

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
  
  // Send notification emails to subscribed users
  try {
    const { results: subscribers } = await c.env.DB.prepare(`
      SELECT DISTINCT u.id, u.email, u.name, uns.frequency
      FROM users u
      JOIN user_notification_settings uns ON u.id = uns.user_id
      JOIN categories c ON uns.category_id = c.id
      WHERE uns.category_id = ? 
        AND uns.notification_enabled = 1
        AND uns.frequency = 'immediate'
    `).bind(category_id).all()
    
    // Get category name for email
    const category = await c.env.DB.prepare(
      'SELECT name FROM categories WHERE id = ?'
    ).bind(category_id).first()
    
    const categoryName = category?.name || 'Unknown'
    
    // Send notification email to each subscriber
    for (const subscriber of subscribers) {
      await sendNewPDFNotification(
        subscriber.email,
        subscriber.name,
        {
          title,
          url: google_drive_url,
          categoryName
        }
      )
      
      // Log email notification
      await c.env.DB.prepare(`
        INSERT INTO email_notifications (user_id, pdf_id, notification_type, status)
        VALUES (?, ?, 'new_pdf', 'sent')
      `).bind(subscriber.id, pdf_id).run()
    }
  } catch (emailError: any) {
    console.error('Failed to send notification emails:', emailError)
    // Don't fail the PDF creation if email sending fails
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
const categoryMeta: Record<number, { name: string; title: string; description: string; keywords: string }> = {
  1: {
    name: "YouTube資料",
    title: "YouTube資料 - Akagami Research",
    description: "YouTubeマーケティング・運用・戦略に関する資料を無料で公開。チャンネル運営、動画制作、収益化、SEO対策など、YouTube攻略のノウハウが満載。",
    keywords: "YouTube,YouTubeマーケティング,動画制作,チャンネル運営,収益化,YouTube SEO"
  },
  2: {
    name: "Threads資料",
    title: "Threads資料 - Akagami Research",
    description: "Threadsマーケティング・運用戦略に関する資料を無料で公開。Meta社の新SNS「Threads」の効果的な活用方法、フォロワー獲得術を解説。",
    keywords: "Threads,Threadsマーケティング,Meta,SNS運用,フォロワー獲得"
  },
  3: {
    name: "Podcast資料",
    title: "Podcast資料 - Akagami Research",
    description: "ポッドキャストマーケティング・配信戦略に関する資料を無料で公開。音声メディアの活用方法、収益化、リスナー獲得のノウハウを提供。",
    keywords: "Podcast,ポッドキャスト,音声配信,音声マーケティング,リスナー獲得"
  },
  4: {
    name: "LINE公式資料",
    title: "LINE公式資料 - Akagami Research",
    description: "LINE公式アカウントのマーケティング・運用戦略に関する資料を無料で公開。友だち獲得、メッセージ配信、自動応答の活用方法を解説。",
    keywords: "LINE公式,LINE公式アカウント,LINEマーケティング,友だち獲得,メッセージ配信"
  },
  5: {
    name: "Instagram資料",
    title: "Instagram資料 - Akagami Research",
    description: "Instagramマーケティング・運用戦略に関する資料を無料で公開。投稿戦略、リール活用、フォロワー増加、ストーリーズ運用など実践的なノウハウが満載。",
    keywords: "Instagram,インスタグラム,Instagramマーケティング,リール,ストーリーズ,フォロワー増加"
  },
  6: {
    name: "TikTok資料",
    title: "TikTok資料 - Akagami Research",
    description: "TikTokマーケティング・運用戦略に関する資料を無料で公開。バズる動画の作り方、アルゴリズム攻略、フォロワー獲得の実践的なノウハウを提供。",
    keywords: "TikTok,TikTokマーケティング,ショート動画,バズる方法,TikTokアルゴリズム"
  },
  7: {
    name: "X (旧Twitter) 資料",
    title: "X (旧Twitter) 資料 - Akagami Research",
    description: "X (旧Twitter) のマーケティング・運用戦略に関する資料を無料で公開。投稿戦略、エンゲージメント向上、フォロワー獲得の実践的なノウハウを解説。",
    keywords: "X,Twitter,Xマーケティング,Twitterマーケティング,SNS運用,フォロワー獲得"
  },
  8: {
    name: "マーケティング資料",
    title: "マーケティング資料 - Akagami Research",
    description: "デジタルマーケティング・SNSマーケティングに関する資料を無料で公開。戦略立案、分析手法、広告運用、コンテンツマーケティングの実践ノウハウを提供。",
    keywords: "マーケティング,デジタルマーケティング,SNSマーケティング,広告運用,コンテンツマーケティング"
  },
  9: {
    name: "その他資料",
    title: "その他資料 - Akagami Research",
    description: "SNSマーケティング全般に関する資料を無料で公開。トレンド情報、ツール紹介、分析手法など、幅広いマーケティング情報を提供。",
    keywords: "SNSマーケティング,マーケティングツール,トレンド,分析手法"
  },
  10: {
    name: "生成AI資料",
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
        keywords: "SNSマーケティング,YouTube,Instagram,TikTok,Threads,生成AI,マーケティング資料,無料資料,赤髪社長",
        name: null as string | null
      }
  
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
            <div class="flex items-center gap-4">
              {/* Auth Button */}
              <div id="auth-button">
                <button 
                  class="hidden md:flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                  onclick="showLoginModal()"
                  aria-label="ログイン"
                >
                  <i class="fas fa-sign-in-alt"></i>
                  <span>ログイン</span>
                </button>
              </div>
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

      {/* Authentication Modal */}
      <div id="auth-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            {/* Modal Header */}
            <div class="flex items-center justify-between mb-6">
              <h2 id="auth-modal-title" class="text-2xl font-bold text-gray-800">ログイン</h2>
              <button 
                onclick="closeAuthModal()"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="閉じる"
              >
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>

            {/* Password Login Form */}
            <form id="password-login-form" onsubmit="handlePasswordLogin(event)">
              <div class="space-y-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                  <input 
                    type="email" 
                    id="login-email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
                  <input 
                    type="password" 
                    id="login-password"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              <div id="login-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>

              {/* Submit Button */}
              <button 
                type="submit"
                class="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold mb-4"
              >
                <i class="fas fa-sign-in-alt mr-2"></i>ログイン
              </button>

              {/* Magic Link Option */}
              <button 
                type="button"
                onclick="switchToMagicLink()"
                class="w-full text-primary hover:underline text-sm mb-4"
              >
                パスワードを使わずにログイン（マジックリンク）
              </button>
            </form>

            {/* Magic Link Form */}
            <form id="magic-link-form" class="hidden" onsubmit="handleMagicLinkRequest(event)">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                <input 
                  type="email" 
                  id="magic-link-email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="your@email.com"
                  required
                />
                <p class="text-xs text-gray-500 mt-2">ログインリンクをメールでお送りします</p>
              </div>

              {/* Error Message */}
              <div id="magic-link-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>

              {/* Success Message */}
              <div id="magic-link-success" class="hidden mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"></div>

              {/* Submit Button */}
              <button 
                type="submit"
                class="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold mb-4"
              >
                <i class="fas fa-envelope mr-2"></i>ログインリンクを送信
              </button>

              {/* Back to Password Login */}
              <button 
                type="button"
                onclick="switchToPasswordLogin()"
                class="w-full text-primary hover:underline text-sm mb-4"
              >
                パスワードでログイン
              </button>
            </form>

            {/* Register Form */}
            <form id="register-form" class="hidden" onsubmit="handleRegister(event)">
              <div class="space-y-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">お名前</label>
                  <input 
                    type="text" 
                    id="register-name"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="山田太郎"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                  <input 
                    type="email" 
                    id="register-email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">パスワード（8文字以上）</label>
                  <input 
                    type="password" 
                    id="register-password"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                    minlength="8"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">パスワード（確認）</label>
                  <input 
                    type="password" 
                    id="register-password-confirm"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                    minlength="8"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              <div id="register-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>

              {/* Submit Button */}
              <button 
                type="submit"
                class="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold mb-4"
              >
                <i class="fas fa-user-plus mr-2"></i>会員登録
              </button>
            </form>

            {/* Switch Mode */}
            <div id="switch-auth-mode" class="text-center text-sm text-gray-600">
              アカウントをお持ちでない方は <button type="button" onclick="switchToRegister()" class="text-primary hover:underline">こちら</button>
            </div>
          </div>
        </div>
      </div>

      {/* User Menu Dropdown */}
      <div id="user-menu" class="hidden">
        <div id="user-menu-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <button 
            onclick="showMyPage()"
            class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <i class="fas fa-user"></i>
            マイページ
          </button>
          <button 
            onclick="showNotificationSettings()"
            class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <i class="fas fa-bell"></i>
            通知設定
          </button>
          <hr class="my-2 border-gray-200" />
          <button 
            onclick="handleLogout()"
            class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <i class="fas fa-sign-out-alt"></i>
            ログアウト
          </button>
        </div>
      </div>
    </div>,
    {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      categoryName: meta.name || null,
      categoryId: categoryId
    }
  )
})

// My Page - Simple placeholder (TODO: implement full features)
app.get('/mypage', (c) => {
  return c.text('My Page - Coming Soon')
})

// Notification Settings - Simple placeholder (TODO: implement full features)
app.get('/notifications', (c) => {
  return c.text('Notification Settings - Coming Soon')
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
