import { Hono } from 'hono'
import type { Context } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { renderer } from './renderer'
import { 
  generateToken, 
  verifyToken,
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
  getNewPdfNotificationEmailHtml,
  getAdminNewUserNotificationHtml
} from './email'

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  ADMIN_PASSWORD: string;
  RESEND_API_KEY?: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// ============================================
// Helper Functions
// ============================================

/**
 * Common Header Component for all user-facing pages
 */
function CommonHeader() {
  return (
    <>
      {/* Header */}
      <header class="bg-primary shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <a href="/" class="hover:opacity-80 transition-opacity" aria-label="Akagami.net ホームページ">
              <h1 class="text-xl font-bold text-white tracking-wide">
                Akagami.net
              </h1>
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
    </>
  )
}

/**
 * Common Sidebar Menu Component
 */
function CommonSidebar() {
  return (
    <aside 
      id="sidebar"
      class="lg:col-span-1 order-1 lg:order-1 fixed lg:static inset-y-0 right-0 lg:left-auto transform translate-x-full lg:translate-x-0 lg:transform-none transition-transform duration-300 ease-in-out lg:transition-none z-50 lg:z-auto w-80 lg:w-auto"
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
        
        {/* User Account Section - Move to top */}
        <div id="user-account-section" class="mb-6">
          {/* This will be populated by auth.js */}
        </div>

        {/* Navigation Links */}
        <div class="mb-6 pb-6 border-b-2 border-gray-200">
          <a
            href="/categories"
            class="w-full px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors font-medium border-2 border-indigo-200 flex items-center justify-center gap-2 mb-3"
            aria-label="資料一覧を開く"
          >
            <i class="fas fa-folder-open"></i>
            <span>資料一覧</span>
          </a>
          <a
            href="/calendar/1"
            class="w-full px-4 py-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg transition-colors font-medium border-2 border-pink-200 flex items-center justify-center gap-2 mb-3"
            aria-label="SNS運用カレンダーを開く"
          >
            <i class="fas fa-calendar-alt"></i>
            <span>SNS運用カレンダー</span>
          </a>
          <a
            href="/news"
            class="w-full px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors font-medium border-2 border-yellow-200 flex items-center justify-center gap-2 mb-3"
            aria-label="最新ニュースを開く"
          >
            <i class="fas fa-newspaper"></i>
            <span>最新ニュース</span>
          </a>
          <a
            href="/question-finder"
            class="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium border-2 border-blue-200 flex items-center justify-center gap-2 mb-3"
            aria-label="キーワードチェックを開く"
          >
            <i class="fas fa-search"></i>
            <span>キーワードチェック</span>
          </a>
          <a
            href="/infographics"
            class="w-full px-4 py-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg transition-colors font-medium border-2 border-pink-300 flex items-center justify-center gap-2 mb-3"
            aria-label="インフォグラフィック記事一覧を開く"
          >
            <i class="fas fa-chart-bar"></i>
            <span>インフォグラフィック</span>
          </a>
          <a
            href="/sns-faq"
            class="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors font-medium border-2 border-purple-200 flex items-center justify-center gap-2"
            aria-label="よくある質問を開く"
          >
            <i class="fas fa-question-circle"></i>
            <span>よくある質問</span>
          </a>
        </div>

        {/* Category Filter - Will be populated by app.js */}
        <div id="category-filter"></div>

        {/* Logout Button Section */}
        <div id="logout-section" class="mt-6 pt-6 border-t-2 border-gray-200">
          {/* This will be populated by auth.js when user is logged in */}
        </div>
      </div>
    </aside>
  )
}

/**
 * Get JWT secret from environment with fallback
 * @param c - Hono context
 * @returns JWT secret string
 */
function getJWTSecret(c: Context<{ Bindings: Bindings }>): string {
  return (c.env.JWT_SECRET && c.env.JWT_SECRET.trim() !== '') 
    ? c.env.JWT_SECRET 
    : 'your-super-secret-jwt-key-change-this-in-production'
}

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
      "https://www.google-analytics.com",
      "https://static.cloudflareinsights.com",
      "https://cloudflareinsights.com"
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
      "https://cdn.jsdelivr.net",
      "https://www.google-analytics.com",
      "https://www.googletagmanager.com",
      "https://static.cloudflareinsights.com", // Cloudflare Analytics
      "https://cloudflareinsights.com" // Cloudflare Analytics
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
  const secret = getJWTSecret(c)
  const token = await generateToken(secret)
  
  // Set cookie
  setAuthCookie(c, token)
  
  return c.json({ 
    success: true, 
    message: 'Login successful'
  })
})

// Logout API
app.post('/api/auth/logout', async (c) => {
  clearAuthCookie(c)
  return c.json({ success: true, message: 'Logout successful' })
})

// Check authentication status
app.get('/api/auth/check', async (c) => {
  const secret = getJWTSecret(c)
  const token = getAuthToken(c)
  const authenticated = await isAuthenticated(c, secret)
  
  return c.json({ 
    authenticated
  })
})

// Auth middleware for admin APIs
async function requireAuth(c: any, next: any) {
  const secret = getJWTSecret(c)
  const authenticated = await isAuthenticated(c, secret)
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  await next()
}

// ============================================
// API Routes - User Authentication (public)
// ============================================

// User registration - simplified (email only)
app.post('/api/user/register', async (c) => {
  try {
    const { email, name, password, usePasswordless } = await c.req.json()
    
    // Only email is required for registration
    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400)
    }
    
    // Check if user already exists
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first()
    
    if (existingUser) {
      return c.json({ error: 'User already exists with this email' }, 400)
    }
    
    // Create user with minimal info
    let passwordHash = null
    let loginMethod = 'magic_link'
    const userName = name || '' // Name is now optional
    
    if (!usePasswordless && password) {
      if (password.length < 6) {
        return c.json({ error: 'Password must be at least 6 characters' }, 400)
      }
      passwordHash = await hashPassword(password)
      loginMethod = 'password'
    }
    
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, name, password_hash, login_method) VALUES (?, ?, ?, ?)'
    ).bind(email, userName, passwordHash, loginMethod).run()
    
    const userId = result.meta.last_row_id as number
    
    // Send welcome email to user
    const displayName = userName || 'ユーザー'
    await sendEmail({
      to: email,
      subject: 'Akagami.net へようこそ！',
      html: getWelcomeEmailHtml(displayName),
      text: `こんにちは、${displayName}さん。Akagami.net の会員登録が完了しました！`
    }, c.env)
    
    // Note: Admin notification will be sent once daily via Cron job
    
    // Generate session token
    const secret = getJWTSecret(c)
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
    const secret = getJWTSecret(c)
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
      subject: 'Akagami.net ログインリンク',
      html: getMagicLinkEmailHtml(user.name as string, magicLink),
      text: `こんにちは、${user.name}さん。ログインリンク: ${magicLink} （15分間有効）`
    }, c.env)
    
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
    const secret = getJWTSecret(c)
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
  const secret = getJWTSecret(c)
  const currentUser = await getCurrentUser(c, secret)
  
  if (!currentUser) {
    return c.json({ authenticated: false })
  }
  
  // Get user details
  const user = await c.env.DB.prepare(`
    SELECT 
      id, email, name, location, birthday, login_method, created_at, last_login,
      youtube_url, instagram_handle, tiktok_handle, twitter_handle,
      profile_photo_url
    FROM users 
    WHERE id = ?
  `).bind(currentUser.userId).first()
  
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
      location: user.location,
      birthday: user.birthday,
      loginMethod: user.login_method,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      youtubeUrl: user.youtube_url,
      instagramHandle: user.instagram_handle,
      tiktokHandle: user.tiktok_handle,
      twitterHandle: user.twitter_handle,
      profilePhotoUrl: user.profile_photo_url
    }
  })
})

// ============================================
// API Routes - User Data Sync (protected)
// ============================================

// User auth middleware
async function requireUserAuth(c: any, next: any) {
  const secret = getJWTSecret(c)
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

// Update user profile
// Update user profile
app.put('/api/user/profile', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const body = await c.req.json()
    const { 
      name, 
      location,
      birthday,
      youtubeUrl, 
      instagramHandle, 
      tiktokHandle, 
      twitterHandle 
    } = body
    
    console.log('Profile update request:', { 
      userId, 
      hasName: !!name, 
      bodyKeys: Object.keys(body) 
    })
    
    // Validate birthday format if provided (YYYY-MM-DD)
    if (birthday && !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      console.error('Invalid birthday format:', birthday)
      return c.json({ error: 'Invalid birthday format. Use YYYY-MM-DD' }, 400)
    }
    
    // Build dynamic UPDATE query - only update fields that are provided
    const updates: string[] = []
    const values: any[] = []
    
    if (name !== undefined) {
      updates.push('name = ?')
      values.push(name || null)
    }
    if (location !== undefined) {
      updates.push('location = ?')
      values.push(location || null)
    }
    if (birthday !== undefined) {
      updates.push('birthday = ?')
      values.push(birthday || null)
    }
    if (youtubeUrl !== undefined) {
      updates.push('youtube_url = ?')
      values.push(youtubeUrl || null)
    }
    if (instagramHandle !== undefined) {
      updates.push('instagram_handle = ?')
      values.push(instagramHandle || null)
    }
    if (tiktokHandle !== undefined) {
      updates.push('tiktok_handle = ?')
      values.push(tiktokHandle || null)
    }
    if (twitterHandle !== undefined) {
      updates.push('twitter_handle = ?')
      values.push(twitterHandle || null)
    }
    
    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400)
    }
    
    // Add userId at the end
    values.push(userId)
    
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
    console.log('Update query:', query, 'Values count:', values.length)
    
    const result = await c.env.DB.prepare(query).bind(...values).run()
    
    console.log('Profile updated:', { userId, changes: result.meta.changes })
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Update profile error:', error)
    return c.json({ error: error.message || 'Failed to update profile' }, 500)
  }
})

