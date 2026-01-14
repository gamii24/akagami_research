import { sign, verify } from 'hono/jwt'
import { getCookie, setCookie } from 'hono/cookie'
import type { Context } from 'hono'

const TOKEN_NAME = 'admin_token'
const TOKEN_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

// Generate JWT token
export async function generateToken(secret: string): Promise<string> {
  console.log('Generating token with secret:', secret.substring(0, 10) + '...')
  const payload = {
    admin: true,
    exp: Math.floor(Date.now() / 1000) + TOKEN_MAX_AGE,
  }
  const token = await sign(payload, secret)
  console.log('Token generated:', token.substring(0, 30) + '...')
  return token
}

// Verify JWT token
export async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    console.log('Verifying token with secret:', secret.substring(0, 10) + '...')
    const payload = await verify(token, secret)
    console.log('Token verified successfully, payload:', payload)
    return true
  } catch (error) {
    console.error('Token verification failed:', error)
    return false
  }
}

// Set auth cookie
export function setAuthCookie(c: Context, token: string) {
  // Auto-detect HTTPS environment
  const isProduction = c.req.url.startsWith('https://')
  
  setCookie(c, TOKEN_NAME, token, {
    maxAge: TOKEN_MAX_AGE,
    httpOnly: true,
    secure: isProduction, // Auto-detect: true for HTTPS, false for local dev
    sameSite: 'Lax',
    path: '/',
  })
}

// Get auth token from cookie
export function getAuthToken(c: Context): string | undefined {
  return getCookie(c, TOKEN_NAME)
}

// Clear auth cookie
export function clearAuthCookie(c: Context) {
  setCookie(c, TOKEN_NAME, '', {
    maxAge: 0,
    path: '/',
  })
}

// Check if user is authenticated
export async function isAuthenticated(c: Context, secret: string): Promise<boolean> {
  const token = getAuthToken(c)
  if (!token) return false
  return await verifyToken(token, secret)
}
