import { sign, verify } from 'hono/jwt'
import { getCookie, setCookie } from 'hono/cookie'
import type { Context } from 'hono'

const TOKEN_NAME = 'admin_token'
const TOKEN_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

// Generate JWT token
export async function generateToken(secret: string): Promise<string> {
  const payload = {
    admin: true,
    exp: Math.floor(Date.now() / 1000) + TOKEN_MAX_AGE,
  }
  // Explicitly specify algorithm
  return await sign(payload, secret, 'HS256')
}

// Verify JWT token
export async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    // Explicitly specify algorithm to match signing
    await verify(token, secret, 'HS256')
    return true
  } catch (error) {
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