// Update user profile photo
app.put('/api/user/profile-photo', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const { photoUrl } = await c.req.json()
    
    if (!photoUrl) {
      return c.json({ error: 'Photo URL is required' }, 400)
    }
    
    // Basic validation for base64 or URL
    if (!photoUrl.startsWith('data:image/') && !photoUrl.startsWith('http')) {
      return c.json({ error: 'Invalid photo URL format' }, 400)
    }
    
    await c.env.DB.prepare(`
      UPDATE users 
      SET profile_photo_url = ?
      WHERE id = ?
    `).bind(photoUrl, userId).run()
    
    return c.json({ success: true })
  } catch (error: any) {
    console.error('Update profile photo error:', error)
    return c.json({ error: 'Failed to update profile photo' }, 500)
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

// Get user statistics for dashboard
app.get('/api/user/stats', requireUserAuth, async (c) => {
  try {
    const userId = c.get('userId')
    
    // Get download count per month (last 6 months)
    const { results: monthlyDownloads } = await c.env.DB.prepare(`
      SELECT 
        strftime('%Y-%m', downloaded_at) as month,
        COUNT(*) as count
      FROM user_downloads
      WHERE user_id = ?
        AND downloaded_at >= datetime('now', '-6 months')
      GROUP BY month
      ORDER BY month ASC
    `).bind(userId).all()
    
    // Get download count by category
    const { results: categoryDownloads } = await c.env.DB.prepare(`
      SELECT 
        c.name as category,
        COUNT(ud.id) as count
      FROM user_downloads ud
      JOIN pdfs p ON ud.pdf_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE ud.user_id = ?
      GROUP BY c.id, c.name
      ORDER BY count DESC
      LIMIT 10
    `).bind(userId).all()
    
    // Get favorite count by category
    const { results: categoryFavorites } = await c.env.DB.prepare(`
      SELECT 
        c.name as category,
        COUNT(uf.pdf_id) as count
      FROM user_favorites uf
      JOIN pdfs p ON uf.pdf_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE uf.user_id = ?
      GROUP BY c.id, c.name
      ORDER BY count DESC
      LIMIT 10
    `).bind(userId).all()
    
    // Get weekly activity (last 7 days)
    const { results: weeklyActivity } = await c.env.DB.prepare(`
      SELECT 
        strftime('%w', downloaded_at) as day_of_week,
        COUNT(*) as count
      FROM user_downloads
      WHERE user_id = ?
        AND downloaded_at >= datetime('now', '-7 days')
      GROUP BY day_of_week
      ORDER BY day_of_week ASC
    `).bind(userId).all()
    
    // Get recent activity trend (downloads per day for last 30 days)
    const { results: dailyActivity } = await c.env.DB.prepare(`
      SELECT 
        date(downloaded_at) as date,
        COUNT(*) as count
      FROM user_downloads
      WHERE user_id = ?
        AND downloaded_at >= datetime('now', '-30 days')
      GROUP BY date
      ORDER BY date ASC
    `).bind(userId).all()
    
    return c.json({
      monthlyDownloads,
      categoryDownloads,
      categoryFavorites,
      weeklyActivity,
      dailyActivity
    })
  } catch (error: any) {
    console.error('Get user stats error:', error)
    return c.json({ error: 'Failed to get user statistics' }, 500)
  }
})

// ============================================
// API Routes - Reviews (protected)
// ============================================

// Get reviews for a PDF
app.get('/api/pdfs/:id/reviews', async (c) => {
  try {
    const pdfId = parseInt(c.req.param('id'))
    
    const { results: reviews } = await c.env.DB.prepare(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        r.updated_at,
        u.name as user_name,
        u.id as user_id,
        (SELECT COUNT(*) FROM review_helpful WHERE review_id = r.id) as helpful_count
      FROM pdf_reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.pdf_id = ?
      ORDER BY r.created_at DESC
    `).bind(pdfId).all()
    
    return c.json(reviews)
  } catch (error: any) {
    console.error('Get reviews error:', error)
    return c.json({ error: 'Failed to get reviews' }, 500)
  }
})

// Create or update a review
app.post('/api/pdfs/:id/reviews', requireUserAuth, async (c) => {
  try {
    const pdfId = parseInt(c.req.param('id'))
    const userId = c.get('userId')
    const { rating, comment } = await c.req.json()
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return c.json({ error: 'Rating must be between 1 and 5' }, 400)
    }
    
    // Check if review already exists
    const existing = await c.env.DB.prepare(`
      SELECT id FROM pdf_reviews WHERE pdf_id = ? AND user_id = ?
    `).bind(pdfId, userId).first()
    
    if (existing) {
      // Update existing review
      await c.env.DB.prepare(`
        UPDATE pdf_reviews 
        SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP
        WHERE pdf_id = ? AND user_id = ?
      `).bind(rating, comment || null, pdfId, userId).run()
    } else {
      // Create new review
      await c.env.DB.prepare(`
        INSERT INTO pdf_reviews (pdf_id, user_id, rating, comment)
        VALUES (?, ?, ?, ?)
      `).bind(pdfId, userId, rating, comment || null).run()
    }
    
    // Update PDF average rating and review count
    await updatePdfRating(c.env.DB, pdfId)
    
    return c.json({ success: true, message: existing ? 'Review updated' : 'Review created' })
  } catch (error: any) {
    console.error('Create/update review error:', error)
    return c.json({ error: 'Failed to save review' }, 500)
  }
})

// Delete a review
app.delete('/api/pdfs/:id/reviews', requireUserAuth, async (c) => {
  try {
    const pdfId = parseInt(c.req.param('id'))
    const userId = c.get('userId')
    
    const result = await c.env.DB.prepare(`
      DELETE FROM pdf_reviews WHERE pdf_id = ? AND user_id = ?
    `).bind(pdfId, userId).run()
    
    if (result.meta.changes === 0) {
      return c.json({ error: 'Review not found' }, 404)
    }
    
    // Update PDF average rating and review count
    await updatePdfRating(c.env.DB, pdfId)
    
    return c.json({ success: true, message: 'Review deleted' })
  } catch (error: any) {
    console.error('Delete review error:', error)
    return c.json({ error: 'Failed to delete review' }, 500)
  }
})

// Mark review as helpful
app.post('/api/reviews/:id/helpful', requireUserAuth, async (c) => {
  try {
    const reviewId = parseInt(c.req.param('id'))
    const userId = c.get('userId')
    
    // Check if already marked as helpful
    const existing = await c.env.DB.prepare(`
      SELECT 1 FROM review_helpful WHERE review_id = ? AND user_id = ?
    `).bind(reviewId, userId).first()
    
    if (existing) {
      // Remove helpful vote
      await c.env.DB.prepare(`
        DELETE FROM review_helpful WHERE review_id = ? AND user_id = ?
      `).bind(reviewId, userId).run()
      return c.json({ success: true, action: 'removed' })
    } else {
      // Add helpful vote
      await c.env.DB.prepare(`
        INSERT INTO review_helpful (review_id, user_id) VALUES (?, ?)
      `).bind(reviewId, userId).run()
      return c.json({ success: true, action: 'added' })
    }
  } catch (error: any) {
    console.error('Mark helpful error:', error)
    return c.json({ error: 'Failed to mark as helpful' }, 500)
  }
})

// Get user's review for a PDF
app.get('/api/pdfs/:id/my-review', requireUserAuth, async (c) => {
  try {
    const pdfId = parseInt(c.req.param('id'))
    const userId = c.get('userId')
    
    const review = await c.env.DB.prepare(`
      SELECT id, rating, comment, created_at, updated_at
      FROM pdf_reviews
      WHERE pdf_id = ? AND user_id = ?
    `).bind(pdfId, userId).first()
    
    if (!review) {
      return c.json({ hasReview: false })
    }
    
    return c.json({ hasReview: true, review })
  } catch (error: any) {
    console.error('Get my review error:', error)
    return c.json({ error: 'Failed to get review' }, 500)
  }
})

// Helper function to update PDF rating
async function updatePdfRating(db: any, pdfId: number) {
  const stats = await db.prepare(`
    SELECT 
      AVG(rating) as avg_rating,
      COUNT(*) as review_count
    FROM pdf_reviews
    WHERE pdf_id = ?
  `).bind(pdfId).first()
  
  await db.prepare(`
    UPDATE pdfs 
    SET average_rating = ?, review_count = ?
    WHERE id = ?
  `).bind(
    stats.avg_rating || 0,
    stats.review_count || 0,
    pdfId
  ).run()
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

// Get all registered users (admin only)
app.get('/api/analytics/users', requireAuth, async (c) => {
  try {
    const { results: users } = await c.env.DB.prepare(`
      SELECT 
        id,
        email,
        name,
        login_method,
        created_at,
        last_login
      FROM users
      ORDER BY created_at DESC
    `).all()
    
    return c.json(users)
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

// Get all PDFs with filters (Optimized - Single Query with GROUP_CONCAT + Infographic Articles)
app.get('/api/pdfs', async (c) => {
  const category = c.req.query('category')
  const tag = c.req.query('tag')
  const search = c.req.query('search')
  
  // Build WHERE conditions for both PDFs and infographic articles
  const pdfConditions = []
  const infographicConditions = ['ia.published = 1'] // Only show published infographic articles
  const bindings: any[] = []
  
  if (category) {
    pdfConditions.push('p.category_id = ?')
    infographicConditions.push('ia.category_id = ?')
    bindings.push(category, category) // Need to bind twice for UNION
  }
  
  if (tag) {
    pdfConditions.push('pt.tag_id = ?')
    bindings.push(tag)
  }
  
  if (search) {
    pdfConditions.push('(p.title LIKE ? OR p.description LIKE ?)')
    infographicConditions.push('(ia.title LIKE ? OR ia.summary LIKE ?)')
    const searchPattern = `%${search}%`
    bindings.push(searchPattern, searchPattern, searchPattern, searchPattern)
  }
  
  // Query for PDFs
  let pdfQuery = `
    SELECT 
      'pdf' as source_type,
      p.id, 
      p.title, 
      p.google_drive_url,
      NULL as slug,
      NULL as thumbnail_url,
      NULL as summary,
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
  
  if (pdfConditions.length > 0) {
    pdfQuery += ' WHERE ' + pdfConditions.join(' AND ')
  }
  
  pdfQuery += ' GROUP BY p.id'
  
  // Query for Infographic Articles
  let infographicQuery = `
    SELECT 
      'infographic' as source_type,
      ia.id,
      ia.title,
      NULL as google_drive_url,
      ia.slug,
      ia.thumbnail_url,
      ia.summary,
      ia.category_id,
      0 as download_count,
      ia.created_at,
      c.name as category_name,
      NULL as tags_concat
    FROM infographic_articles ia
    LEFT JOIN categories c ON ia.category_id = c.id
  `
  
  if (infographicConditions.length > 0) {
    infographicQuery += ' WHERE ' + infographicConditions.join(' AND ')
  }
  
  // Combine both queries with UNION ALL and wrap for sorting
  const finalQuery = `
    SELECT * FROM (
      ${pdfQuery}
      UNION ALL
      ${infographicQuery}
    ) AS combined
    ORDER BY combined.created_at DESC
  `
  
  const { results } = await c.env.DB.prepare(finalQuery).bind(...bindings).all()
  
  // Parse tags from concatenated string for PDFs
  for (const item of results as any[]) {
    if (item.tags_concat) {
      item.tags = item.tags_concat.split('||').map((tagStr: string) => {
        const [id, name] = tagStr.split(':')
        return { id: parseInt(id), name }
      })
      delete item.tags_concat
    } else {
      item.tags = []
    }
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
      await sendEmail({
        to: subscriber.email,
        subject: `[Akagami.net] ${categoryName}カテゴリに新しい資料が追加されました`,
        html: getNewPdfNotificationEmailHtml(
          subscriber.name,
          title,
          categoryName,
          google_drive_url
        ),
        text: `こんにちは、${subscriber.name}さん。\n\n${categoryName}カテゴリに新しい資料「${title}」が追加されました。\n\n今すぐチェック: ${google_drive_url}`
      }, c.env)
      
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

// ==========================================
// News Articles API Routes
// ==========================================

// Get all news articles (public)
app.get('/api/news', async (c) => {
  const { category } = c.req.query()
  
  let query = 'SELECT * FROM news_articles'
  const params: any[] = []
  
  if (category && category !== 'all') {
    query += ' WHERE category = ?'
    params.push(category)
  }
  
  query += ' ORDER BY published_at DESC LIMIT 50'
  
  const stmt = c.env.DB.prepare(query)
  if (params.length > 0) {
    stmt.bind(...params)
  }
  
  const { results } = await stmt.all()
  return c.json(results)
})

// Get single news article (public)
app.get('/api/news/:id', async (c) => {
  const id = c.req.param('id')
  
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM news_articles WHERE id = ?'
  ).bind(id).all()
  
  if (results.length === 0) {
    return c.json({ error: 'News article not found' }, 404)
  }
  
  return c.json(results[0])
})

// Create news article (protected - admin only)
app.post('/api/news', requireAuth, async (c) => {
  const { title, summary, url, category, language, published_at } = await c.req.json()
  
  // Validation
  if (!title || !summary || !url || !category || !language) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  
  // Valid categories
  const validCategories = ['SNS', 'AI', 'テクノロジー', 'マーケティング']
  if (!validCategories.includes(category)) {
    return c.json({ error: 'Invalid category' }, 400)
  }
  
  // Valid languages
  const validLanguages = ['en', 'ja']
  if (!validLanguages.includes(language)) {
    return c.json({ error: 'Invalid language' }, 400)
  }
  
  const result = await c.env.DB.prepare(`
    INSERT INTO news_articles (title, summary, url, category, language, published_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    title,
    summary,
    url,
    category,
    language,
    published_at || new Date().toISOString()
  ).run()
  
  return c.json({ 
    success: true, 
    id: result.meta.last_row_id 
  })
})

// Update news article (protected - admin only)
app.put('/api/news/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  const { title, summary, url, category, language, published_at } = await c.req.json()
  
  // Validation
  if (!title || !summary || !url || !category || !language) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  
  // Valid categories
  const validCategories = ['SNS', 'AI', 'テクノロジー', 'マーケティング']
  if (!validCategories.includes(category)) {
    return c.json({ error: 'Invalid category' }, 400)
  }
  
  // Valid languages
  const validLanguages = ['en', 'ja']
  if (!validLanguages.includes(language)) {
    return c.json({ error: 'Invalid language' }, 400)
  }
  
  await c.env.DB.prepare(`
    UPDATE news_articles 
    SET title = ?, summary = ?, url = ?, category = ?, language = ?, 
        published_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    title,
    summary,
    url,
    category,
    language,
    published_at || new Date().toISOString(),
    id
  ).run()
  
  return c.json({ success: true })
})

// Delete news article (protected - admin only)
app.delete('/api/news/:id', requireAuth, async (c) => {
  const id = c.req.param('id')
  
  await c.env.DB.prepare(
    'DELETE FROM news_articles WHERE id = ?'
  ).bind(id).run()
  
  return c.json({ success: true })
})

// ============================================
// News Likes API Endpoints
// ============================================

// Get likes count for a news article
app.get('/api/news/:id/likes', async (c) => {
  const newsId = c.req.param('id')
  
  const { results } = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM news_likes WHERE news_id = ?'
  ).bind(newsId).all()
  
  return c.json({ count: results[0]?.count || 0 })
})

// Get all news with likes count and user's like status
app.get('/api/news-with-likes', async (c) => {
  try {
    // Check if DB is available
    if (!c.env?.DB) {
      console.error('[NEWS API] D1 database binding not found!')
      return c.json({ 
        error: 'Database not configured. Please add D1 binding in Cloudflare Dashboard.',
        instructions: 'Go to Cloudflare Dashboard → Pages → akagami-research → Settings → Functions → D1 database bindings → Add binding (Variable name: DB, D1 database: akagami-research-production)'
      }, 500)
    }
    
    const { category } = c.req.query()
    
    // Get current user if authenticated
    const currentUser = await getCurrentUser(c, getJWTSecret(c))
    const userId = currentUser?.userId || null
    
    // First, check if news_likes table exists
    let hasLikesTable = false
    try {
      await c.env.DB.prepare('SELECT 1 FROM news_likes LIMIT 1').all()
      hasLikesTable = true
    } catch (e) {
      console.warn('[NEWS API] news_likes table does not exist, falling back to simple query')
    }
    
    let query: string
    let params: any[] = []
    
    if (hasLikesTable) {
      // Use full query with likes if table exists
      query = `
        SELECT 
          n.*,
          COUNT(DISTINCT nl.id) as likes_count,
          ${userId ? `MAX(CASE WHEN nl.user_id = ? THEN 1 ELSE 0 END) as user_liked` : '0 as user_liked'}
        FROM news_articles n
        LEFT JOIN news_likes nl ON n.id = nl.news_id
      `
      if (userId) {
        params.push(userId)
      }
      
      if (category && category !== 'all') {
        query += ' WHERE n.category = ?'
        params.push(category)
      }
      
      query += ' GROUP BY n.id ORDER BY n.published_at DESC LIMIT 50'
    } else {
      // Fallback query without likes
      query = `
        SELECT 
          n.*,
          0 as likes_count,
          0 as user_liked
        FROM news_articles n
      `
      
      if (category && category !== 'all') {
        query += ' WHERE n.category = ?'
        params.push(category)
      }
      
      query += ' ORDER BY n.published_at DESC LIMIT 50'
    }
    
    const stmt = c.env.DB.prepare(query)
    if (params.length > 0) {
      stmt.bind(...params)
    }
    
    const { results } = await stmt.all()
    return c.json(results)
  } catch (error) {
    console.error('[NEWS API] Error:', error)
    return c.json({ 
      error: 'Failed to load news',
      message: error instanceof Error ? error.message : String(error)
    }, 500)
  }
})

// Toggle like for a news article (requires authentication)
app.post('/api/news/:id/like', async (c) => {
  const newsId = c.req.param('id')
  
  // Get current user
  const currentUser = await getCurrentUser(c, getJWTSecret(c))
  if (!currentUser) {
    return c.json({ error: 'Authentication required' }, 401)
  }
  
  const userId = currentUser.userId
  
  // Check if already liked
  const { results: existing } = await c.env.DB.prepare(
    'SELECT id FROM news_likes WHERE news_id = ? AND user_id = ?'
  ).bind(newsId, userId).all()
  
  if (existing.length > 0) {
    // Unlike
    await c.env.DB.prepare(
      'DELETE FROM news_likes WHERE news_id = ? AND user_id = ?'
    ).bind(newsId, userId).run()
    
    return c.json({ liked: false, message: 'Unliked' })
  } else {
    // Like
    await c.env.DB.prepare(
      'INSERT INTO news_likes (news_id, user_id) VALUES (?, ?)'
    ).bind(newsId, userId).run()
    
    return c.json({ liked: true, message: 'Liked' })
  }
})

// ============================================
// Instagram FAQ API Endpoints
// ============================================

// Get all FAQ items (published only for public)
app.get('/api/instagram-faq', async (c) => {
  try {
    const category = c.req.query('category') || 'instagram'
    
    const { results } = await c.env.DB.prepare(`
      SELECT id, question, answer, sort_order, is_published, sns_category, created_at, updated_at
      FROM instagram_faq
      WHERE is_published = 1 AND sns_category = ?
      ORDER BY sort_order ASC, id ASC
    `).bind(category).all()
    
    return c.json(results)
  } catch (error) {
    console.error('Failed to fetch FAQ:', error)
    return c.json({ error: 'Failed to fetch FAQ' }, 500)
  }
})

// Get all FAQ items for admin (including unpublished)
app.get('/api/admin/instagram-faq', requireAuth, async (c) => {
  try {
    const category = c.req.query('category') || 'all'
    
    let query = `
      SELECT id, question, answer, sort_order, is_published, sns_category, created_at, updated_at
      FROM instagram_faq
    `
    
    if (category !== 'all') {
      query += ` WHERE sns_category = ?`
    }
    
    query += ` ORDER BY sns_category ASC, sort_order ASC, id ASC`
    
    const stmt = category !== 'all' 
      ? c.env.DB.prepare(query).bind(category)
      : c.env.DB.prepare(query)
    
    const { results } = await stmt.all()
    
    return c.json(results)
  } catch (error) {
    console.error('Failed to fetch FAQ:', error)
    return c.json({ error: 'Failed to fetch FAQ' }, 500)
  }
})

// Create new FAQ item
app.post('/api/admin/instagram-faq', requireAuth, async (c) => {
  try {
    const { question, answer, sort_order, is_published, sns_category } = await c.req.json()
    
    if (!question || !answer) {
      return c.json({ error: 'Question and answer are required' }, 400)
    }
    
    const result = await c.env.DB.prepare(`
      INSERT INTO instagram_faq (question, answer, sort_order, is_published, sns_category)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      question,
      answer,
      sort_order || 0,
      is_published !== undefined ? (is_published ? 1 : 0) : 1,
      sns_category || 'instagram'
    ).run()
    
    return c.json({ 
      success: true, 
      id: result.meta.last_row_id,
      message: 'FAQ created successfully'
    })
  } catch (error) {
    console.error('Failed to create FAQ:', error)
    return c.json({ error: 'Failed to create FAQ' }, 500)
  }
})

// Update FAQ item
app.put('/api/admin/instagram-faq/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id')
    const { question, answer, sort_order, is_published, sns_category } = await c.req.json()
    
    if (!question || !answer) {
      return c.json({ error: 'Question and answer are required' }, 400)
    }
    
    await c.env.DB.prepare(`
      UPDATE instagram_faq
      SET question = ?, answer = ?, sort_order = ?, is_published = ?, sns_category = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      question,
      answer,
      sort_order || 0,
      is_published !== undefined ? (is_published ? 1 : 0) : 1,
      sns_category || 'instagram',
      id
    ).run()
    
    return c.json({ 
      success: true,
      message: 'FAQ updated successfully'
    })
  } catch (error) {
    console.error('Failed to update FAQ:', error)
    return c.json({ error: 'Failed to update FAQ' }, 500)
  }
})

// Delete FAQ item
app.delete('/api/admin/instagram-faq/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id')
    
    await c.env.DB.prepare(`
      DELETE FROM instagram_faq WHERE id = ?
    `).bind(id).run()
    
    return c.json({ 
      success: true,
      message: 'FAQ deleted successfully'
    })
  } catch (error) {
    console.error('Failed to delete FAQ:', error)
    return c.json({ error: 'Failed to delete FAQ' }, 500)
  }
})

// ============================================
// Infographic Articles API
// ============================================

// Get all published articles (public)
app.get('/api/articles', async (c) => {
  try {
    const categoryId = c.req.query('category')
    
    let query = `
      SELECT 
        ia.id, ia.title, ia.slug, ia.category_id, ia.thumbnail_url, 
        ia.summary, ia.sort_order, ia.created_at, ia.updated_at,
        cat.name as category_name
      FROM infographic_articles ia
      LEFT JOIN categories cat ON ia.category_id = cat.id
      WHERE ia.published = 1
    `
    
    if (categoryId) {
      query += ` AND ia.category_id = ?`
    }
    
    query += ` ORDER BY ia.sort_order ASC, ia.created_at DESC`
    
    const stmt = categoryId 
      ? c.env.DB.prepare(query).bind(categoryId)
      : c.env.DB.prepare(query)
    
    const { results } = await stmt.all()
    
    return c.json(results)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return c.json({ error: 'Failed to fetch articles' }, 500)
  }
})

// Get single article by slug (public)
app.get('/api/articles/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    
    const { results } = await c.env.DB.prepare(`
      SELECT 
        ia.id, ia.title, ia.slug, ia.category_id, ia.thumbnail_url,
        ia.content, ia.summary, ia.created_at, ia.updated_at,
        cat.name as category_name
      FROM infographic_articles ia
      LEFT JOIN categories cat ON ia.category_id = cat.id
      WHERE ia.slug = ? AND ia.published = 1
    `).bind(slug).all()
    
    if (!results || results.length === 0) {
      return c.json({ error: 'Article not found' }, 404)
    }
    
    return c.json(results[0])
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return c.json({ error: 'Failed to fetch article' }, 500)
  }
})

// Get all articles for admin (including unpublished)
app.get('/api/admin/articles', requireAuth, async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        ia.id, ia.title, ia.slug, ia.category_id, ia.thumbnail_url,
        ia.summary, ia.published, ia.sort_order, ia.created_at, ia.updated_at,
        cat.name as category_name
      FROM infographic_articles ia
      LEFT JOIN categories cat ON ia.category_id = cat.id
      ORDER BY ia.sort_order ASC, ia.created_at DESC
    `).all()
    
    return c.json(results)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    return c.json({ error: 'Failed to fetch articles' }, 500)
  }
})

// Get single article by ID for admin
app.get('/api/admin/articles/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id')
    
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM infographic_articles WHERE id = ?
    `).bind(id).all()
    
    if (!results || results.length === 0) {
      return c.json({ error: 'Article not found' }, 404)
    }
    
    return c.json(results[0])
  } catch (error) {
    console.error('Failed to fetch article:', error)
    return c.json({ error: 'Failed to fetch article' }, 500)
  }
})

// Create new article
app.post('/api/admin/articles', requireAuth, async (c) => {
  try {
    const { title, slug, category_id, thumbnail_url, content, summary, published, sort_order } = await c.req.json()
    
    if (!title || !slug || !content) {
      return c.json({ error: 'Title, slug, and content are required' }, 400)
    }
    
    const result = await c.env.DB.prepare(`
      INSERT INTO infographic_articles 
      (title, slug, category_id, thumbnail_url, content, summary, published, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      title,
      slug,
      category_id || null,
      thumbnail_url || '',
      content,
      summary || '',
      published !== undefined ? (published ? 1 : 0) : 0,
      sort_order || 0
    ).run()
    
    return c.json({ 
      success: true,
      id: result.meta.last_row_id,
      message: 'Article created successfully'
    })
  } catch (error) {
    console.error('Failed to create article:', error)
    
    if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
      return c.json({ error: 'Slug already exists. Please use a different slug.' }, 400)
    }
    
    return c.json({ error: 'Failed to create article' }, 500)
  }
})

// Update article
app.put('/api/admin/articles/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id')
    const { title, slug, category_id, thumbnail_url, content, summary, published, sort_order } = await c.req.json()
    
    if (!title || !slug || !content) {
      return c.json({ error: 'Title, slug, and content are required' }, 400)
    }
    
    await c.env.DB.prepare(`
      UPDATE infographic_articles 
      SET title = ?, slug = ?, category_id = ?, thumbnail_url = ?, 
          content = ?, summary = ?, published = ?, sort_order = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      title,
      slug,
      category_id || null,
      thumbnail_url || '',
      content,
      summary || '',
      published !== undefined ? (published ? 1 : 0) : 0,
      sort_order || 0,
      id
    ).run()
    
    return c.json({ 
      success: true,
      message: 'Article updated successfully'
    })
  } catch (error) {
    console.error('Failed to update article:', error)
    
    if (error instanceof Error && error.message.includes('UNIQUE constraint')) {
      return c.json({ error: 'Slug already exists. Please use a different slug.' }, 400)
    }
    
    return c.json({ error: 'Failed to update article' }, 500)
  }
})

// Delete article
app.delete('/api/admin/articles/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id')
    
    await c.env.DB.prepare(`
      DELETE FROM infographic_articles WHERE id = ?
    `).bind(id).run()
    
    return c.json({ 
      success: true,
      message: 'Article deleted successfully'
    })
  } catch (error) {
    console.error('Failed to delete article:', error)
    return c.json({ error: 'Failed to delete article' }, 500)
  }
})

