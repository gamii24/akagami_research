// User authentication helper functions
import type { Context } from 'hono'
import { sign, verify } from 'hono/jwt'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

// Password hashing using Web Crypto API (available in Cloudflare Workers)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

// Generate random token for magic link
export function generateMagicLinkToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Generate JWT token for user session
export async function generateUserToken(userId: number, secret: string): Promise<string> {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  }
  return await sign(payload, secret, 'HS256')
}

// Verify JWT token
export async function verifyUserToken(token: string, secret: string): Promise<{ userId: number } | null> {
  try {
    const payload = await verify(token, secret, 'HS256')
    if (typeof payload.userId === 'number') {
      return { userId: payload.userId }
    }
    return null
  } catch (error) {
    return null
  }
}

// Set user session cookie
export function setUserSessionCookie(c: Context, token: string): void {
  // Auto-detect HTTPS environment
  const isProduction = c.req.url.startsWith('https://')
  
  setCookie(c, 'user_token', token, {
    httpOnly: true,
    secure: isProduction, // Auto-detect: true for HTTPS, false for local dev
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
}

// Clear user session cookie
export function clearUserSessionCookie(c: Context): void {
  deleteCookie(c, 'user_token', {
    path: '/',
  })
}

// Get current user from cookie
export async function getCurrentUser(c: Context, secret: string): Promise<{ userId: number } | null> {
  const token = getCookie(c, 'user_token')
  if (!token) return null
  return await verifyUserToken(token, secret)
}

// Check if user is authenticated
export async function isUserAuthenticated(c: Context, secret: string): Promise<boolean> {
  const user = await getCurrentUser(c, secret)
  return user !== null
}

// User authentication middleware
export async function requireUserAuth(c: Context, next: () => Promise<void>, secret: string) {
  const user = await getCurrentUser(c, secret)
  
  if (!user) {
    return c.json({ error: 'Unauthorized. Please login.' }, 401)
  }
  
  // Store user info in context
  c.set('userId', user.userId)
  
  await next()
}