// Google Suggest Proxy API (for question finder)
app.get('/api/suggest', async (c) => {
  const keyword = c.req.query('q')
  
  if (!keyword) {
    return c.json({ error: 'Missing keyword parameter' }, 400)
  }
  
  try {
    // Google Suggest API (Firefox client)
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(keyword)}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      return c.json({ error: 'Failed to fetch suggestions', suggestions: [] }, 500)
    }
    
    const data = await response.json()
    
    // Google Suggest returns [keyword, [suggestions]]
    const suggestions = Array.isArray(data) && data.length > 1 ? data[1] : []
    
    return c.json({ 
      keyword,
      suggestions: suggestions.slice(0, 10) // Top 10 suggestions
    })
  } catch (error) {
    console.error('Google Suggest error:', error)
    return c.json({ error: 'Failed to fetch suggestions', suggestions: [] }, 500)
  }
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
    title: "YouTube資料 - Akagami.net",
    description: "YouTubeマーケティング・運用・戦略に関する資料を無料で公開。チャンネル運営、動画制作、収益化、SEO対策など、YouTube攻略のノウハウが満載。",
    keywords: "YouTube,YouTubeマーケティング,動画制作,チャンネル運営,収益化,YouTube SEO"
  },
  2: {
    name: "Threads資料",
    title: "Threads資料 - Akagami.net",
    description: "Threadsマーケティング・運用戦略に関する資料を無料で公開。Meta社の新SNS「Threads」の効果的な活用方法、フォロワー獲得術を解説。",
    keywords: "Threads,Threadsマーケティング,Meta,SNS運用,フォロワー獲得"
  },
  3: {
    name: "Podcast資料",
    title: "Podcast資料 - Akagami.net",
    description: "ポッドキャストマーケティング・配信戦略に関する資料を無料で公開。音声メディアの活用方法、収益化、リスナー獲得のノウハウを提供。",
    keywords: "Podcast,ポッドキャスト,音声配信,音声マーケティング,リスナー獲得"
  },
  4: {
    name: "LINE公式資料",
    title: "LINE公式資料 - Akagami.net",
    description: "LINE公式アカウントのマーケティング・運用戦略に関する資料を無料で公開。友だち獲得、メッセージ配信、自動応答の活用方法を解説。",
    keywords: "LINE公式,LINE公式アカウント,LINEマーケティング,友だち獲得,メッセージ配信"
  },
  5: {
    name: "Instagram資料",
    title: "Instagram資料 - Akagami.net",
    description: "Instagramマーケティング・運用戦略に関する資料を無料で公開。投稿戦略、リール活用、フォロワー増加、ストーリーズ運用など実践的なノウハウが満載。",
    keywords: "Instagram,インスタグラム,Instagramマーケティング,リール,ストーリーズ,フォロワー増加"
  },
  6: {
    name: "TikTok資料",
    title: "TikTok資料 - Akagami.net",
    description: "TikTokマーケティング・運用戦略に関する資料を無料で公開。バズる動画の作り方、アルゴリズム攻略、フォロワー獲得の実践的なノウハウを提供。",
    keywords: "TikTok,TikTokマーケティング,ショート動画,バズる方法,TikTokアルゴリズム"
  },
  7: {
    name: "X (旧Twitter) 資料",
    title: "X (旧Twitter) 資料 - Akagami.net",
    description: "X (旧Twitter) のマーケティング・運用戦略に関する資料を無料で公開。投稿戦略、エンゲージメント向上、フォロワー獲得の実践的なノウハウを解説。",
    keywords: "X,Twitter,Xマーケティング,Twitterマーケティング,SNS運用,フォロワー獲得"
  },
  8: {
    name: "マーケティング資料",
    title: "マーケティング資料 - Akagami.net",
    description: "デジタルマーケティング・SNSマーケティングに関する資料を無料で公開。戦略立案、分析手法、広告運用、コンテンツマーケティングの実践ノウハウを提供。",
    keywords: "マーケティング,デジタルマーケティング,SNSマーケティング,広告運用,コンテンツマーケティング"
  },
  9: {
    name: "その他資料",
    title: "その他資料 - Akagami.net",
    description: "SNSマーケティング全般に関する資料を無料で公開。トレンド情報、ツール紹介、分析手法など、幅広いマーケティング情報を提供。",
    keywords: "SNSマーケティング,マーケティングツール,トレンド,分析手法"
  },
  10: {
    name: "生成AI資料",
    title: "生成AI資料 - Akagami.net",
    description: "生成AI・ChatGPT活用に関する資料を無料で公開。AIツールの使い方、プロンプトエンジニアリング、業務効率化の実践方法を解説。",
    keywords: "生成AI,ChatGPT,AI活用,プロンプトエンジニアリング,業務効率化,AIツール"
  },
  11: {
    title: "画像&動画生成資料 - Akagami.net",
    description: "AI画像生成・動画生成ツールの活用方法に関する資料を無料で公開。Midjourney、Stable Diffusion、動画生成AIの実践的な使い方を解説。",
    keywords: "AI画像生成,AI動画生成,Midjourney,Stable Diffusion,生成AI"
  },
  19: {
    title: "note資料 - Akagami.net",
    description: "noteマーケティング・記事作成に関する資料を無料で公開。記事の書き方、フォロワー獲得、収益化、SEO対策など実践的なノウハウを提供。",
    keywords: "note,noteマーケティング,記事作成,ライティング,収益化"
  },
  20: {
    title: "ブログ資料 - Akagami.net",
    description: "ブログマーケティング・SEO対策に関する資料を無料で公開。記事の書き方、アクセスアップ、収益化の実践的なノウハウを解説。",
    keywords: "ブログ,ブログマーケティング,SEO対策,アクセスアップ,収益化"
  },
  22: {
    title: "AEO対策資料 - Akagami.net",
    description: "AEO（Answer Engine Optimization）対策に関する資料を無料で公開。AI検索エンジン最適化、ChatGPT・Perplexity対策の実践方法を解説。",
    keywords: "AEO,Answer Engine Optimization,AI検索,ChatGPT,Perplexity,検索最適化"
  }
}

// Home page (public view)
// ============================================
// Monthly Calendar Page Route (February)
// ============================================
app.get('/calendar/2', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
        {/* Month Navigation - Horizontal Scroll */}
        <div class="mb-6 overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 min-w-max pb-2">
            <a href="/calendar/1" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
            <a href="/calendar/2" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
            <a href="/calendar/3" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
            <a href="/calendar/4" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
            <a href="/calendar/5" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
            <a href="/calendar/6" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
            <a href="/calendar/7" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
            <a href="/calendar/8" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
            <a href="/calendar/9" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
            <a href="/calendar/10" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
            <a href="/calendar/11" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
            <a href="/calendar/12" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
          </div>
        </div>


        {/* 毎年2月に流行るもの */}
        <div class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
          <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i class="fas fa-fire text-orange-500"></i>
            毎年2月に流行るもの
          </h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            バレンタインデー関連（チョコレート・ラッピング）、節分（恵方巻・豆まき）、冬の受験シーズン（応援メッセージ）、猫の日（2/22）、確定申告シーズン
          </p>
        </div>
        {/* イベント＆投稿ネタ 3カラム */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* イベント */}
          <div class="bg-gradient-to-b from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-calendar-day text-red-500 text-xs"></i>
              主要イベント
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">2/3</span>
                <span class="text-gray-700">節分</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">2/11</span>
                <span class="text-gray-700">建国記念の日</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">2/14</span>
                <span class="text-gray-700">バレンタインデー</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">2/22</span>
                <span class="text-gray-700">猫の日</span>
              </div>
            </div>
          </div>

          {/* みんなが見るテレビ */}
          <div class="bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-tv text-purple-500 text-xs"></i>
              みんなが見るTV
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>恋愛ドラマ</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>バラエティ特集</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>バレンタイン特集</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>動物番組（猫の日）</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>冬ドラマ終盤</span>
              </div>
            </div>
          </div>

          {/* 保存されやすいネタ */}
          <div class="bg-gradient-to-b from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-bookmark text-yellow-600 text-xs"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-2 text-sm">
              <div>
                <p class="font-bold text-gray-800 mb-1">ライフスタイル</p>
                <p class="text-gray-600 text-xs">冬の整えルーティン/リセット系</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">美容</p>
                <p class="text-gray-600 text-xs">乾燥対策/スキンケア/低気圧対策</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">感情・共感系</p>
                <p class="text-gray-600 text-xs">恋愛の記憶/心の整理/がんばれない日</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">行事投稿</p>
                <p class="text-gray-600 text-xs">節分/猫との暮らし/チョコの記憶</p>
              </div>
            </div>
          </div>
        </div>

        {/* 週ごとのおすすめネタ */}
        <div class="mb-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-chart-line text-green-500 text-xs"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-md p-3 border border-green-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">1〜3日</span>
                <span class="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">節分</span>
              </p>
              <p class="text-sm text-gray-700">節分準備・豆まき投稿/心の鬼を追い出す話</p>
            </div>
            <div class="bg-gradient-to-r from-pink-50 to-red-50 rounded-md p-3 border border-pink-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">4〜10日</span>
                <span class="text-xs bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full">バレンタイン前</span>
              </p>
              <p class="text-sm text-gray-700">揺れ系投稿/手作りネタ・ギフト紹介</p>
            </div>
            <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-md p-3 border border-red-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">11〜14日</span>
                <span class="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">バレンタイン</span>
              </p>
              <p class="text-sm text-gray-700">当日ネタ/恋愛ストーリー・片想い回顧</p>
            </div>
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md p-3 border border-blue-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">15〜21日</span>
                <span class="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">共感</span>
              </p>
              <p class="text-sm text-gray-700">がんばれない日投稿・低気圧共感</p>
            </div>
            <div class="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-md p-3 border border-orange-200 md:col-span-2">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">22〜29日</span>
                <span class="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">猫の日・振り返り</span>
              </p>
              <p class="text-sm text-gray-700">猫の日・癒し系投稿/月末の振り返りネタ</p>
            </div>
          </div>
        </div>

        {/* 赤髪Tips */}
        <div class="mb-6 bg-gradient-to-r from-red-100 via-pink-100 to-red-100 rounded-lg p-4 border border-red-300">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-lightbulb text-yellow-500"></i>
            赤髪Tips
          </h3>
          <div class="space-y-3">
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">①</span>
                恋愛投稿は「昔うまくいかなかった話」の方が支持される
              </p>
              <p class="text-xs text-gray-700 ml-6">
                「今うまくいってます」よりも、失敗談や葛藤の方が共感を得やすい。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">②</span>
                冬の不調は明るくごまかさない
              </p>
              <p class="text-xs text-gray-700 ml-6">
                だるい・無気力・動けないを<strong>そのまま言葉にしよう</strong>。正直な投稿が信頼を生む。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">③</span>
                節分と猫の日はイベント紹介より記憶や思い出を
              </p>
              <p class="text-xs text-gray-700 ml-6">
                個人的なエピソードの方が反応されやすい。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <i class="fas fa-coins text-yellow-600"></i>
                2月は財布のひもが比較的かたくなる
              </p>
              <p class="text-sm text-gray-700">
                正月に使いすぎた分を取り戻そうとするから、何かをローンチするなら<strong>1月中に済ませる</strong>。
                2月は<strong>今いるフォロワーさんをファン化</strong>することに費やそう。認知拡大よりも、フォロワー向けイベントや商品の洗練に時間をかけるべき。
                世間が疲れているときに、無理やりポジティブに上げようとするよりも、<strong>世間の空気に合わせた投稿</strong>をすることが大事。
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div class="flex justify-between items-center">
          <a
            href="/calendar/1"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-arrow-left"></i>
            1月
          </a>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <a
            href="/calendar/3"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            3月
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "2月のSNS運用カレンダー - Akagami.net",
      description: "2月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。バレンタイン、節分、猫の日など。",
      keywords: "SNS運用,2月,カレンダー,イベント,バレンタイン,節分,猫の日,恋愛投稿"
    }
  )
})

// ============================================
// Monthly Calendar Page Route (March)
// ============================================
app.get('/calendar/3', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
        {/* Month Navigation - Horizontal Scroll */}
        <div class="mb-6 overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 min-w-max pb-2">
            <a href="/calendar/1" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
            <a href="/calendar/2" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
            <a href="/calendar/3" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
            <a href="/calendar/4" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
            <a href="/calendar/5" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
            <a href="/calendar/6" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
            <a href="/calendar/7" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
            <a href="/calendar/8" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
            <a href="/calendar/9" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
            <a href="/calendar/10" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
            <a href="/calendar/11" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
            <a href="/calendar/12" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
          </div>
        </div>


        {/* 毎年3月に流行るもの */}
        <div class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
          <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i class="fas fa-fire text-orange-500"></i>
            毎年3月に流行るもの
          </h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            ひなまつり（桃の節句）、ホワイトデー、卒業・卒園シーズン、引越し・新生活準備、花粉症対策グッズ、春コスメ・春ファッション
          </p>
        </div>
        {/* イベント＆投稿ネタ 3カラム */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* イベント */}
          <div class="bg-gradient-to-b from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-calendar-day text-pink-500 text-xs"></i>
              主要イベント
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">3/3</span>
                <span class="text-gray-700">ひなまつり</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">3/14</span>
                <span class="text-gray-700">ホワイトデー</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">3/20</span>
                <span class="text-gray-700">春分の日</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">中旬〜下旬</span>
                <span class="text-gray-700">卒業式・送別会・引越し</span>
              </div>
            </div>
          </div>

          {/* みんなが見るテレビ */}
          <div class="bg-gradient-to-b from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-tv text-blue-500 text-xs"></i>
              みんなが見るTV
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>卒業特集・感動ドキュメンタリー</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>ホワイトデー関連番組</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>春休みの旅・Vlog特番</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>高校野球開幕</span>
              </div>
            </div>
          </div>

          {/* 保存されやすいネタ */}
          <div class="bg-gradient-to-b from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-bookmark text-green-600 text-xs"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-2 text-sm">
              <div>
                <p class="font-bold text-gray-800 mb-1">感情ストーリー</p>
                <p class="text-gray-600 text-xs">卒業・別れ・転機の話</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">暮らしの整え</p>
                <p class="text-gray-600 text-xs">引越し・断捨離・春準備</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">恋愛系</p>
                <p class="text-gray-600 text-xs">ホワイトデー・恋愛観</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">親子・家族</p>
                <p class="text-gray-600 text-xs">卒園・進級・記憶系</p>
              </div>
            </div>
          </div>
        </div>

        {/* 週ごとのおすすめネタ */}
        <div class="mb-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-chart-line text-green-500 text-xs"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
              <p class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span class="text-primary">1〜3日</span>
                <span class="text-xs bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full">ひなまつり</span>
              </p>
              <p class="text-sm text-gray-700">女の子の行事・親子エピソード</p>
            </div>
            <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
              <p class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span class="text-primary">4〜10日</span>
                <span class="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">卒業シーズン</span>
              </p>
              <p class="text-sm text-gray-700">送別の言葉・春への振り返り</p>
            </div>
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <p class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span class="text-primary">11〜14日</span>
                <span class="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">ホワイトデー</span>
              </p>
              <p class="text-sm text-gray-700">恋愛感情とすれ違い投稿</p>
            </div>
            <div class="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-4 border border-teal-200">
              <p class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span class="text-primary">15〜21日</span>
                <span class="text-xs bg-teal-200 text-teal-800 px-2 py-0.5 rounded-full">心の整理</span>
              </p>
              <p class="text-sm text-gray-700">引越し準備・退職・振り返り系</p>
            </div>
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200 md:col-span-2">
              <p class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span class="text-primary">22〜31日</span>
                <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">新生活準備</span>
              </p>
              <p class="text-sm text-gray-700">暮らしの切り替え・4月の予告投稿</p>
            </div>
          </div>
        </div>

        {/* 赤髪Tips */}
        <div class="mb-6 bg-gradient-to-r from-red-100 via-pink-100 to-red-100 rounded-lg p-4 border border-red-300">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-lightbulb text-yellow-500"></i>
            赤髪Tips
          </h3>
          <div class="space-y-3">
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">①</span>
                卒業や引越しの投稿は「整理された想い」の方が信頼される
              </p>
              <p class="text-xs text-gray-700 ml-6">
                「寂しい」より、<strong>変化を選んだ理由・今だから言えること</strong>を語る方が響く。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">②</span>
                恋愛系はホワイトデーに便乗して昔のすれ違いを語る
              </p>
              <p class="text-xs text-gray-700 ml-6">
                昔のすれ違いや<strong>言えなかった言葉</strong>を語ると伸びやすい。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">③</span>
                暮らし投稿は未来の自分に語る構成にする
              </p>
              <p class="text-xs text-gray-700 ml-6">
                未来の自分に語る構成にすると保存されやすい。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <i class="fas fa-seedling text-green-600"></i>
                3月は節目と振り返りの月
              </p>
              <p class="text-sm text-gray-700">
                気持ちの切り替えを求める空気が強まる。SNSでも<strong>過去の整理・未来への静かな宣言</strong>が共感される。
                卒業や引越しの話題では別れの悲しさではなく「変化を選んだ理由・今だから言えること」を語るほうが響く。
                恋愛ネタはホワイトデー以外にも、<strong>旅立ちと絡めた話</strong>にすると保存率が上がる傾向あり。
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div class="flex justify-between items-center">
          <a
            href="/calendar/2"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-arrow-left"></i>
            2月
          </a>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <a
            href="/calendar/4"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            4月
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "3月のSNS運用カレンダー - Akagami.net",
      description: "3月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。卒業、ホワイトデー、ひなまつり、桜など。",
      keywords: "SNS運用,3月,カレンダー,イベント,卒業,ホワイトデー,ひなまつり,桜,春"
    }
  )
})

// ============================================
// Monthly Calendar Page Route (April)
// ============================================
app.get('/calendar/4', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
        {/* Month Navigation - Horizontal Scroll */}
        <div class="mb-6 overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 min-w-max pb-2">
            <a href="/calendar/1" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
            <a href="/calendar/2" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
            <a href="/calendar/3" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
            <a href="/calendar/4" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
            <a href="/calendar/5" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
            <a href="/calendar/6" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
            <a href="/calendar/7" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
            <a href="/calendar/8" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
            <a href="/calendar/9" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
            <a href="/calendar/10" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
            <a href="/calendar/11" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
            <a href="/calendar/12" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
          </div>
        </div>


        {/* 毎年4月に流行るもの */}
        <div class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
          <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i class="fas fa-fire text-orange-500"></i>
            毎年4月に流行るもの
          </h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            入学式・入社式、新生活・一人暮らし、桜・花見関連、イースター、ゴールデンウィーク準備、新学期の文房具
          </p>
        </div>
        {/* イベント＆投稿ネタ 3カラム */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* イベント */}
          <div class="bg-gradient-to-b from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-calendar-day text-rose-500 text-xs"></i>
              主要イベント
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">4/1</span>
                <span class="text-gray-700">エイプリルフール</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">上旬〜中旬</span>
                <span class="text-gray-700">入学式・入社式</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">4/29</span>
                <span class="text-gray-700">昭和の日</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">各地</span>
                <span class="text-gray-700">お花見イベント</span>
              </div>
            </div>
          </div>

          {/* みんなが見るテレビ */}
          <div class="bg-gradient-to-b from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-tv text-blue-500 text-xs"></i>
              みんなが見るTV
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>入社式・入学式のニュース</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>新ドラマスタート</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>春番組改編期</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>お花見・桜中継</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>新生活応援特集</span>
              </div>
            </div>
          </div>

          {/* 保存されやすいネタ */}
          <div class="bg-gradient-to-b from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-bookmark text-green-600 text-xs"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-2 text-sm">
              <div>
                <p class="font-bold text-gray-800 mb-1">自己紹介・再設計</p>
                <p class="text-gray-600 text-xs">プロフィール投稿・スタート宣言</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">暮らしの変化</p>
                <p class="text-gray-600 text-xs">通勤・通学・朝のルーティン</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">美容・ファッション</p>
                <p class="text-gray-600 text-xs">春カラー・メイク・新しい雰囲気</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">感情の揺れ</p>
                <p class="text-gray-600 text-xs">緊張・不安・無理してる人への寄り添い</p>
              </div>
            </div>
          </div>
        </div>

        {/* 週ごとのおすすめネタ */}
        <div class="mb-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-chart-line text-green-500 text-xs"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200">
              <p class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span class="text-primary">1〜7日</span>
                <span class="text-xs bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">スタート</span>
              </p>
              <p class="text-sm text-gray-700">自己紹介・新しい場所の空気感・エイプリルフール</p>
            </div>
            <div class="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
              <p class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span class="text-primary">8〜15日</span>
                <span class="text-xs bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full">新生活</span>
              </p>
              <p class="text-sm text-gray-700">環境の変化・朝のルーティン・新生活リアル</p>
            </div>
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <p class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span class="text-primary">16〜22日</span>
                <span class="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">4月病</span>
              </p>
              <p class="text-sm text-gray-700">孤独や疲労の共感が伸びやすい</p>
            </div>
            <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-md p-3 border border-green-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">23〜30日</span>
                <span class="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">振り返り</span>
              </p>
              <p class="text-sm text-gray-700">桜のまとめ・今月の振り返り・GW導線</p>
            </div>
          </div>
        </div>

        {/* 赤髪Tips */}
        <div class="mb-6 bg-gradient-to-r from-red-100 via-pink-100 to-red-100 rounded-lg p-4 border border-red-300">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-lightbulb text-yellow-500"></i>
            赤髪Tips
          </h3>
          <div class="space-y-3">
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">①</span>
                桜や花見関連の経済効果は圧倒的
              </p>
              <p class="text-xs text-gray-700 ml-6">
                桜を絡めた投稿は<strong>リーチが取りやすい</strong>。花見シーズンをフックにした商品紹介・場所紹介・思い出系投稿は積極的に狙っていこう。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">②</span>
                スタート投稿は「整ってないけど始めてみた」系が信頼される
              </p>
              <p class="text-xs text-gray-700 ml-6">
                「やるぞ！」より、<strong>もがいてる人に人は惹かれる</strong>。頑張ってる人よりリアルさが響く。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">③</span>
                4月病ネタは「無理しないって決めた」が刺さる
              </p>
              <p class="text-xs text-gray-700 ml-6">
                「やる気が出ない」より、<strong>共感の余白を残した言葉</strong>が響く。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <i class="fas fa-heart text-pink-600"></i>
                4月は癒し・応援が求められやすい
              </p>
              <p class="text-sm text-gray-700">
                何か新しく始めたい空気がある一方で、現実は仕事や生活がバタついて、<strong>副業・高額サービス系は売れにくい傾向</strong>。
                SNSでは成長よりも「癒し・応援」が求められやすい。新しいスキルよりも、<strong>自分を勇気づける小物・言葉・感情</strong>を届ける投稿が強い。
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Bottom */}
        <div class="flex justify-between items-center">
          <a
            href="/calendar/3"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-arrow-left"></i>
            3月
          </a>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <span class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-400 rounded-lg text-sm cursor-not-allowed">
            5月
            <i class="fas fa-arrow-right"></i>
          </span>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "4月🌸のSNS運用カレンダー - Akagami.net",
      description: "4月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。入学、入社、桜、お花見、新生活など。",
      keywords: "SNS運用,4月,カレンダー,イベント,入学,入社,桜,お花見,新生活,春"
    }
  )
})

// ============================================
// Monthly Calendar Page Route (May)
// ============================================
app.get('/calendar/5', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
        {/* Month Navigation - Horizontal Scroll */}
        <div class="mb-6 overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 min-w-max pb-2">
            <a href="/calendar/1" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
            <a href="/calendar/2" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
            <a href="/calendar/3" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
            <a href="/calendar/4" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
            <a href="/calendar/5" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
            <a href="/calendar/6" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
            <a href="/calendar/7" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
            <a href="/calendar/8" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
            <a href="/calendar/9" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
            <a href="/calendar/10" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
            <a href="/calendar/11" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
            <a href="/calendar/12" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
          </div>
        </div>


        {/* 毎年5月に流行るもの */}
        <div class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
          <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i class="fas fa-fire text-orange-500"></i>
            毎年5月に流行るもの
          </h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            ゴールデンウィーク旅行、母の日ギフト、端午の節句（こどもの日）、初夏のファッション、紫外線対策・日焼け止め
          </p>
        </div>
        {/* イベント＆投稿ネタ 3カラム */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* イベント */}
          <div class="bg-gradient-to-b from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-calendar-day text-green-500 text-xs"></i>
              主要イベント
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">5/3</span>
                <span class="text-gray-700">憲法記念日</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">5/4</span>
                <span class="text-gray-700">みどりの日</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">5/5</span>
                <span class="text-gray-700">こどもの日</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">5/11</span>
                <span class="text-gray-700">母の日</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">連休</span>
                <span class="text-gray-700">ゴールデンウィーク</span>
              </div>
            </div>
          </div>

          {/* みんなが見るテレビ */}
          <div class="bg-gradient-to-b from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-tv text-blue-500 text-xs"></i>
              みんなが見るTV
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>GW特番（旅・グルメ）</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>母の日特集・親子番組</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>プロ野球・大相撲</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>スポーツ中継</span>
              </div>
            </div>
          </div>

          {/* 保存されやすいネタ */}
          <div class="bg-gradient-to-b from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-bookmark text-yellow-600 text-xs"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-2 text-sm">
              <div>
                <p class="font-bold text-gray-800 mb-1">ライフスタイル</p>
                <p class="text-gray-600 text-xs">旅行・おうち時間・リズム崩れリセット</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">美容・健康</p>
                <p class="text-gray-600 text-xs">紫外線・五月病・自律神経</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">家族・行事</p>
                <p class="text-gray-600 text-xs">母の日ギフト・親子ストーリー</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">感情・共感</p>
                <p class="text-gray-600 text-xs">がんばれない日・無理しない選択</p>
              </div>
            </div>
          </div>
        </div>

        {/* 週ごとのおすすめネタ */}
        <div class="mb-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-chart-line text-green-500 text-xs"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-md p-3 border border-green-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">1〜6日</span>
                <span class="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">GW</span>
              </p>
              <p class="text-sm text-gray-700">旅・体験・リール投稿／人との思い出系</p>
            </div>
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-md p-3 border border-purple-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">7〜10日</span>
                <span class="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">連休明け</span>
              </p>
              <p class="text-sm text-gray-700">虚無感・五月病共感・整える系</p>
            </div>
            <div class="bg-gradient-to-r from-pink-50 to-red-50 rounded-md p-3 border border-pink-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">11日</span>
                <span class="text-xs bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full">母の日</span>
              </p>
              <p class="text-sm text-gray-700">親子エピソードや想い出投稿</p>
            </div>
            <div class="bg-gradient-to-r from-sky-50 to-blue-50 rounded-md p-3 border border-sky-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">12〜20日</span>
                <span class="text-xs bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">初夏準備</span>
              </p>
              <p class="text-sm text-gray-700">衣替え・美容・暮らしの見直し</p>
            </div>
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-md p-3 border border-yellow-200 md:col-span-2">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">21〜31日</span>
                <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">振り返り</span>
              </p>
              <p class="text-sm text-gray-700">5月の振り返り・学び・6月準備</p>
            </div>
          </div>
        </div>

        {/* 赤髪Tips */}
        <div class="mb-6 bg-gradient-to-r from-red-100 via-pink-100 to-red-100 rounded-lg p-4 border border-red-300">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-lightbulb text-yellow-500"></i>
            赤髪Tips
          </h3>
          <div class="space-y-3">
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">①</span>
                GW中の投稿は映えだけじゃなく余韻まで拾うと強い
              </p>
              <p class="text-xs text-gray-700 ml-6">
                旅やイベントの写真はもちろん、<strong>そのとき何を感じたか、何を持ち帰ったか</strong>まで書けると保存されやすい。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">②</span>
                五月病は、ゆるさを肯定する言葉の方が共感される
              </p>
              <p class="text-xs text-gray-700 ml-6">
                ネガティブ脱出よりも、<strong>ゆるさを肯定する言葉</strong>の方が響く。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">③</span>
                母の日はギフト紹介より、感情の言語化が届きやすい
              </p>
              <p class="text-xs text-gray-700 ml-6">
                <strong>感情を言語化した小さな記憶</strong>が届きやすい。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <i class="fas fa-heart text-pink-600"></i>
                5月は内側に疲れがたまる月
              </p>
              <p class="text-xs text-gray-700">
                外側が明るくなってくる分、内側に疲れがたまる月。SNSでも<strong>キラキラより静かな共感</strong>のほうが反応されやすい。
                投稿では「がんばれない日もある」そんな自分をそのまま出せる人に人はついていく。<strong>焦らず、自分と向き合う投稿</strong>が一番伸びる月。
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Bottom */}
        <div class="flex justify-between items-center">
          <a
            href="/calendar/4"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-arrow-left"></i>
            4月
          </a>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <span class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-400 rounded-lg text-sm cursor-not-allowed">
            6月
            <i class="fas fa-arrow-right"></i>
          </span>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "5月🎏のSNS運用カレンダー - Akagami.net",
      description: "5月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。ゴールデンウィーク、母の日、こどもの日、五月病など。",
      keywords: "SNS運用,5月,カレンダー,イベント,ゴールデンウィーク,母の日,こどもの日,五月病,初夏"
    }
  )
})

// ============================================
// Monthly Calendar Page Route (June)
// ============================================
app.get('/calendar/6', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
        {/* Month Navigation - Horizontal Scroll */}
        <div class="mb-6 overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 min-w-max pb-2">
            <a href="/calendar/1" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
            <a href="/calendar/2" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
            <a href="/calendar/3" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
            <a href="/calendar/4" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
            <a href="/calendar/5" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
            <a href="/calendar/6" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
            <a href="/calendar/7" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
            <a href="/calendar/8" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
            <a href="/calendar/9" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
            <a href="/calendar/10" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
            <a href="/calendar/11" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
            <a href="/calendar/12" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
          </div>
        </div>


        {/* 毎年6月に流行るもの */}
        <div class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
          <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i class="fas fa-fire text-orange-500"></i>
            毎年6月に流行るもの
          </h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            梅雨対策グッズ（傘・レインコート）、父の日ギフト、ジューンブライド・結婚式、夏バテ予防レシピ、衣替え・夏服コーデ
          </p>
        </div>
        {/* イベント＆投稿ネタ 3カラム */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* イベント */}
          <div class="bg-gradient-to-b from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-calendar-day text-blue-500 text-xs"></i>
              主要イベント
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">6/1</span>
                <span class="text-gray-700">衣替え</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">6/16</span>
                <span class="text-gray-700">父の日</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">6/21</span>
                <span class="text-gray-700">夏至</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">期間中</span>
                <span class="text-gray-700">梅雨入り</span>
              </div>
            </div>
          </div>

          {/* みんなが見るテレビ */}
          <div class="bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-tv text-purple-500 text-xs"></i>
              みんなが見るTV
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>雨や湿気対策特集</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>健康番組</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>紫陽花や季節の旅番組</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>父の日ドキュメンタリー</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>プロ野球交流戦・サッカー</span>
              </div>
            </div>
          </div>

          {/* 保存されやすいネタ */}
          <div class="bg-gradient-to-b from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-bookmark text-green-600 text-xs"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-2 text-sm">
              <div>
                <p class="font-bold text-gray-800 mb-1">ライフスタイル</p>
                <p class="text-gray-600 text-xs">雨の日・除湿・洗濯・おうち時間</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">美容・健康</p>
                <p class="text-gray-600 text-xs">くせ毛ケア・体調不良対策</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">家族・行事</p>
                <p class="text-gray-600 text-xs">父の日の記憶・親への言葉</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">感情・共感</p>
                <p class="text-gray-600 text-xs">低気圧不調・無気力・静かに休む</p>
              </div>
            </div>
          </div>
        </div>

        {/* 週ごとのおすすめネタ */}
        <div class="mb-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-chart-line text-green-500 text-xs"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-gradient-to-r from-sky-50 to-blue-50 rounded-md p-3 border border-sky-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">1〜6日</span>
                <span class="text-xs bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">衣替え</span>
              </p>
              <p class="text-sm text-gray-700">初夏の準備投稿／雨の日への気持ちの整え</p>
            </div>
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-md p-3 border border-purple-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">7〜15日</span>
                <span class="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">梅雨</span>
              </p>
              <p class="text-sm text-gray-700">湿気・くせ毛・頭痛・低気圧共感ネタ</p>
            </div>
            <div class="bg-gradient-to-r from-pink-50 to-red-50 rounded-md p-3 border border-pink-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">16日</span>
                <span class="text-xs bg-pink-200 text-pink-800 px-2 py-0.5 rounded-full">父の日</span>
              </p>
              <p class="text-sm text-gray-700">親との思い出や言葉をストーリーで</p>
            </div>
            <div class="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-md p-3 border border-teal-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">17〜23日</span>
                <span class="text-xs bg-teal-200 text-teal-800 px-2 py-0.5 rounded-full">紫陽花</span>
              </p>
              <p class="text-sm text-gray-700">紫陽花の写真やリール／季節感投稿</p>
            </div>
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-md p-3 border border-yellow-200 md:col-span-2">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">24〜30日</span>
                <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">上半期振り返り</span>
              </p>
              <p class="text-sm text-gray-700">静かな気持ちで7月への切り替え投稿</p>
            </div>
          </div>
        </div>

        {/* 赤髪Tips */}
        <div class="mb-6 bg-gradient-to-r from-red-100 via-pink-100 to-red-100 rounded-lg p-4 border border-red-300">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-lightbulb text-yellow-500"></i>
            赤髪Tips
          </h3>
          <div class="space-y-3">
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">①</span>
                雨や不調を嘆くのではなく、整えるアイデアを
              </p>
              <p class="text-xs text-gray-700 ml-6">
                雨や不調をただ嘆くのではなく、<strong>どう過ごせば心地よくなるかをシェア</strong>する投稿が共感を生む。ちょっと整えるアイデアが求められる月。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">②</span>
                父の日は照れくさいけど、今なら言えることを
              </p>
              <p class="text-xs text-gray-700 ml-6">
                完璧な親子関係よりも、<strong>照れくさいけど、今なら言えること</strong>を言葉にしたほうが温かく届く。記念日だからこそ、静かな一言が刺さる。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">③</span>
                紫陽花・梅雨・雨の音は積極的に拾うべき
              </p>
              <p class="text-xs text-gray-700 ml-6">
                6月ならではの季節トレンドは絶対に拾うべき。<strong>映像・写真・言葉、どれを切り取っても世界観が出しやすい</strong>テーマ。美しさと静けさを武器にして、積極的に投稿に活かそう。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <i class="fas fa-umbrella text-blue-600"></i>
                伸びやすいテーマ
              </p>
              <p class="text-xs text-gray-700">
                <strong>紫陽花コンテンツ・雨の日のルーティーン・父の日（エモ軸で伸びる）・上半期振り返り・梅雨ネイル・梅雨ファッション・雨ソング</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Bottom */}
        <div class="flex justify-between items-center">
          <a
            href="/calendar/5"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-arrow-left"></i>
            5月
          </a>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <span class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-400 rounded-lg text-sm cursor-not-allowed">
            7月
            <i class="fas fa-arrow-right"></i>
          </span>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "6月☔のSNS運用カレンダー - Akagami.net",
      description: "6月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。梅雨、紫陽花、父の日、湿気対策など。",
      keywords: "SNS運用,6月,カレンダー,イベント,梅雨,紫陽花,父の日,雨の日,湿気対策"
    }
  )
})

// ============================================
// Monthly Calendar Page Route (July)
// ============================================
app.get('/calendar/7', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
        {/* Month Navigation - Horizontal Scroll */}
        <div class="mb-6 overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 min-w-max pb-2">
            <a href="/calendar/1" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
            <a href="/calendar/2" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
            <a href="/calendar/3" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
            <a href="/calendar/4" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
            <a href="/calendar/5" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
            <a href="/calendar/6" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
            <a href="/calendar/7" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
            <a href="/calendar/8" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
            <a href="/calendar/9" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
            <a href="/calendar/10" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
            <a href="/calendar/11" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
            <a href="/calendar/12" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
          </div>
        </div>


        {/* 毎年7月に流行るもの */}
        <div class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
          <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i class="fas fa-fire text-orange-500"></i>
            毎年7月に流行るもの
          </h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            七夕、夏休み計画、海・プール・花火大会、夏祭り・浴衣、夏の冷感グッズ、お中元ギフト
          </p>
        </div>
        {/* イベント＆投稿ネタ 3カラム */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* イベント */}
          <div class="bg-gradient-to-b from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-calendar-day text-orange-500 text-xs"></i>
              主要イベント
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">7/7</span>
                <span class="text-gray-700">七夕</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">7/15</span>
                <span class="text-gray-700">海の日</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">中旬〜</span>
                <span class="text-gray-700">夏祭り・花火大会</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">期間中</span>
                <span class="text-gray-700">夏休みスタート</span>
              </div>
            </div>
          </div>

          {/* みんなが見るテレビ */}
          <div class="bg-gradient-to-b from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-tv text-blue-500 text-xs"></i>
              みんなが見るTV
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>七夕特集・願い系番組</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>夏の旅・フェス・青春番組</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>高校野球予選・プロ野球</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-blue-400 mt-1.5"></i>
                <span>花火・おばけ特番</span>
              </div>
            </div>
          </div>

          {/* 保存されやすいネタ */}
          <div class="bg-gradient-to-b from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-bookmark text-pink-600 text-xs"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-2 text-sm">
              <div>
                <p class="font-bold text-gray-800 mb-1">ライフスタイル</p>
                <p class="text-gray-600 text-xs">朝活・冷たい朝ごはん・夏支度</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">美容・健康</p>
                <p class="text-gray-600 text-xs">日焼け止め・暑さ対策</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">季節映え</p>
                <p class="text-gray-600 text-xs">海・浴衣・夕暮れ・夏の音</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">感情・共感</p>
                <p class="text-gray-600 text-xs">暑さ・無気力・夏休みの緩さ</p>
              </div>
            </div>
          </div>
        </div>

        {/* 週ごとのおすすめネタ */}
        <div class="mb-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-chart-line text-green-500 text-xs"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-md p-3 border border-yellow-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">1〜6日</span>
                <span class="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">夏の始まり</span>
              </p>
              <p class="text-sm text-gray-700">今年の夏にしたいことリスト</p>
            </div>
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-md p-3 border border-purple-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">7〜14日</span>
                <span class="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">七夕</span>
              </p>
              <p class="text-sm text-gray-700">短冊・願い事・夢や目標投稿</p>
            </div>
            <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-md p-3 border border-blue-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">15〜21日</span>
                <span class="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">海の日</span>
              </p>
              <p class="text-sm text-gray-700">海開き投稿・夏の開放感</p>
            </div>
            <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-md p-3 border border-red-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">22〜28日</span>
                <span class="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">夏祭り</span>
              </p>
              <p class="text-sm text-gray-700">花火大会・浴衣リール・思い出投稿</p>
            </div>
            <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-md p-3 border border-green-200 md:col-span-2">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">29〜31日</span>
                <span class="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">まとめ</span>
              </p>
              <p class="text-sm text-gray-700">夏休み前半まとめ・暑さと疲れの整え・8月予告</p>
            </div>
          </div>
        </div>

        {/* 毎年７月に流行るもの */}
        <div class="mb-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-fire text-cyan-500 text-xs"></i>
            毎年７月に流行るもの
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>七夕ネタ</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>夏の始まり投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>冷感グッズ・夏服・セール</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>おうち夏・夏休み準備</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>怪談・ホラー系</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>夏バテ・熱中症対策</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>上半期振り返り・7月からの切り替え宣言</span>
              </div>
            </div>
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>夏ドラマ・アニメの初回放送</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>花火大会・夏祭りの開催情報シェア</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>スタバ・コンビニ「ひんやり新商品」レビュー</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>青・水・空を使った色映え投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>海・プール・川遊びの映像コンテンツ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Bottom */}
        <div class="flex justify-between items-center">
          <a
            href="/calendar/6"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-arrow-left"></i>
            6月
          </a>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <a
            href="/calendar/8"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            8月
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "7月🍉のSNS運用カレンダー - Akagami.net",
      description: "7月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。七夕、海の日、夏休み、花火大会、夏祭りなど。",
      keywords: "SNS運用,7月,カレンダー,イベント,七夕,海の日,夏休み,花火大会,夏祭り,夏"
    }
  )
})

// ============================================
// Monthly Calendar Page Route (August)
// ============================================
app.get('/calendar/8', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
        {/* Month Navigation - Horizontal Scroll */}
        <div class="mb-6 overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 min-w-max pb-2">
            <a href="/calendar/1" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
            <a href="/calendar/2" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
            <a href="/calendar/3" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
            <a href="/calendar/4" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
            <a href="/calendar/5" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
            <a href="/calendar/6" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
            <a href="/calendar/7" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
            <a href="/calendar/8" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
            <a href="/calendar/9" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
            <a href="/calendar/10" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
            <a href="/calendar/11" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
            <a href="/calendar/12" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
          </div>
        </div>

        {/* Events and Content Ideas */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Events */}
          <div class="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-5 border border-pink-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-calendar-day text-red-500 text-sm"></i>
              イベント
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>8月11日 山の日</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>8月13〜16日 お盆</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>8月15日 終戦記念日</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>8月中旬 花火大会・盆踊り・夏祭り</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>8月下旬 夏休み最終週</span>
              </div>
            </div>
          </div>

          {/* TV Programs */}
          <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-tv text-purple-500 text-sm"></i>
              みんなが見るテレビ番組
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>高校野球（甲子園）中継</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>お盆の帰省や家族を扱う番組</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>戦争と平和に関する特番</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>夏の青春映画・花火中継など</span>
              </div>
            </div>
          </div>

          {/* Content to Save */}
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-bookmark text-green-500 text-sm"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-3 text-sm text-gray-700">
              <div>
                <div class="font-semibold text-green-700 mb-1">ライフスタイル</div>
                <div class="text-xs">帰省・地元・実家・田舎の記憶・家族との過ごし方</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">美容・健康</div>
                <div class="text-xs">夏バテ・睡眠・冷房疲れ・水分補給</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">感情・共感</div>
                <div class="text-xs">終わりが近づく寂しさ・青春・静けさと余韻</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">記録・思い出</div>
                <div class="text-xs">自由研究・子どもの成長</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Recommendations */}
        <div class="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <i class="fas fa-lightbulb text-yellow-500"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="space-y-3">
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">1〜6日</div>
              <p class="text-sm text-gray-700">夏のピーク投稿／旅行・フェス・青春っぽいリールが伸びる</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">7〜13日</div>
              <p class="text-sm text-gray-700">お盆準備や帰省ネタ・家族との時間や地元の記憶</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">14〜16日</div>
              <p class="text-sm text-gray-700">終戦記念・命・平和を考える系／深い言葉が届きやすい週</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">17〜23日</div>
              <p class="text-sm text-gray-700">暑さと疲れを整えるネタ・夏の終盤モードの切り替え投稿</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">24〜31日</div>
              <p class="text-sm text-gray-700">夏のまとめ・振り返り投稿・8月の記憶・9月予告</p>
            </div>
          </div>
        </div>

        {/* 毎年８月に流行るもの */}
        <div class="mb-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-fire text-red-500 text-xs"></i>
            毎年８月に流行るもの
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>お盆・帰省ネタ</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>花火大会・夏祭り投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>夏の終わり系ポエティック投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>自由研究・子どもネタ</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>甲子園・高校野球の感動投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>24時間テレビ・平和を考える投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>夏疲れ・バテ対策・リセット系ルーティン</span>
              </div>
            </div>
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>夏アニメ中盤の考察・推し語り</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>Uターンラッシュ系共感投稿（空港・新幹線）</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>祖父母・戦争体験に関するストーリー投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>スイカ・かき氷・夏グルメレビュー</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>夜の空・夕暮れ・セミの鳴き声など夏の終わり映像</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Bottom */}
        <div class="flex justify-between items-center">
          <a
            href="/calendar/7"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-arrow-left"></i>
            7月
          </a>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <a
            href="/calendar/9"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            9月
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "8月🏄️のSNS運用カレンダー - Akagami.net",
      description: "8月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。お盆、帰省、花火大会、終戦記念日、夏休み最終週など。",
      keywords: "SNS運用,8月,カレンダー,イベント,お盆,帰省,花火大会,夏祭り,終戦記念日,甲子園,夏バテ"
    }
  )
})

// ============================================
// Monthly Calendar Page Route (September)
// ============================================
app.get('/calendar/9', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
        {/* Month Navigation - Horizontal Scroll */}
        <div class="mb-6 overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 min-w-max pb-2">
            <a href="/calendar/1" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
            <a href="/calendar/2" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
            <a href="/calendar/3" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
            <a href="/calendar/4" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
            <a href="/calendar/5" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
            <a href="/calendar/6" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
            <a href="/calendar/7" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
            <a href="/calendar/8" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
            <a href="/calendar/9" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
            <a href="/calendar/10" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
            <a href="/calendar/11" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
            <a href="/calendar/12" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
          </div>
        </div>

        {/* Events and Content Ideas */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Events */}
          <div class="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-5 border border-pink-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-calendar-day text-red-500 text-sm"></i>
              イベント
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>9月1日 防災の日</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>9月16日 敬老の日（2025年）</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>9月21日 秋分の日</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>9月上旬〜中旬 台風警戒期</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>9月5日頃 十五夜</span>
              </div>
            </div>
          </div>

          {/* TV Programs */}
          <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-tv text-purple-500 text-sm"></i>
              みんなが見るテレビ番組
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>防災特番や気象関連の番組</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>十五夜や満月にまつわる文化番組</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>秋の新ドラマ予告・秋旅特集</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>食欲の秋・味覚系のバラエティ</span>
              </div>
            </div>
          </div>

          {/* Content to Save */}
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-bookmark text-green-500 text-sm"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-3 text-sm text-gray-700">
              <div>
                <div class="font-semibold text-green-700 mb-1">ライフスタイル</div>
                <div class="text-xs">夜風・虫の声・月・冷え対策・防災の備え直し・空気を入れ替える暮らし</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">美容・健康</div>
                <div class="text-xs">夏の疲れ・秋の乾燥・自律神経の乱れを整える習慣</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">家族・行事</div>
                <div class="text-xs">敬老の日の思い出・祖父母との関係・手紙・昔話</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">感情・共感</div>
                <div class="text-xs">無気力・寂しさ・静けさ・焦りすぎない気持ち・夏の終わりの感情整理</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Recommendations */}
        <div class="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <i class="fas fa-lightbulb text-yellow-500"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="space-y-3">
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-amber-600 mb-2">1〜7日</div>
              <p class="text-sm text-gray-700">防災の日投稿・秋の気配・空と音と湿度を感じる投稿</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-amber-600 mb-2">8〜15日</div>
              <p class="text-sm text-gray-700">台風・低気圧・不調と整えネタ／十五夜の準備と空気感投稿</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-amber-600 mb-2">16〜21日</div>
              <p class="text-sm text-gray-700">敬老の日・家族との距離・手紙・昔話系のあたたかい投稿</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-amber-600 mb-2">22〜27日</div>
              <p class="text-sm text-gray-700">秋分・季節の切り替え投稿／感情のリセット</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-amber-600 mb-2">28〜30日</div>
              <p class="text-sm text-gray-700">9月まとめと10月予告・秋の深まりに向けた導線投稿</p>
            </div>
          </div>
        </div>

        {/* 毎年９月に流行るもの */}
        <div class="mb-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-fire text-orange-500 text-xs"></i>
            毎年９月に流行るもの
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>秋のはじまり投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>夏の疲れ・リセット系投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>防災ネタ（備蓄・グッズ紹介）</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>秋服・秋メイク・衣替え</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>月見・十五夜の感情投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>祖父母ネタ（敬老の日・お彼岸）</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>新学期の不安・気持ちの整理系</span>
              </div>
            </div>
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>秋アニメ・新ドラマの期待投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>台風情報と共感ネタ</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>朝晩の空・風・においなど季節感投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>読書・紅茶・秋の夜長に合うもの紹介</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Bottom */}
        <div class="flex justify-between items-center">
          <a
            href="/calendar/8"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-arrow-left"></i>
            8月
          </a>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <a
            href="/calendar/10"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            10月
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "9月🍂のSNS運用カレンダー - Akagami.net",
      description: "9月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。防災の日、敬老の日、十五夜、秋分の日、台風警戒期など。",
      keywords: "SNS運用,9月,カレンダー,イベント,防災の日,敬老の日,十五夜,秋分の日,台風,秋ファッション,メンタルケア"
    }
  )
})

// ============================================
// Monthly Calendar Page Route (October)
// ============================================
app.get('/calendar/10', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
        {/* Month Navigation - Horizontal Scroll */}
        <div class="mb-6 overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 min-w-max pb-2">
            <a href="/calendar/1" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
            <a href="/calendar/2" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
            <a href="/calendar/3" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
            <a href="/calendar/4" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
            <a href="/calendar/5" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
            <a href="/calendar/6" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
            <a href="/calendar/7" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
            <a href="/calendar/8" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
            <a href="/calendar/9" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
            <a href="/calendar/10" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
            <a href="/calendar/11" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
            <a href="/calendar/12" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
          </div>
        </div>

        {/* Events and Content Ideas */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Events */}
          <div class="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-5 border border-pink-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-calendar-day text-red-500 text-sm"></i>
              イベント
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>10月1日 衣替え</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>10月中旬〜下旬 各地で紅葉シーズンが始まる</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>10月31日 ハロウィン</span>
              </div>
            </div>
          </div>

          {/* TV Programs */}
          <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-tv text-purple-500 text-sm"></i>
              みんなが見るテレビ番組
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>ハロウィン関連のバラエティや特集</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>秋ドラマスタート</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>紅葉や温泉特集の旅番組</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>芸術や文化に関するドキュメンタリー</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>プロ野球や駅伝などのスポーツ中継</span>
              </div>
            </div>
          </div>

          {/* Content to Save */}
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-bookmark text-green-500 text-sm"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-3 text-sm text-gray-700">
              <div>
                <div class="font-semibold text-green-700 mb-1">ライフスタイル</div>
                <div class="text-xs">夜の過ごし方・秋の味覚・焼き芋・お菓子作り・お茶・静けさのある時間</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">美容・健康</div>
                <div class="text-xs">秋色メイク・ネイル・香り・肌の乾燥対策・冷えと自律神経</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">季節感・遊び</div>
                <div class="text-xs">ハロウィン・仮装・飾り・子どものイベント・お菓子・文化に触れる投稿</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">感情・共感</div>
                <div class="text-xs">静かな幸せ・センチメンタル・寂しさ・満たされることの怖さ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Recommendations */}
        <div class="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <i class="fas fa-lightbulb text-yellow-500"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="space-y-3">
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">1〜7日</div>
              <p class="text-sm text-gray-700">衣替え・秋服の紹介・季節の変化と気分の変化を紐づけた投稿</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">8〜14日</div>
              <p class="text-sm text-gray-700">秋の味覚や読書・夜の過ごし方など内省や文化寄りの発信</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">15〜21日</div>
              <p class="text-sm text-gray-700">ハロウィン準備・子どもとの思い出・デコレーションなどのネタ</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">22〜30日</div>
              <p class="text-sm text-gray-700">秋の行事まとめ・月のリール・静けさに寄せた言葉系投稿</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">31日</div>
              <p class="text-sm text-gray-700">ハロウィン当日投稿・仮装・本音・遊び心あるコンテンツで開放感</p>
            </div>
          </div>
        </div>

        {/* 毎年１０月に流行るもの */}
        <div class="mb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-fire text-purple-500 text-xs"></i>
            毎年１０月に流行るもの
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>ハロウィン仮装・飾り・お菓子投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>秋の味覚レビュー（栗・さつまいも・かぼちゃ）</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>秋服・秋カラーのファッション＆メイク</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>紅葉・温泉・旅行投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>秋の夜長×読書やホットドリンク系リール</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>さみしさ・感情整理系の静かな言葉投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>文化祭や学生時代の秋ネタ</span>
              </div>
            </div>
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>おうちハロウィン・親子仮装・手作り菓子系</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>秋ドラマやアニメの感想・考察系投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>眠い・だるい・なんか切ない、の感情共感系</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>秋の匂いや風、五感を刺激するポエム系</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>「今年あと3ヶ月」投稿（年末意識の始まり）</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Bottom */}
        <div class="flex justify-between items-center">
          <a
            href="/calendar/9"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-arrow-left"></i>
            9月
          </a>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <a
            href="/calendar/11"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            11月
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "10月📖のSNS運用カレンダー - Akagami.net",
      description: "10月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。ハロウィン、衣替え、紅葉、秋メイク、秋の味覚など。",
      keywords: "SNS運用,10月,カレンダー,イベント,ハロウィン,衣替え,紅葉,秋メイク,秋の味覚,読書の秋,芸術の秋"
    }
  )
})

// ============================================
// Monthly Calendar Page Route (November)
// ============================================
app.get('/calendar/11', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
        {/* Month Navigation - Horizontal Scroll */}
        <div class="mb-6 overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 min-w-max pb-2">
            <a href="/calendar/1" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
            <a href="/calendar/2" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
            <a href="/calendar/3" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
            <a href="/calendar/4" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
            <a href="/calendar/5" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
            <a href="/calendar/6" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
            <a href="/calendar/7" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
            <a href="/calendar/8" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
            <a href="/calendar/9" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
            <a href="/calendar/10" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
            <a href="/calendar/11" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
            <a href="/calendar/12" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
          </div>
        </div>

        {/* Events and Content Ideas */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Events */}
          <div class="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-5 border border-pink-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-calendar-day text-red-500 text-sm"></i>
              イベント
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>11月3日 文化の日</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>11月15日 七五三</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>11月23日 勤労感謝の日</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>11月第3木曜日 ボジョレーヌーヴォー解禁</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>イルミネーション点灯開始</span>
              </div>
            </div>
          </div>

          {/* TV Programs */}
          <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-tv text-purple-500 text-sm"></i>
              みんなが見るテレビ番組
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>紅葉中継・秋旅特集</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>文化人やアーティストのドキュメンタリー</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>七五三ニュースや家族番組</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>年末支度系の情報番組や大掃除特集</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-purple-400 text-xs mt-1"></i>
                <span>ワインやグルメ系バラエティ</span>
              </div>
            </div>
          </div>

          {/* Content to Save */}
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-bookmark text-green-500 text-sm"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-3 text-sm text-gray-700">
              <div>
                <div class="font-semibold text-green-700 mb-1">ライフスタイル</div>
                <div class="text-xs">こたつ・加湿器・部屋の模様替え・冬服・手帳・断捨離</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">美容・健康</div>
                <div class="text-xs">乾燥対策・冷えケア・あたたかい食べもの・夜の整えルーティン</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">家族・行事</div>
                <div class="text-xs">七五三の記憶・親子の写真・家族との会話・勤労感謝の言葉</div>
              </div>
              <div>
                <div class="font-semibold text-green-700 mb-1">感情・共感</div>
                <div class="text-xs">秋の終わりの寂しさ・年末への焦り・静かに整える気持ち</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Recommendations */}
        <div class="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <i class="fas fa-lightbulb text-yellow-500"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="space-y-3">
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">1〜7日</div>
              <p class="text-sm text-gray-700">紅葉リール・文化に触れた話・年末の準備リスト導入</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">8〜14日</div>
              <p class="text-sm text-gray-700">七五三エピソード・子どもとの記憶・昔の写真と今の気づき</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">15〜21日</div>
              <p class="text-sm text-gray-700">勤労感謝の投稿・暮らしの中の小さな労いを言語化</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">22〜28日</div>
              <p class="text-sm text-gray-700">こたつ・加湿・断捨離・整え投稿・買ってよかったものネタ</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-yellow-200">
              <div class="font-semibold text-orange-600 mb-2">29〜30日</div>
              <p class="text-sm text-gray-700">11月の振り返り・12月予告・年末への一歩目</p>
            </div>
          </div>
        </div>

        {/* 毎年１１月に流行るもの */}
        <div class="mb-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-fire text-red-500 text-xs"></i>
            毎年１１月に流行るもの
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>紅葉投稿と感情ポエムの組み合わせ</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>七五三写真・家族ネタ</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>手帳・振り返り投稿（来年の準備）</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>イルミネーション投稿・夜リール</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>ホットドリンク・こたつ・ぬくもり系写真</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>ニット・ブーツ・冬メイク・あったか投稿</span>
              </div>
            </div>
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>年末までにやりたいこと</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>勤労感謝×両親・パートナーとの関係投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>乾燥ケア・あったかグッズ・セルフケア投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>日が短くなる焦りと、心の整えネタ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Bottom */}
        <div class="flex justify-between items-center">
          <a
            href="/calendar/10"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-arrow-left"></i>
            10月
          </a>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <a
            href="/calendar/12"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            12月
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "11月🍁のSNS運用カレンダー - Akagami.net",
      description: "11月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。紅葉、七五三、文化の日、勤労感謝の日、イルミネーション、年末準備など。",
      keywords: "SNS運用,11月,カレンダー,イベント,紅葉,七五三,文化の日,勤労感謝の日,こたつ,イルミネーション,年末準備"
    }
  )
})

// ============================================
// Monthly Calendar Page Route (December)
// ============================================
app.get('/calendar/12', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
        {/* Month Navigation - Horizontal Scroll */}
        <div class="mb-6 overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 min-w-max pb-2">
            <a href="/calendar/1" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
            <a href="/calendar/2" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
            <a href="/calendar/3" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
            <a href="/calendar/4" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
            <a href="/calendar/5" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
            <a href="/calendar/6" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
            <a href="/calendar/7" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
            <a href="/calendar/8" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
            <a href="/calendar/9" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
            <a href="/calendar/10" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
            <a href="/calendar/11" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
            <a href="/calendar/12" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
          </div>
        </div>

        {/* Events and Content Ideas */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Events */}
          <div class="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-5 border border-red-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-calendar-day text-red-500 text-sm"></i>
              イベント
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>12月22日頃 冬至</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>12月24日 クリスマスイブ</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>12月25日 クリスマス</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>12月29日〜31日 年末休暇</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-red-400 text-xs mt-1"></i>
                <span>12月31日 大晦日</span>
              </div>
            </div>
          </div>

          {/* TV Programs */}
          <div class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-5 border border-indigo-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-tv text-indigo-500 text-sm"></i>
              みんなが見るテレビ番組
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-indigo-400 text-xs mt-1"></i>
                <span>クリスマス特番・音楽イベント</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-indigo-400 text-xs mt-1"></i>
                <span>お笑い・バラエティの年末特番</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-indigo-400 text-xs mt-1"></i>
                <span>大掃除や断捨離企画</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-indigo-400 text-xs mt-1"></i>
                <span>年間総集編・ドラマやトレンド特集</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-indigo-400 text-xs mt-1"></i>
                <span>年越しライブ・ニュース番組の締め</span>
              </div>
            </div>
          </div>

          {/* Content to Save */}
          <div class="bg-gradient-to-br from-teal-50 to-green-50 rounded-lg p-5 border border-teal-200">
            <h3 class="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i class="fas fa-bookmark text-teal-500 text-sm"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-3 text-sm text-gray-700">
              <div>
                <div class="font-semibold text-teal-700 mb-1">ライフスタイル</div>
                <div class="text-xs">大掃除・断捨離・こたつ・お茶・手帳の書き直し・スケジュール調整</div>
              </div>
              <div>
                <div class="font-semibold text-teal-700 mb-1">美容・健康</div>
                <div class="text-xs">寒さと乾燥対策・睡眠リズム・整え直すスキンケア・夜時間のセルフケア</div>
              </div>
              <div>
                <div class="font-semibold text-teal-700 mb-1">行事・感情</div>
                <div class="text-xs">クリスマスの記憶・年末の気づき・一年の中で印象に残った人や出来事</div>
              </div>
              <div>
                <div class="font-semibold text-teal-700 mb-1">まとめ・思考</div>
                <div class="text-xs">今年買ってよかったもの・やってよかったこと・手放してよかった習慣</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Recommendations */}
        <div class="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <i class="fas fa-lightbulb text-amber-500"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="space-y-3">
            <div class="bg-white rounded-lg p-4 border border-amber-200">
              <div class="font-semibold text-amber-600 mb-2">1〜10日</div>
              <p class="text-sm text-gray-700">冬の整え投稿・年末に向けた準備・今年をどう使い切るかの問いかけ</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-amber-200">
              <div class="font-semibold text-amber-600 mb-2">11〜20日</div>
              <p class="text-sm text-gray-700">クリスマス準備・ご褒美投稿・イルミネーションや静かな夜の空気感</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-amber-200">
              <div class="font-semibold text-amber-600 mb-2">21〜25日</div>
              <p class="text-sm text-gray-700">クリスマス投稿・感情や思い出・誰と過ごしたかより何を感じたか</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-amber-200">
              <div class="font-semibold text-amber-600 mb-2">26〜30日</div>
              <p class="text-sm text-gray-700">大掃除・手帳・振り返り投稿・今年の自分にありがとう系が刺さる</p>
            </div>
            <div class="bg-white rounded-lg p-4 border border-amber-200">
              <div class="font-semibold text-amber-600 mb-2">31日</div>
              <p class="text-sm text-gray-700">静かな締めくくり・来年への一言・誰かと一緒に歩くための言葉を置く投稿</p>
            </div>
          </div>
        </div>

        {/* 毎年１２月に流行るもの */}
        <div class="mb-4 bg-gradient-to-r from-rose-50 to-red-50 rounded-lg p-4 border border-rose-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-fire text-rose-500 text-xs"></i>
            毎年１２月に流行るもの
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>今年の振り返り投稿（カルーセル・長文）</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>今年買ってよかったものランキング</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>年末整え系（部屋／心／人間関係）</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>クリスマスの飾り・ギフト・食べ物投稿</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-star text-yellow-500 text-xs"></i>
                <span>大掃除×気づき系の言語化リール</span>
              </div>
            </div>
            <div class="space-y-1 text-xs text-gray-700">
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>ホットドリンク・冬レシピ・鍋・おでん系</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>カウントダウンの準備・SNSでの年越し宣言</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>年末年始の過ごし方アイデア（ひとり用も人気）</span>
              </div>
              <div class="flex items-center gap-1.5">
                <i class="fas fa-fire text-orange-500 text-xs"></i>
                <span>「何も変わらなかった1年だった」も共感されやすい</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Bottom */}
        <div class="flex justify-between items-center">
          <a
            href="/calendar/11"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-arrow-left"></i>
            11月
          </a>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <a
            href="/calendar/1"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            1月
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "12月🧣のSNS運用カレンダー - Akagami.net",
      description: "12月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。クリスマス、年末、振り返り、大掃除、買ってよかったもの、年越しなど。",
      keywords: "SNS運用,12月,カレンダー,イベント,クリスマス,年末,振り返り,大掃除,買ってよかったもの,年越し,手帳,今年の漢字"
    }
  )
})

// ============================================
// Monthly Calendar Page Route (January)
// ============================================
app.get('/calendar/1', (c) => {
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      <CommonHeader />

      {/* Main Content */}
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <CommonSidebar />
          
          {/* Calendar Content */}
          <div class="lg:col-span-3 order-1 lg:order-1">
            {/* Month Navigation - Horizontal Scroll */}
            <div class="mb-6 overflow-x-auto scrollbar-hide">
              <div class="flex gap-2 min-w-max pb-2">
                <a href="/calendar/1" class="px-3 py-2 text-primary font-bold underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">1月</a>
                <a href="/calendar/2" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">2月</a>
                <a href="/calendar/3" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">3月</a>
                <a href="/calendar/4" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">4月</a>
                <a href="/calendar/5" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">5月</a>
                <a href="/calendar/6" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">6月</a>
                <a href="/calendar/7" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">7月</a>
                <a href="/calendar/8" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">8月</a>
                <a href="/calendar/9" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">9月</a>
                <a href="/calendar/10" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">10月</a>
                <a href="/calendar/11" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">11月</a>
                <a href="/calendar/12" class="px-3 py-2 text-gray-600 hover:text-primary hover:underline transition-colors font-medium text-sm whitespace-nowrap flex-shrink-0">12月</a>
              </div>
            </div>


        {/* 毎年1月に流行るもの */}
        <div class="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
          <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i class="fas fa-fire text-orange-500"></i>
            毎年1月に流行るもの
          </h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            正月関連（おせち料理・初詣・お年玉）、冬の乾燥対策コスメ、新年の目標・習慣づくり、福袋・初売りセール、駅伝・箱根駅伝
          </p>
        </div>
        {/* イベント＆投稿ネタ 3カラム */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* イベント */}
          <div class="bg-gradient-to-b from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-calendar-day text-red-500 text-xs"></i>
              主要イベント
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">1/1</span>
                <span class="text-gray-700">元日</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">1/2-3</span>
                <span class="text-gray-700">正月休み</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">1/7</span>
                <span class="text-gray-700">七草がゆ</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="font-bold text-primary whitespace-nowrap">1/13</span>
                <span class="text-gray-700">成人の日（2025年）</span>
              </div>
            </div>
          </div>

          {/* みんなが見るテレビ */}
          <div class="bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-tv text-purple-500 text-xs"></i>
              みんなが見るTV
            </h3>
            <div class="space-y-2 text-sm text-gray-700">
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>紅白などの再放送</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>お正月特番</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>駅伝（1/2〜3）</span>
              </div>
              <div class="flex items-start gap-2">
                <i class="fas fa-circle text-xs text-purple-400 mt-1.5"></i>
                <span>冬ドラマ開始</span>
              </div>
            </div>
          </div>

          {/* 保存されやすいネタ */}
          <div class="bg-gradient-to-b from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <i class="fas fa-bookmark text-yellow-600 text-xs"></i>
              保存されやすいネタ
            </h3>
            <div class="space-y-2 text-sm">
              <div>
                <p class="font-bold text-gray-800 mb-1">ライフスタイル</p>
                <p class="text-gray-600 text-xs">初詣/帰省/カウコン</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">美容</p>
                <p class="text-gray-600 text-xs">正月太り/肌リセット</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">買い物</p>
                <p class="text-gray-600 text-xs">福袋/初売りアイテム</p>
              </div>
              <div>
                <p class="font-bold text-gray-800 mb-1">自己啓発</p>
                <p class="text-gray-600 text-xs">目標設定/手帳/習慣</p>
              </div>
            </div>
          </div>
        </div>

        {/* 週ごとのおすすめネタ */}
        <div class="mb-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-chart-line text-green-500 text-xs"></i>
            週ごとのおすすめネタ
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-md p-3 border border-green-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">1〜7日</span>
                <span class="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">正月ムード</span>
              </p>
              <p class="text-sm text-gray-700">カウコン/初詣/箱根駅伝/帰省ライフログ</p>
            </div>
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md p-3 border border-blue-200">
              <p class="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <span class="text-primary">8〜13日</span>
                <span class="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">スタート</span>
              </p>
              <p class="text-sm text-gray-700">成人式/年頭投稿/目標宣言</p>
            </div>
            <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
              <p class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span class="text-primary">14〜21日</span>
                <span class="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">リセット</span>
              </p>
              <p class="text-sm text-gray-700">正月疲れ/リセット投稿/習慣化</p>
            </div>
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <p class="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span class="text-primary">22〜31日</span>
                <span class="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">振り返り</span>
              </p>
              <p class="text-sm text-gray-700">冬セール最終/1月振り返り/2月予告</p>
            </div>
          </div>
        </div>

        {/* 赤髪Tips */}
        <div class="mb-6 bg-gradient-to-r from-red-100 via-pink-100 to-red-100 rounded-lg p-4 border border-red-300">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <i class="fas fa-lightbulb text-yellow-500"></i>
            赤髪Tips
          </h3>
          <div class="space-y-3">
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">①</span>
                「自己紹介＋2025年の方向性」は必ず1本出す
              </p>
              <p class="text-xs text-gray-700 ml-6">
                新年は新規フォロワーが増えやすい時期。あなたが誰で、今年何をするのかを伝えよう。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">②</span>
                目標は立派じゃなくていい
              </p>
              <p class="text-xs text-gray-700 ml-6">
                宣言するより、<strong>今やってる行動を中心に伝える</strong>ほうが効果的。口だけ人間よりも、実際に行動しているほうが憧れてもらいやすい。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <span class="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">③</span>
                買ってよかったもの or 福袋レビューは保存されやすさNo.1
              </p>
              <p class="text-xs text-gray-700 ml-6">
                年始の購買意欲が高い時期に、実体験ベースのレビューは超強力。
              </p>
            </div>
            <div class="bg-white/80 backdrop-blur rounded-md p-3">
              <p class="font-semibold text-primary mb-1 flex items-center gap-2 text-sm">
                <i class="fas fa-fire text-orange-500"></i>
                お正月（特に元旦）はSNSが見られやすい
              </p>
              <p class="text-sm text-gray-700">
                紅白なのか、箱根駅伝なのか、どのトレンドに乗っかるか<strong>事前に準備</strong>。正月企画をするのもあり。
                仕事はじめからは、世間のテンションは下がっていくから、そのテンション感をしっかり拾おう。
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div class="flex justify-between items-center">
          <span class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-400 rounded-lg text-sm cursor-not-allowed">
            <i class="fas fa-arrow-left"></i>
            12月
          </span>
          <a
            href="/"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            <i class="fas fa-home"></i>
            トップページ
          </a>
          <a
            href="/calendar/2"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
          >
            2月
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
          </div>
        </div>
      </main>
    </div>,
    {
      title: "1月のSNS運用カレンダー - Akagami.net",
      description: "1月のSNS運用に役立つイベント、バズワード、投稿ネタをまとめました。世間の空気を読んで効果的な投稿を！",
      keywords: "SNS運用,1月,カレンダー,イベント,投稿ネタ,お正月,福袋,目標設定"
    }
  )
})

// ============================================
// Categories Page Route
// ============================================
app.get('/categories', async (c) => {
  try {
    // Fetch all categories with PDF counts, ordered by pdf_count DESC
    const { results: categories } = await c.env.DB.prepare(`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.download_url,
        c.sort_order,
        COUNT(p.id) as pdf_count
      FROM categories c
      LEFT JOIN pdfs p ON c.id = p.category_id
      GROUP BY c.id, c.name, c.description, c.download_url, c.sort_order
      ORDER BY pdf_count DESC, c.name ASC
    `).all()

    return c.render(
      <div class="min-h-screen bg-white flex flex-col">
        <CommonHeader />

        {/* Main Content */}
        <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Content Area */}
            <div class="lg:col-span-3 order-1 lg:order-2">
          {/* Page Title */}
          <div class="mb-4">
            <h2 class="text-2xl font-bold text-gray-800 mb-1">
              <i class="fas fa-folder-open mr-2 text-primary"></i>
              カテゴリ一覧
            </h2>
            <p class="text-sm text-gray-600">資料をカテゴリごとに閲覧できます</p>
          </div>

          {/* Categories Grid - Compact 2 columns on mobile, 3 on desktop */}
          <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category: any) => (
              <a
                href={`/?category=${category.id}`}
                class="group bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-primary p-3"
              >
                {/* Category Name */}
                <h3 class="text-sm md:text-base font-bold text-gray-800 group-hover:text-primary transition-colors text-center mb-2">
                  {category.name}
                </h3>

                {/* PDF Count */}
                <div class="flex items-center justify-center pt-2 border-t border-gray-100">
                  <span class="text-lg md:text-xl font-bold text-primary">
                    {category.pdf_count}
                  </span>
                  <span class="text-xs text-gray-500 ml-1">件</span>
                </div>
              </a>
            ))}
          </div>

          {/* Back to Home Button */}
          <div class="mt-8 text-center">
            <a
              href="/"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
            >
              <i class="fas fa-home"></i>
              トップページに戻る
            </a>
          </div>

          {/* Usage Guide & Request Section */}
          <div class="mt-12 space-y-6">
            {/* Usage Guide */}
            <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-100">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i class="fas fa-lightbulb text-yellow-500"></i>
                資料の活用方法
              </h3>
              <div class="space-y-3 text-gray-700">
                <div class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-primary mt-1"></i>
                  <p class="text-sm md:text-base">
                    <strong>トレンド把握：</strong>最新のSNS動向やアルゴリズム変更をキャッチアップして、戦略を最適化
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-primary mt-1"></i>
                  <p class="text-sm md:text-base">
                    <strong>コンテンツ企画：</strong>成功事例やベストプラクティスを参考に、投稿内容を改善
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-primary mt-1"></i>
                  <p class="text-sm md:text-base">
                    <strong>数値分析：</strong>データに基づいた運用で、エンゲージメント率やフォロワー増加を実現
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-primary mt-1"></i>
                  <p class="text-sm md:text-base">
                    <strong>競合調査：</strong>他社の成功パターンを学び、自社アカウントに応用
                  </p>
                </div>
              </div>
            </div>

            {/* Request Section */}
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100">
              <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i class="fas fa-paper-plane text-blue-500"></i>
                資料リクエスト受付中！
              </h3>
              <div class="space-y-4">
                <p class="text-sm md:text-base text-gray-700">
                  「こんな資料が欲しい！」「このテーマについて深掘りしてほしい！」というご要望がありましたら、お気軽にお知らせください。
                </p>
                <div class="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <p class="text-sm md:text-base text-gray-700 mb-3">
                    <i class="fas fa-comment-dots text-primary mr-2"></i>
                    リクエストは<strong class="text-primary">赤髪のInstagram DM</strong>まで！
                  </p>
                  <a
                    href="https://www.instagram.com/akagami_sns/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl"
                  >
                    <i class="fab fa-instagram text-xl"></i>
                    <span>赤髪のInstagramへ</span>
                    <i class="fas fa-external-link-alt text-sm"></i>
                  </a>
                </div>
                <p class="text-xs text-gray-500">
                  ※ DMでのご質問・ご相談も大歓迎です。SNS運用でお困りのことがあれば、お気軽にどうぞ！
                </p>
              </div>
            </div>
          </div>
            </div>

            {/* Sidebar */}
            <CommonSidebar />
          </div>
        </main>
        
        <script src="/static/utils.js"></script>
        <script src="/static/auth.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Toggle mobile menu
            function toggleMobileMenu() {
              const sidebar = document.getElementById('sidebar');
              const overlay = document.getElementById('sidebar-overlay');
              
              if (sidebar && overlay) {
                const isHidden = sidebar.classList.contains('translate-x-full');
                
                if (isHidden) {
                  sidebar.classList.remove('translate-x-full');
                  overlay.classList.remove('hidden');
                } else {
                  sidebar.classList.add('translate-x-full');
                  overlay.classList.add('hidden');
                }
              }
            }
          `
        }} />
      </div>,
      {
        title: "カテゴリ一覧 - Akagami.net",
        description: "Akagami.netの全カテゴリ一覧。SNSマーケティング、生成AI関連の資料をカテゴリごとに閲覧できます。",
        keywords: "カテゴリ一覧,SNSマーケティング,生成AI,資料,YouTube,Instagram,TikTok"
      }
    )
  } catch (error: any) {
    return c.text('Error loading categories: ' + error.message, 500)
  }
})

// ============================================
// Home Page Route
// ============================================
app.get('/', (c) => {
  // Get category from query parameter
  const categoryId = c.req.query('category') ? parseInt(c.req.query('category') as string) : null
  
  // Get meta information based on category
  const meta = categoryId && categoryMeta[categoryId] 
    ? categoryMeta[categoryId]
    : {
        title: "Akagami.net - SNSマーケティング・生成AI資料保管庫",
        description: "YouTube、Instagram、TikTokなどのSNSマーケティングや生成AIに関する資料を無料で公開。カテゴリ別・タグ別に検索できる便利な資料管理システム。",
        keywords: "SNSマーケティング,YouTube,Instagram,TikTok,Threads,生成AI,マーケティング資料,無料資料,赤髪社長",
        name: null as string | null
      }
  
  return c.render(
    <div class="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header class="bg-primary shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <a href="/" class="hover:opacity-80 transition-opacity" aria-label="Akagami.net ホームページ">
              <h1 class="text-xl font-bold text-white tracking-wide">
                Akagami.net
              </h1>
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
              
              {/* User Account Section - Move to top */}
              <div id="user-account-section" class="mb-6">
                {/* This will be populated by auth.js */}
              </div>

              {/* Navigation Links */}
              <div class="mb-6 pb-6 border-b-2 border-gray-200">
                <a
                  href="/categories"
                  class="w-full px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors font-medium border-2 border-indigo-200 flex items-center justify-center gap-2 mb-3"
                  aria-label="資料一覧を開く"
                >
                  <i class="fas fa-folder-open"></i>
                  <span>資料一覧</span>
                </a>
                <a
                  href="/calendar/1"
                  class="w-full px-4 py-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg transition-colors font-medium border-2 border-pink-200 flex items-center justify-center gap-2 mb-3"
                  aria-label="SNS運用カレンダーを開く"
                >
                  <i class="fas fa-calendar-alt"></i>
                  <span>SNS運用カレンダー</span>
                </a>
                <a
                  href="/news"
                  class="w-full px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors font-medium border-2 border-yellow-200 flex items-center justify-center gap-2 mb-3"
                  aria-label="最新ニュースを開く"
                >
                  <i class="fas fa-newspaper"></i>
                  <span>最新ニュース</span>
                </a>
                <a
                  href="/question-finder"
                  class="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium border-2 border-blue-200 flex items-center justify-center gap-2 mb-3"
                  aria-label="キーワードチェックを開く"
                >
                  <i class="fas fa-search"></i>
                  <span>キーワードチェック</span>
                </a>
                <a
                  href="/infographics"
                  class="w-full px-4 py-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg transition-colors font-medium border-2 border-pink-300 flex items-center justify-center gap-2 mb-3"
                  aria-label="インフォグラフィック記事一覧を開く"
                >
                  <i class="fas fa-chart-bar"></i>
                  <span>インフォグラフィック</span>
                </a>
                <a
                  href="/sns-faq"
                  class="w-full px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors font-medium border-2 border-purple-200 flex items-center justify-center gap-2"
                  aria-label="よくある質問を開く"
                >
                  <i class="fas fa-question-circle"></i>
                  <span>よくある質問</span>
                </a>
              </div>

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
          
          <p class="text-sm text-gray-500 text-center">&copy; 2026 Akagami.net. All rights reserved.</p>
          
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                  <input 
                    type="email" 
                    id="register-email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="your@email.com"
                    required
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    <i class="fas fa-info-circle mr-1"></i>
                    メールアドレスだけで簡単登録！名前や詳細情報は後からマイページで入力できます。
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">パスワード（6文字以上・任意）</label>
                  <input 
                    type="password" 
                    id="register-password"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                    minlength="6"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    パスワードを設定しない場合、ログイン時にメールでマジックリンクが送信されます。
                  </p>
                </div>
              </div>

              {/* Error Message */}
              <div id="register-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>

              {/* Submit Button */}
              <button 
                type="submit"
                class="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold mb-4"
              >
                <i class="fas fa-user-plus mr-2"></i>会員登録（無料）
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

// ============================================
// News Page Route
// ============================================
app.get('/news', async (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>最新ニュース - Akagami.net</title>
        <meta name="description" content="SNS、AI、テクノロジー、マーケティングに関する最新ニュースをお届けします。" />
        
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
                  }
                }
              }
            }
          `
        }} />
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="/static/style.css" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes slide-up {
              from {
                transform: translateY(100%);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            .animate-slide-up {
              animation: slide-up 0.3s ease-out;
            }
            .line-clamp-4 {
              display: -webkit-box;
              -webkit-line-clamp: 4;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          `
        }} />
      </head>
      <body class="bg-gray-50 flex flex-col min-h-screen">
        <CommonHeader />

        {/* Main Content */}
        <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* News Content Area */}
            <div class="lg:col-span-3 order-1 lg:order-2">
              <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                  <i class="fas fa-newspaper text-primary mr-2"></i>
                  最新ニュース
                </h2>
                <p class="text-sm text-gray-600">SNS、AI、テクノロジー、マーケティングに関する最新情報</p>
              </div>

              <div id="news-list" class="space-y-6">
                <div class="text-center py-12">
                  <i class="fas fa-spinner fa-spin text-5xl text-primary mb-4"></i>
                  <p class="text-gray-600">読み込み中...</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <CommonSidebar />
          </div>
        </main>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/utils.js"></script>
        <script src="/static/auth.js"></script>
        <script src="/static/app.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            let newsData = [];
            let isAuthenticated = false;
            
            // Escape HTML to prevent XSS
            function escapeHtml(text) {
              if (!text) return '';
              const div = document.createElement('div');
              div.textContent = text;
              return div.innerHTML;
            }

            // Check authentication status
            async function checkAuth() {
              try {
                const response = await axios.get('/api/user/me', { withCredentials: true });
                isAuthenticated = response.data.authenticated;
              } catch (error) {
                isAuthenticated = false;
              }
            }

            // Load news articles with likes
            async function loadNews() {
              try {
                console.log('[NEWS] Loading news from API...');
                const response = await axios.get('/api/news-with-likes', { withCredentials: true });
                console.log('[NEWS] API response:', response.data.length, 'items');
                newsData = response.data;
                renderNews();
              } catch (error) {
                console.error('[NEWS] Failed to load news:', error);
                document.getElementById('news-list').innerHTML = \`
                  <div class="text-center py-12">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <p class="text-gray-600">ニュースの読み込みに失敗しました</p>
                  </div>
                \`;
              }
            }

            // Toggle like
            // Toggle like function - make it globally accessible
            window.toggleLike = async function(newsId, index) {
              if (!isAuthenticated) {
                showToast('いいねするにはログインが必要です', 'error');
                openAuthModal();
                return;
              }

              try {
                const response = await axios.post(\`/api/news/\${newsId}/like\`, {}, { withCredentials: true });
                
                // Update local data
                newsData[index].user_liked = response.data.liked ? 1 : 0;
                newsData[index].likes_count = response.data.liked 
                  ? parseInt(newsData[index].likes_count) + 1 
                  : parseInt(newsData[index].likes_count) - 1;
                
                // Re-render just this news item
                renderNews();
                
                showToast(response.data.liked ? 'いいねしました！' : 'いいねを取り消しました', 'success');
              } catch (error) {
                console.error('Failed to toggle like:', error);
                showToast('エラーが発生しました', 'error');
              }
            };

            // Render news list
            function renderNews() {
              console.log('[NEWS] Rendering news...', newsData.length, 'items');
              const newsListEl = document.getElementById('news-list');
              
              if (!newsListEl) {
                console.error('[NEWS] news-list element not found!');
                return;
              }
              
              if (newsData.length === 0) {
                console.log('[NEWS] No news data to render');
                newsListEl.innerHTML = \`
                  <div class="text-center py-12">
                    <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">ニュース記事がありません</p>
                  </div>
                \`;
                return;
              }
              
              console.log('[NEWS] Generating HTML for', newsData.length, 'items');
              const htmlContent = newsData.map((news, index) => {
                const date = new Date(news.published_at);
                const dateStr = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
                const likesCount = parseInt(news.likes_count) || 0;
                const userLiked = news.user_liked === 1;
                const likeButtonClass = userLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500';
                const likeIconClass = userLiked ? 'fas fa-heart' : 'far fa-heart';
                
                return \`
                  <article class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <!-- Mobile: Clickable card -->
                    <div class="md:hidden p-6">
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <div class="flex items-center gap-2">
                          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                            \${news.category}
                          </span>
                          <span class="text-sm text-gray-500">\${dateStr}</span>
                        </div>
                        <button 
                          onclick="event.stopPropagation(); toggleLike(\${news.id}, \${index})"
                          class="\${likeButtonClass} transition-colors flex items-center gap-1"
                          title="\${userLiked ? 'いいねを取り消す' : 'いいね'}"
                        >
                          <i class="\${likeIconClass}"></i>
                          <span class="text-sm">\${likesCount}</span>
                        </button>
                      </div>
                      <div class="cursor-pointer" onclick="showNewsDetail(\${index})">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">\${escapeHtml(news.title)}</h3>
                        <p class="text-gray-600 line-clamp-4">\${escapeHtml(news.summary)}</p>
                      </div>
                    </div>
                    
                    <!-- Desktop: Accordion style -->
                    <div class="hidden md:block p-6">
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <div class="flex items-center gap-2">
                          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                            \${news.category}
                          </span>
                          <span class="text-sm text-gray-500">\${dateStr}</span>
                        </div>
                        <button 
                          onclick="toggleLike(\${news.id}, \${index})"
                          class="\${likeButtonClass} transition-colors flex items-center gap-2 text-lg"
                          title="\${userLiked ? 'いいねを取り消す' : 'いいね'}"
                        >
                          <i class="\${likeIconClass}"></i>
                          <span class="text-sm">\${likesCount}</span>
                        </button>
                      </div>
                      <h3 class="text-xl font-bold text-gray-800 mb-2">\${escapeHtml(news.title)}</h3>
                      
                      <!-- Summary: 2 lines with read more -->
                      <div class="mb-4">
                        <p id="summary-\${index}" class="text-gray-600 line-clamp-2">\${escapeHtml(news.summary)}</p>
                        <button 
                          id="toggle-\${index}" 
                          onclick="toggleSummary(\${index})"
                          class="text-primary text-sm font-semibold mt-2 hover:underline flex items-center gap-1"
                        >
                          <span id="toggle-text-\${index}">続きを読む</span>
                          <i id="toggle-icon-\${index}" class="fas fa-chevron-down text-xs"></i>
                        </button>
                      </div>
                      
                      <a href="\${news.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                        <i class="fas fa-external-link-alt"></i>
                        元記事を読む（外部サイト）
                      </a>
                    </div>
                  </article>
                \`;
              }).join('');
              
              newsListEl.innerHTML = htmlContent;
              console.log('[NEWS] Render complete! HTML length:', htmlContent.length);
            }
            
            // Toggle summary expansion
            // Toggle summary expansion - make it globally accessible
            window.toggleSummary = function(index) {
              const summaryEl = document.getElementById(\`summary-\${index}\`);
              const toggleTextEl = document.getElementById(\`toggle-text-\${index}\`);
              const toggleIconEl = document.getElementById(\`toggle-icon-\${index}\`);
              
              if (summaryEl.classList.contains('line-clamp-2')) {
                summaryEl.classList.remove('line-clamp-2');
                toggleTextEl.textContent = '閉じる';
                toggleIconEl.classList.remove('fa-chevron-down');
                toggleIconEl.classList.add('fa-chevron-up');
              } else {
                summaryEl.classList.add('line-clamp-2');
                toggleTextEl.textContent = '続きを読む';
                toggleIconEl.classList.remove('fa-chevron-up');
                toggleIconEl.classList.add('fa-chevron-down');
              }
            }

            // Show news detail modal (for mobile)
            // Show news detail modal - make it globally accessible
            window.showNewsDetail = function(index) {
              const news = newsData[index];
              const date = new Date(news.published_at);
              const dateStr = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
              const likesCount = parseInt(news.likes_count) || 0;
              const userLiked = news.user_liked === 1;
              const likeButtonClass = userLiked 
                ? 'text-red-500' 
                : 'text-gray-400';
              const likeIconClass = userLiked ? 'fas fa-heart' : 'far fa-heart';
              
              // Create modal
              const modal = document.createElement('div');
              modal.id = 'news-detail-modal';
              modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center md:hidden';
              modal.onclick = (e) => {
                if (e.target === modal) closeNewsDetail();
              };
              
              modal.innerHTML = \`
                <div class="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-slide-up">
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-2">
                      <span class="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                        \${news.category}
                      </span>
                      <span class="text-sm text-gray-500">\${dateStr}</span>
                    </div>
                    <button onclick="closeNewsDetail()" class="text-gray-400 hover:text-gray-600">
                      <i class="fas fa-times text-2xl"></i>
                    </button>
                  </div>
                  
                  <h2 class="text-2xl font-bold text-gray-800 mb-4">\${escapeHtml(news.title)}</h2>
                  <p class="text-gray-600 mb-6 whitespace-pre-wrap">\${escapeHtml(news.summary)}</p>
                  
                  <div class="flex items-center gap-3 mb-4">
                    <button 
                      onclick="toggleLike(\${news.id}, \${index}); closeNewsDetail();"
                      class="\${likeButtonClass} transition-colors flex items-center gap-2 text-lg px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-red-300"
                    >
                      <i class="\${likeIconClass}"></i>
                      <span class="text-sm font-semibold">\${likesCount}</span>
                    </button>
                  </div>
                  
                  <a href="\${news.url}" target="_blank" rel="noopener noreferrer" class="block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    <i class="fas fa-external-link-alt mr-2"></i>
                    元記事を読む（外部サイト）
                  </a>
                </div>
              \`;
              
              document.body.appendChild(modal);
              document.body.style.overflow = 'hidden';
            }

            // Close news detail modal
            // Close news detail modal - make it globally accessible
            window.closeNewsDetail = function() {
              const modal = document.getElementById('news-detail-modal');
              if (modal) {
                modal.remove();
                document.body.style.overflow = '';
              }
            }

            // toggleMobileMenu is already defined in utils.js or will be defined globally
            // Toggle mobile menu (for hamburger menu)
            function toggleMobileMenu() {
              const sidebar = document.getElementById('sidebar');
              const overlay = document.getElementById('sidebar-overlay');
              
              if (sidebar && overlay) {
                sidebar.classList.toggle('translate-x-full');
                overlay.classList.toggle('hidden');
              }
            }

            // Initialize
            async function init() {
              console.log('[NEWS] Initializing news page...');
              await checkAuth();
              
              // Initialize categories in sidebar (from app.js)
              if (typeof loadCategories === 'function' && typeof renderCategoryFilter === 'function') {
                // Load categories and tags together
                await Promise.all([
                  loadCategories(),
                  typeof loadTags === 'function' ? loadTags() : Promise.resolve(),
                  typeof loadAllPdfsOnce === 'function' ? loadAllPdfsOnce() : Promise.resolve()
                ]);
                
                // Render categories only once, after all data is loaded
                renderCategoryFilter();
              }
              
              await loadNews();
            }
            
            // Wait for DOM and all scripts to be ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', init);
            } else {
              // DOM already loaded, but wait a bit for other scripts
              setTimeout(init, 100);
            }
          `
        }} />
        
        {/* External Scripts */}
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script defer src="/static/utils.js"></script>
        <script defer src="/static/auth.js"></script>
        <script defer src="/static/app.js"></script>
      </body>
    </html>
  )
})

// Infographic Articles List Page
app.get('/infographics', async (c) => {
  try {
    // Fetch all published infographic articles
    const { results: articles } = await c.env.DB.prepare(`
      SELECT 
        ia.id, ia.title, ia.slug, ia.category_id, ia.thumbnail_url,
        ia.summary, ia.sort_order, ia.created_at, ia.updated_at,
        cat.name as category_name
      FROM infographic_articles ia
      LEFT JOIN categories cat ON ia.category_id = cat.id
      WHERE ia.published = 1
      ORDER BY ia.sort_order ASC, ia.created_at DESC
    `).all()

    return c.render(
      <div class="min-h-screen bg-white flex flex-col">
        <CommonHeader />

        {/* Structured Data for Infographics Collection */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "インフォグラフィック記事一覧",
            "description": "データで見るSNSマーケティング・生成AIのインフォグラフィック記事一覧。視覚的にわかりやすく情報をお届けします。",
            "url": "https://akagami.net/infographics",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": articles.length,
              "itemListElement": articles.map((article: any, index: number) => ({
                "@type": "Article",
                "position": index + 1,
                "name": article.title,
                "description": article.summary || article.title,
                "url": `https://akagami.net/article/${article.slug}`,
                "datePublished": article.created_at,
                "dateModified": article.updated_at || article.created_at
              }))
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "ホーム",
                  "item": "https://akagami.net/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "インフォグラフィック",
                  "item": "https://akagami.net/infographics"
                }
              ]
            }
          })
        }} />

        {/* Main Content */}
        <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Content Area */}
            <div class="lg:col-span-3 order-1 lg:order-2">
              {/* Page Header */}
              <div class="mb-8 text-center lg:text-left">
                <h1 class="text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center lg:justify-start">
                  <i class="fas fa-chart-bar mr-3 text-pink-600 text-5xl"></i>
                  <span>インフォグラフィック記事</span>
                </h1>
                <p class="text-lg text-gray-600 mb-2">
                  データで見るSNSマーケティング・生成AIの最新トレンド
                </p>
                <p class="text-sm text-pink-600 font-semibold">
                  全{articles.length}件の記事
                </p>
              </div>

              {/* Articles Grid */}
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.length > 0 ? (
                  articles.map((article: any) => (
                    <a
                      href={`/article/${article.slug}`}
                      class="infographic-card bg-white hover:bg-pink-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 border-2 border-pink-400 group p-6 flex flex-col min-h-[240px]"
                    >
                      {/* Title */}
                      <h3 class="text-2xl font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-pink-600 transition-colors leading-tight">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      {article.summary && (
                        <p class="text-base text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                          {article.summary}
                        </p>
                      )}

                      {/* Meta */}
                      <div class="flex items-center justify-between text-sm text-gray-500 pt-4 border-t-2 border-gray-100 mt-auto">
                        <span class="flex items-center font-medium">
                          <i class="fas fa-calendar-alt mr-2 text-pink-500"></i>
                          {new Date(article.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                        </span>
                        {article.category_name && (
                          <span class="px-3 py-1.5 bg-pink-50 text-pink-600 rounded-full font-bold text-xs">
                            {article.category_name}
                          </span>
                        )}
                      </div>
                      </a>
                  ))
                ) : (
                  <div class="col-span-full text-center py-16">
                    <div class="inline-block p-8 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full mb-6">
                      <i class="fas fa-chart-bar text-7xl text-pink-400"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-700 mb-2">インフォグラフィック記事はまだありません</h3>
                    <p class="text-gray-500">新しい記事が公開されるまでお待ちください</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <CommonSidebar />
          </div>
        </main>
      </div>,
      {
        title: 'インフォグラフィック記事一覧 - Akagami.net',
        description: 'データで見るSNSマーケティング・生成AIのインフォグラフィック記事一覧。視覚的にわかりやすく情報をお届けします。',
        keywords: 'インフォグラフィック,SNSマーケティング,データ分析,生成AI,視覚化,赤髪社長'
      }
    )
  } catch (error) {
    console.error('Failed to fetch infographic articles:', error)
    return c.text('Internal Server Error', 500)
  }
})

// My Page - User dashboard
app.get('/mypage', (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>マイページ - Akagami.net</title>
        
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
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body class="bg-gray-50 min-h-screen flex flex-col">
        <CommonHeader />

        {/* Main Content */}
        <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div class="lg:col-span-3 order-1 lg:order-2">
              <div id="mypage-content" class="space-y-6">
                {/* Loading */}
                <div class="text-center py-12">
                  <i class="fas fa-spinner fa-spin text-5xl text-primary mb-4"></i>
                  <p class="text-gray-600">読み込み中...</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <CommonSidebar />
          </div>
        </main>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/utils.js"></script>
        <script src="/static/auth.js"></script>
        <script src="/static/app.js"></script>
        <script src="/static/mypage.js"></script>
      </body>
    </html>
  )
})

// Sitemap XML - Dynamic sitemap generation
app.get('/sitemap.xml', async (c) => {
  try {
    const baseUrl = 'https://akagami.net'
    
    // Fetch all published articles
    const { results: articles } = await c.env.DB.prepare(`
      SELECT slug, created_at
      FROM infographic_articles
      WHERE published = 1
      ORDER BY created_at DESC
    `).all()
    
    // Fetch all categories
    const { results: categories } = await c.env.DB.prepare(`
      SELECT id
      FROM categories
      ORDER BY id
    `).all()
    
    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/categories', priority: '0.9', changefreq: 'daily' },
      { url: '/infographics', priority: '0.9', changefreq: 'daily' },
      { url: '/news', priority: '0.8', changefreq: 'daily' },
      { url: '/sns-faq', priority: '0.8', changefreq: 'weekly' },
      { url: '/question-finder', priority: '0.7', changefreq: 'monthly' },
      { url: '/calendar/1', priority: '0.7', changefreq: 'weekly' },
    ]
    
    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${articles.map((article: any) => `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${new Date(article.created_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
${categories.map((category: any) => `  <url>
    <loc>${baseUrl}/?category=${category.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`
    
    return c.body(xml, 200, {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    })
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return c.text('Failed to generate sitemap', 500)
  }
})

// Question Finder - SNS運用ネタ向け質問生成ツール
app.get('/question-finder', (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>キーワードチェック - Akagami.net</title>
        
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
        <link href="/static/style.css" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in-up {
              animation: fade-in-up 0.3s ease-out;
            }
          `
        }} />
      </head>
      <body class="bg-gray-50 flex flex-col min-h-screen">
        <CommonHeader />
        
        <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div class="lg:col-span-3 order-1 lg:order-2">
              <div id="question-finder-app">
                <div class="min-h-screen flex items-center justify-center bg-gray-100">
                  <div class="text-center">
                    <i class="fas fa-spinner fa-spin text-5xl text-primary mb-4"></i>
                    <p class="text-gray-600">読み込み中...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <CommonSidebar />
          </div>
        </main>
        
        {/* Auth Modal */}
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
                    <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                    <input 
                      type="email" 
                      id="register-email"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="your@email.com"
                      required
                    />
                    <p class="mt-1 text-xs text-gray-500">
                      <i class="fas fa-info-circle mr-1"></i>
                      メールアドレスだけで簡単登録！名前や詳細情報は後からマイページで入力できます。
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">パスワード（6文字以上・任意）</label>
                    <input 
                      type="password" 
                      id="register-password"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="••••••••"
                      minlength="6"
                    />
                    <p class="mt-1 text-xs text-gray-500">
                      パスワードを設定しない場合、ログイン時にメールでマジックリンクが送信されます。
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                <div id="register-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  class="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold mb-4"
                >
                  <i class="fas fa-user-plus mr-2"></i>会員登録（無料）
                </button>
              </form>

              {/* Switch Mode */}
              <div id="switch-auth-mode" class="text-center text-sm text-gray-600">
                アカウントをお持ちでない方は <button type="button" onclick="switchToRegister()" class="text-primary hover:underline">こちら</button>
              </div>
            </div>
          </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script defer src="/static/utils.js"></script>
        <script defer src="/static/auth.js"></script>
        <script defer src="/static/app.js"></script>
        <script defer src="/static/question-finder.js?v=2026011410"></script>
      </body>
    </html>
  )
})

// Instagram FAQ Page
app.get('/instagram-faq', (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Instagram運用 よくある質問 - Akagami.net</title>
        <meta name="description" content="Instagram運用でよくある質問に赤髪が回答。フォロワーの増やし方、投稿のコツ、収益化まで現場のリアルな答えをまとめました。" />
        
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
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body class="bg-gray-50">
        <div id="faq-app">
          <div class="min-h-screen flex items-center justify-center bg-gray-100">
            <div class="text-center">
              <i class="fas fa-spinner fa-spin text-5xl text-primary mb-4"></i>
              <p class="text-gray-600">読み込み中...</p>
            </div>
          </div>
        </div>
        
        <script src="/static/utils.js"></script>
        <script src="/static/auth.js"></script>
        <script src="/static/instagram-faq.js?v=2026011402"></script>
      </body>
    </html>
  )
})

// TikTok FAQ Page
app.get('/tiktok-faq', (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TikTok運用 よくある質問 - Akagami.net</title>
        <meta name="description" content="TikTok運用でよくある質問に赤髪が回答。動画の作り方、バズらせ方、収益化まで現場のリアルな答えをまとめました。" />
        
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
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body class="bg-gray-50">
        <div id="faq-app">
          <div class="min-h-screen flex items-center justify-center bg-gray-100">
            <div class="text-center">
              <i class="fas fa-spinner fa-spin text-5xl text-primary mb-4"></i>
              <p class="text-gray-600">読み込み中...</p>
            </div>
          </div>
        </div>
        
        <script src="/static/utils.js"></script>
        <script src="/static/auth.js"></script>
        <script src="/static/instagram-faq.js?v=2026011402"></script>
      </body>
    </html>
  )
})

// Unified SNS FAQ Page
app.get('/sns-faq', (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SNS運用 よくある質問 - Akagami.net</title>
        <meta name="description" content="Instagram・TikTok・YouTube・Threadsなど、SNS運用でよくある質問に赤髪が回答。現場のリアルな答えをまとめました。" />
        
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
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body class="bg-gray-50 flex flex-col min-h-screen">
        <CommonHeader />

        <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <CommonSidebar />

            {/* FAQ Content Area */}
            <div class="lg:col-span-3 order-1 lg:order-2">
              <div id="faq-app">
                <div class="min-h-screen flex items-center justify-center bg-gray-100">
                  <div class="text-center">
                    <i class="fas fa-spinner fa-spin text-5xl text-primary mb-4"></i>
                    <p class="text-gray-600">読み込み中...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Auth Modal */}
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
                    <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                    <input 
                      type="email" 
                      id="register-email"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="your@email.com"
                      required
                    />
                    <p class="mt-1 text-xs text-gray-500">
                      <i class="fas fa-info-circle mr-1"></i>
                      メールアドレスだけで簡単登録！名前や詳細情報は後からマイページで入力できます。
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">パスワード（6文字以上・任意）</label>
                    <input 
                      type="password" 
                      id="register-password"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="••••••••"
                      minlength="6"
                    />
                    <p class="mt-1 text-xs text-gray-500">
                      パスワードを設定しない場合、ログイン時にメールでマジックリンクが送信されます。
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                <div id="register-error" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"></div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  class="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold mb-4"
                >
                  <i class="fas fa-user-plus mr-2"></i>会員登録（無料）
                </button>
              </form>

              {/* Switch Mode */}
              <div id="switch-auth-mode" class="text-center text-sm text-gray-600">
                アカウントをお持ちでない方は <button type="button" onclick="switchToRegister()" class="text-primary hover:underline">こちら</button>
              </div>
            </div>
          </div>
        </div>
        
        <script defer src="/static/utils.js"></script>
        <script defer src="/static/auth.js"></script>
        <script defer src="/static/app.js"></script>
        <script defer src="/static/sns-faq.js?v=2026011410"></script>
      </body>
    </html>
  )
})

// Instagram FAQ Admin Page
app.get('/admin/instagram-faq', (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SNS FAQ 管理 - Akagami.net</title>
        
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: '#e75556',
                    dark: '#333333',
                    darker: '#1a1a1a',
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
        {/* Header */}
        <header style="background-color: #2d2d2d; border-bottom: 2px solid #4b5563;">
          <div class="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-xl font-bold flex items-center" style="color: #f3f4f6;">
                  <i class="fas fa-comments mr-2" style="color: #e75556;"></i>
                  SNS FAQ 管理
                </h1>
                <p class="text-xs mt-0.5" style="color: #d1d5db;">よくある質問の追加・編集・削除</p>
              </div>
              <div class="flex gap-2">
                <a href="/admin" class="px-3 py-1.5 text-sm rounded-lg transition-all duration-300 font-medium shadow-md" style="background-color: #e75556; color: white;" aria-label="管理画面へ戻る">
                  <i class="fas fa-arrow-left mr-1" aria-hidden="true"></i><span class="hidden sm:inline">管理画面へ戻る</span><span class="sm:hidden">戻る</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div class="mb-4 flex flex-wrap gap-2">
            <button 
              data-category="all"
              onclick="filterByCategory('all')"
              class="px-4 py-2 rounded-lg transition-all duration-300 shadow-lg font-semibold text-sm"
              style="background-color: #4b5563; color: #f3f4f6;"
            >
              <i class="fas fa-th-large mr-2"></i>全て
            </button>
            <button 
              data-category="instagram"
              onclick="filterByCategory('instagram')"
              class="px-4 py-2 text-white rounded-lg transition-all duration-300 shadow-lg font-semibold text-sm"
              style="background-color: #E4405F;"
            >
              <i class="fab fa-instagram mr-2"></i>Instagram
            </button>
            <button 
              data-category="tiktok"
              onclick="filterByCategory('tiktok')"
              class="px-4 py-2 text-white rounded-lg transition-all duration-300 shadow-lg font-semibold text-sm"
              style="background-color: #000000;"
            >
              <i class="fab fa-tiktok mr-2"></i>TikTok
            </button>
            <button 
              data-category="youtube"
              onclick="filterByCategory('youtube')"
              class="px-4 py-2 text-white rounded-lg transition-all duration-300 shadow-lg font-semibold text-sm"
              style="background-color: #FF0000;"
            >
              <i class="fab fa-youtube mr-2"></i>YouTube
            </button>
            <button 
              data-category="threads"
              onclick="filterByCategory('threads')"
              class="px-4 py-2 text-white rounded-lg transition-all duration-300 shadow-lg font-semibold text-sm"
              style="background-color: #000000;"
            >
              <i class="fas fa-at mr-2"></i>Threads
            </button>
            <button 
              data-category="twitter"
              onclick="filterByCategory('twitter')"
              class="px-4 py-2 text-white rounded-lg transition-all duration-300 shadow-lg font-semibold text-sm"
              style="background-color: #000000;"
            >
              <i class="fab fa-x-twitter mr-2"></i>Twitter(X)
            </button>
            <button 
              data-category="line"
              onclick="filterByCategory('line')"
              class="px-4 py-2 text-white rounded-lg transition-all duration-300 shadow-lg font-semibold text-sm"
              style="background-color: #16a34a;"
            >
              <i class="fab fa-line mr-2"></i>LINE公式
            </button>
            <button 
              data-category="flame"
              onclick="filterByCategory('flame')"
              class="px-4 py-2 text-white rounded-lg transition-all duration-300 shadow-lg font-semibold text-sm"
              style="background-color: #dc2626;"
            >
              <i class="fas fa-fire-extinguisher mr-2"></i>炎上対応
            </button>
            <button 
              data-category="anti"
              onclick="filterByCategory('anti')"
              class="px-4 py-2 text-white rounded-lg transition-all duration-300 shadow-lg font-semibold text-sm"
              style="background-color: #8b5cf6;"
            >
              <i class="fas fa-shield-alt mr-2"></i>アンチ対応
            </button>
          </div>

          {/* Add Button */}
          <div class="mb-6">
            <button 
              onclick="showFAQForm()"
              class="w-full sm:w-auto px-6 py-3 text-white font-bold rounded-lg transition-all duration-300 shadow-lg"
              style="background-color: #e75556;"
            >
              <i class="fas fa-plus mr-2"></i>新規FAQ追加
            </button>
          </div>

          {/* FAQ List */}
          <div id="faq-list" class="space-y-4">
            <div class="text-center py-12" style="color: #9ca3af;">
              <i class="fas fa-spinner fa-spin text-5xl mb-4" style="color: #e75556;"></i>
              <p>読み込み中...</p>
            </div>
          </div>
        </div>

        {/* FAQ Form Modal */}
        <div id="faq-form-modal" class="hidden fixed inset-0 bg-black/70 z-50 items-center justify-center p-4">
          <div class="rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style="background-color: #2d2d2d; border: 2px solid #4b5563;">
            <div class="sticky top-0 border-b p-4 sm:p-6 flex items-center justify-between" style="background-color: #3a3a3a; border-color: #4b5563;">
              <h2 id="form-title" class="text-xl font-bold" style="color: #f3f4f6;">新規FAQ追加</h2>
              <button onclick="hideFAQForm()" class="transition-colors" style="color: #9ca3af;" onmouseover="this.style.color='#e75556'" onmouseout="this.style.color='#9ca3af'">
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>
            
            <div class="p-4 sm:p-6 space-y-4">
              <div>
                <label class="block text-sm font-semibold mb-2" style="color: #f3f4f6;">質問</label>
                <textarea 
                  id="faq-question"
                  rows="2"
                  class="w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all"
                  style="background-color: #1a1a1a; border: 2px solid #4b5563; color: #f3f4f6;"
                  placeholder="例: 投稿は毎日したほうがいいですか？"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-semibold mb-2" style="color: #f3f4f6;">回答</label>
                <textarea 
                  id="faq-answer"
                  rows="4"
                  class="w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all"
                  style="background-color: #1a1a1a; border: 2px solid #4b5563; color: #f3f4f6;"
                  placeholder="赤髪の回答を入力..."
                ></textarea>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-semibold mb-2" style="color: #f3f4f6;">SNSカテゴリ</label>
                  <select 
                    id="faq-sns-category"
                    class="w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all"
                    style="background-color: #1a1a1a; border: 2px solid #4b5563; color: #f3f4f6;"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="threads">Threads</option>
                    <option value="twitter">Twitter(X)</option>
                    <option value="line">LINE公式</option>
                    <option value="flame">炎上対応</option>
                    <option value="anti">アンチ対応</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-semibold mb-2" style="color: #f3f4f6;">表示順序</label>
                  <input 
                    type="number"
                    id="faq-sort-order"
                    min="0"
                    class="w-full px-4 py-2 rounded-lg focus:ring-2 focus:outline-none transition-all"
                    style="background-color: #1a1a1a; border: 2px solid #4b5563; color: #f3f4f6;"
                    placeholder="0"
                  />
                </div>
                
                <div class="flex items-end">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      id="faq-is-published"
                      checked
                      class="w-5 h-5 rounded focus:ring-2 transition-all"
                      style="accent-color: #e75556;"
                    />
                    <span class="text-sm font-semibold" style="color: #f3f4f6;">公開する</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="sticky bottom-0 p-4 sm:p-6 flex gap-3 border-t" style="background-color: #3a3a3a; border-color: #4b5563;">
              <button onclick="hideFAQForm()" class="flex-1 px-6 py-3 font-semibold rounded-lg transition-all duration-300 shadow-md" style="background-color: #4b5563; color: #f3f4f6;">
                キャンセル
              </button>
              <button onclick="saveFAQ()" class="flex-1 px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 shadow-md" style="background-color: #e75556;">
                保存
              </button>
            </div>
          </div>
        </div>
        <script src="/static/utils.js"></script>
        <script src="/static/auth.js"></script>
        <script src="/static/faq-admin.js?v=2026011501"></script>
      </body>
    </html>
  )
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
        <title>Akagami.net - 管理画面</title>
        
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
        <script src="/static/utils.js" defer></script>
        <script src="/static/admin.js" defer></script>
      </body>
    </html>
  )
})

// Admin News Management Page
app.get('/admin/news', (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ニュース管理 - Akagami.net</title>
        
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
        <div id="news-admin-app">
          <div class="text-center py-12 text-gray-300">
            <i class="fas fa-spinner fa-spin text-4xl mb-4 text-primary"></i>
            <p>読み込み中...</p>
          </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js" defer></script>
        <script src="/static/utils.js" defer></script>
        <script src="/static/news-admin.js?v=2026011402" defer></script>
      </body>
    </html>
  )
})

// Article Management Page
app.get('/admin/articles', requireAuth, (c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>インフォグラフィック記事管理 - Akagami.net</title>
        
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
        {/* Monaco Editor */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/editor/editor.main.css" />
      </head>
      <body class="admin-dark bg-darker">
        <div id="articles-admin-app">
          <div class="text-center py-12 text-gray-300">
            <i class="fas fa-spinner fa-spin text-4xl mb-4 text-primary"></i>
            <p>読み込み中...</p>
          </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/utils.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js"></script>
        <script src="/static/articles-admin.js?v=2026011503"></script>
      </body>
    </html>
  )
})

// Infographic Article Display Page
app.get('/article/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    
    // Fetch article data
    const { results } = await c.env.DB.prepare(`
      SELECT 
        ia.id, ia.title, ia.slug, ia.category_id, ia.content,
        ia.summary, ia.created_at, ia.updated_at,
        cat.name as category_name
      FROM infographic_articles ia
      LEFT JOIN categories cat ON ia.category_id = cat.id
      WHERE ia.slug = ? AND ia.published = 1
    `).bind(slug).all()
    
    if (!results || results.length === 0) {
      return c.notFound()
    }
    
    const article = results[0]
    
    return c.html(
      <html lang="ja">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>{article.title} - Akagami.net</title>
          <meta name="description" content={article.summary || article.title} />
          
          {/* OGP Tags */}
          <meta property="og:title" content={`${article.title} - Akagami.net`} />
          <meta property="og:description" content={article.summary || article.title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://akagami.net/article/${slug}`} />
          <meta property="og:site_name" content="Akagami.net" />
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={article.title} />
          <meta name="twitter:description" content={article.summary || article.title} />
          
          {/* Structured Data (JSON-LD) for SEO and AI */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": article.title,
              "description": article.summary || article.title,
              "author": {
                "@type": "Person",
                "name": "Akagami",
                "url": "https://www.instagram.com/akagami_sns/"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Akagami.net",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://akagami.net/favicon-512.png"
                }
              },
              "datePublished": article.created_at,
              "dateModified": article.updated_at || article.created_at,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://akagami.net/article/${slug}`
              },
              "articleSection": article.category_name || "SNSマーケティング",
              "keywords": `${article.category_name || "SNS"},マーケティング,インフォグラフィック,データ分析`,
              "inLanguage": "ja-JP",
              "isAccessibleForFree": true
            })
          }} />
          
          {/* Breadcrumb Structured Data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "ホーム",
                  "item": "https://akagami.net/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "インフォグラフィック",
                  "item": "https://akagami.net/infographics"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": article.title,
                  "item": `https://akagami.net/article/${slug}`
                }
              ]
            })
          }} />

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
          
          {/* Tailwind CSS CDN for article styling */}
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
          
          {/* Font Awesome */}
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
          
          {/* Google Fonts - Noto Sans JP */}
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
          
          <link rel="stylesheet" href="/static/style.css" />
        </head>
        <body class="bg-gray-50">
          {/* Header */}
          <header class="bg-primary shadow-lg sticky top-0 z-40">
            <div class="max-w-7xl mx-auto px-4 py-3">
              <div class="flex items-center justify-between">
                <a href="/" class="hover:opacity-80 transition-opacity">
                  <h1 class="text-xl font-bold text-white tracking-wide">Akagami.net</h1>
                </a>
                <button 
                  onclick="toggleMobileMenu()"
                  class="lg:hidden text-white p-2 hover:bg-red-600 rounded-lg transition-colors"
                  aria-label="メニューを開く"
                >
                  <i class="fas fa-bars text-2xl"></i>
                </button>
              </div>
            </div>
          </header>
          
          {/* Sidebar Overlay */}
          <div 
            id="sidebar-overlay" 
            class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden lg:hidden"
            onclick="toggleMobileMenu()"
          ></div>
          
          {/* Main Content with Sidebar */}
          <main class="max-w-7xl mx-auto px-4 py-6">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Same as homepage */}
              <CommonSidebar />
              
              {/* Article Content */}
              <div class="lg:col-span-3 order-1 lg:order-1">
                {/* Back Button */}
                <div class="mb-4">
                  <a href="/" class="inline-flex items-center gap-2 text-primary hover:underline">
                    <i class="fas fa-arrow-left"></i>
                    <span>トップページへ戻る</span>
                  </a>
                </div>
                
                {/* Article Content - Raw HTML */}
                <div id="article-content" dangerouslySetInnerHTML={{ __html: article.content }}></div>
              </div>
            </div>
          </main>
          
          <script src="/static/utils.js"></script>
          <script src="/static/auth.js"></script>
          <script src="/static/app.js"></script>
        </body>
      </html>
    )
  } catch (error) {
    console.error('Failed to load article:', error)
    return c.notFound()
  }
})

// 404 Not Found Page
app.notFound((c) => {
  return c.html(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>404 Not Found - Akagami.net</title>
        
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
            <p>&copy; 2026 Akagami.net. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  )
})

// ============================================
// Scheduled Job - Daily New User Summary
// ============================================
export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext) {
    // Run daily at 9:00 AM JST (00:00 UTC)
    try {
      // Get users registered in the last 24 hours
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString()
      
      const { results: newUsers } = await env.DB.prepare(`
        SELECT id, name, email, login_method, created_at
        FROM users
        WHERE created_at >= ?
        ORDER BY created_at DESC
      `).bind(yesterdayStr).all()
      
      // Only send email if there are new users
      if (newUsers && newUsers.length > 0) {
        // Create HTML table
        const userRows = newUsers.map((user: any) => {
          const registrationDate = new Date(user.created_at).toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
          return `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px; text-align: center;">${user.id}</td>
              <td style="padding: 12px;">${user.name}</td>
              <td style="padding: 12px;">${user.email}</td>
              <td style="padding: 12px; text-align: center;">${user.login_method === 'password' ? 'パスワード' : 'マジックリンク'}</td>
              <td style="padding: 12px; text-align: center;">${registrationDate}</td>
            </tr>
          `
        }).join('')
        
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #e75556 0%, #ff6b6b 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">📊 新規会員登録レポート</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Akagami.net</p>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="font-size: 18px; font-weight: bold; color: #e75556; margin-top: 0;">
                過去24時間で <span style="font-size: 24px;">${newUsers.length}</span> 名の新規会員が登録されました！
              </p>
              
              <table style="width: 100%; border-collapse: collapse; background: white; margin-top: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <thead>
                  <tr style="background: #e75556; color: white;">
                    <th style="padding: 12px; text-align: center;">会員番号</th>
                    <th style="padding: 12px; text-align: left;">名前</th>
                    <th style="padding: 12px; text-align: left;">メールアドレス</th>
                    <th style="padding: 12px; text-align: center;">認証方法</th>
                    <th style="padding: 12px; text-align: center;">登録日時</th>
                  </tr>
                </thead>
                <tbody>
                  ${userRows}
                </tbody>
              </table>
              
              <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #e75556;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #e75556;">📈 管理画面で詳細を確認</p>
                <a href="https://akagami-research.pages.dev/admin" 
                   style="display: inline-block; padding: 12px 24px; background: #e75556; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  管理画面を開く
                </a>
              </div>
              
              <p style="margin-top: 30px; font-size: 14px; color: #6b7280; text-align: center;">
                このメールは毎日自動的に送信されます。<br>
                © 2026 Akagami.net. All rights reserved.
              </p>
            </div>
          </body>
          </html>
        `
        
        const text = `
【新規会員登録レポート - Akagami.net】

過去24時間で ${newUsers.length} 名の新規会員が登録されました！

${newUsers.map((user: any, index: number) => {
  const registrationDate = new Date(user.created_at).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  return `
${index + 1}. 会員番号: ${user.id}
   名前: ${user.name}
   メールアドレス: ${user.email}
   認証方法: ${user.login_method === 'password' ? 'パスワード' : 'マジックリンク'}
   登録日時: ${registrationDate}
  `
}).join('\n')}

管理画面: https://akagami-research.pages.dev/admin

---
このメールは毎日自動的に送信されます。
© 2026 Akagami.net. All rights reserved.
        `
        
        await sendEmail({
          to: 'akagami.syatyo@gmail.com',
          subject: `[Akagami.net] 新規会員登録レポート (${newUsers.length}名)`,
          html,
          text
        }, env)
        
        console.log(`Daily summary email sent: ${newUsers.length} new users`)
      } else {
        console.log('No new users in the last 24 hours')
      }
    } catch (error: any) {
      console.error('Scheduled job error:', error)
    }
  }
}
