// ============================================
// User Authentication Module
// ============================================

// Check authentication status on page load
async function checkAuthStatus() {
  try {
    const response = await fetch('/api/user/me', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      
      if (data.authenticated && data.user) {
        state.isAuthenticated = true
        state.user = data.user
        
        // Sync local storage data to server
        await syncLocalDataToServer()
        
        // Load server data
        await loadUserData()
        
        updateAuthUI()
        return true
      }
    }
    
    state.isAuthenticated = false
    state.user = null
    updateAuthUI()
    return false
  } catch (error) {
    console.error('Auth check failed:', error)
    state.isAuthenticated = false
    state.user = null
    updateAuthUI()
    return false
  }
}

// Sync localStorage data to server after login
async function syncLocalDataToServer() {
  try {
    // Sync downloaded PDFs
    if (state.downloadedPdfs.size > 0) {
      const pdfIds = Array.from(state.downloadedPdfs)
      await fetch('/api/user/downloads/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pdfIds })
      })
    }
    
    // Sync favorite PDFs
    if (state.favoritePdfs.size > 0) {
      const pdfIds = Array.from(state.favoritePdfs)
      await fetch('/api/user/favorites/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pdfIds })
      })
    }
  } catch (error) {
    console.error('Failed to sync local data:', error)
  }
}

// Load user data from server
async function loadUserData() {
  try {
    // Load download history
    const downloadsRes = await fetch('/api/user/downloads', {
      credentials: 'include'
    })
    
    if (downloadsRes.ok) {
      const downloads = await downloadsRes.json()
      state.downloadedPdfs = new Set(downloads.map(d => d.pdf_id))
      
      // Save to localStorage
      localStorage.setItem('downloaded_pdfs', JSON.stringify(Array.from(state.downloadedPdfs)))
    }
    
    // Load favorites
    const favoritesRes = await fetch('/api/user/favorites', {
      credentials: 'include'
    })
    
    if (favoritesRes.ok) {
      const favorites = await favoritesRes.json()
      state.favoritePdfs = new Set(favorites.map(f => f.pdf_id))
      
      // Save to localStorage
      localStorage.setItem('favorite_pdfs', JSON.stringify(Array.from(state.favoritePdfs)))
    }
    
    // Reload PDF list to reflect changes
    await loadPDFs()
  } catch (error) {
    console.error('Failed to load user data:', error)
  }
}

// Update UI based on authentication status
function updateAuthUI() {
  const userAccountSection = document.getElementById('user-account-section')
  
  if (!userAccountSection) return
  
  if (state.isAuthenticated && state.user) {
    // Show user info and menu
    userAccountSection.innerHTML = `
      <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
        <div class="flex items-center gap-2 mb-3">
          <i class="fas fa-user-circle text-2xl text-blue-600"></i>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate">${escapeHtml(state.user.name)}</p>
            <p class="text-xs text-gray-600 truncate">${escapeHtml(state.user.email)}</p>
          </div>
        </div>
        <div class="space-y-2">
          <button 
            onclick="showMyPage()"
            class="w-full px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm flex items-center gap-2 border border-gray-200"
          >
            <i class="fas fa-user"></i>
            <span>マイページ</span>
          </button>
          <button 
            onclick="showNotificationSettings()"
            class="w-full px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm flex items-center gap-2 border border-gray-200"
          >
            <i class="fas fa-bell"></i>
            <span>通知設定</span>
          </button>
          <button 
            onclick="handleLogout()"
            class="w-full px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm flex items-center gap-2 border border-red-200"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>ログアウト</span>
          </button>
        </div>
      </div>
    `
  } else {
    // Show login/register buttons
    userAccountSection.innerHTML = `
      <button 
        onclick="showLoginModal()"
        class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold shadow-sm flex items-center justify-center gap-2 mb-4"
        aria-label="ログイン"
      >
        <i class="fas fa-sign-in-alt"></i>
        <span>ログイン / 会員登録</span>
      </button>
    `
  }
}

// Show login modal
function showLoginModal() {
  const modal = document.getElementById('auth-modal')
  const modalTitle = document.getElementById('auth-modal-title')
  const authForm = document.getElementById('auth-form')
  const switchModeBtn = document.getElementById('switch-auth-mode')
  
  if (modal && modalTitle && switchModeBtn) {
    modalTitle.textContent = 'ログイン'
    switchModeBtn.innerHTML = 'アカウントをお持ちでない方は <button type="button" onclick="switchToRegister()" class="text-red-600 hover:underline">こちら</button>'
    
    // Show password login by default
    document.getElementById('password-login-form').classList.remove('hidden')
    document.getElementById('magic-link-form').classList.add('hidden')
    document.getElementById('register-form').classList.add('hidden')
    
    modal.classList.remove('hidden')
    modal.classList.add('flex')
  }
}

// Show register modal
function showRegisterModal() {
  const modal = document.getElementById('auth-modal')
  const modalTitle = document.getElementById('auth-modal-title')
  const authForm = document.getElementById('auth-form')
  const switchModeBtn = document.getElementById('switch-auth-mode')
  
  if (modal && modalTitle && switchModeBtn) {
    modalTitle.textContent = '会員登録'
    switchModeBtn.innerHTML = 'すでにアカウントをお持ちの方は <button type="button" onclick="switchToLogin()" class="text-red-600 hover:underline">こちら</button>'
    
    // Show register form
    document.getElementById('password-login-form').classList.add('hidden')
    document.getElementById('magic-link-form').classList.add('hidden')
    document.getElementById('register-form').classList.remove('hidden')
    
    modal.classList.remove('hidden')
    modal.classList.add('flex')
  }
}

// Switch to register mode
function switchToRegister() {
  showRegisterModal()
}

// Switch to login mode
function switchToLogin() {
  showLoginModal()
}

// Switch to magic link login
function switchToMagicLink() {
  document.getElementById('password-login-form').classList.add('hidden')
  document.getElementById('register-form').classList.add('hidden')
  document.getElementById('magic-link-form').classList.remove('hidden')
}

// Switch to password login
function switchToPasswordLogin() {
  document.getElementById('magic-link-form').classList.add('hidden')
  document.getElementById('register-form').classList.add('hidden')
  document.getElementById('password-login-form').classList.remove('hidden')
}

// Close auth modal
function closeAuthModal() {
  const modal = document.getElementById('auth-modal')
  if (modal) {
    modal.classList.add('hidden')
    modal.classList.remove('flex')
    
    // Clear forms
    document.getElementById('login-email').value = ''
    document.getElementById('login-password').value = ''
    document.getElementById('register-name').value = ''
    document.getElementById('register-email').value = ''
    document.getElementById('register-password').value = ''
    document.getElementById('register-password-confirm').value = ''
    document.getElementById('magic-link-email').value = ''
  }
}

// Handle password login
async function handlePasswordLogin(event) {
  event.preventDefault()
  
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value
  const errorDiv = document.getElementById('login-error')
  const submitBtn = event.target.querySelector('button[type="submit"]')
  
  if (!email || !password) {
    errorDiv.textContent = 'メールアドレスとパスワードを入力してください'
    errorDiv.classList.remove('hidden')
    return
  }
  
  errorDiv.classList.add('hidden')
  
  // Show loading state
  const originalBtnContent = submitBtn.innerHTML
  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>ログイン中...'
  
  try {
    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, loginMethod: 'password' })
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      // Login successful
      submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>ログイン成功！'
      
      await checkAuthStatus()
      
      setTimeout(() => {
        closeAuthModal()
        // Show success message
        alert('ログインしました')
      }, 500)
    } else {
      submitBtn.disabled = false
      submitBtn.innerHTML = originalBtnContent
      errorDiv.textContent = data.error || 'ログインに失敗しました'
      errorDiv.classList.remove('hidden')
    }
  } catch (error) {
    console.error('Login error:', error)
    submitBtn.disabled = false
    submitBtn.innerHTML = originalBtnContent
    errorDiv.textContent = 'ログインに失敗しました。もう一度お試しください。'
    errorDiv.classList.remove('hidden')
  }
}

// Handle user registration
async function handleRegister(event) {
  event.preventDefault()
  
  const name = document.getElementById('register-name').value
  const email = document.getElementById('register-email').value
  const password = document.getElementById('register-password').value
  const passwordConfirm = document.getElementById('register-password-confirm').value
  const errorDiv = document.getElementById('register-error')
  const submitBtn = event.target.querySelector('button[type="submit"]')
  
  if (!name || !email || !password || !passwordConfirm) {
    errorDiv.textContent = 'すべての項目を入力してください'
    errorDiv.classList.remove('hidden')
    return
  }
  
  if (password !== passwordConfirm) {
    errorDiv.textContent = 'パスワードが一致しません'
    errorDiv.classList.remove('hidden')
    return
  }
  
  if (password.length < 8) {
    errorDiv.textContent = 'パスワードは8文字以上で入力してください'
    errorDiv.classList.remove('hidden')
    return
  }
  
  errorDiv.classList.add('hidden')
  
  // Show loading state
  const originalBtnContent = submitBtn.innerHTML
  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>登録中...'
  
  try {
    const response = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, loginMethod: 'password' })
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      // Registration successful
      submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>登録完了！'
      
      await checkAuthStatus()
      
      setTimeout(() => {
        closeAuthModal()
        // Show success message
        alert('会員登録が完了しました')
      }, 500)
    } else {
      submitBtn.disabled = false
      submitBtn.innerHTML = originalBtnContent
      errorDiv.textContent = data.error || '会員登録に失敗しました'
      errorDiv.classList.remove('hidden')
    }
  } catch (error) {
    console.error('Registration error:', error)
    submitBtn.disabled = false
    submitBtn.innerHTML = originalBtnContent
    errorDiv.textContent = '会員登録に失敗しました。もう一度お試しください。'
    errorDiv.classList.remove('hidden')
  }
}

// Handle magic link request
async function handleMagicLinkRequest(event) {
  event.preventDefault()
  
  const email = document.getElementById('magic-link-email').value
  const errorDiv = document.getElementById('magic-link-error')
  const successDiv = document.getElementById('magic-link-success')
  const submitBtn = event.target.querySelector('button[type="submit"]')
  
  if (!email) {
    errorDiv.textContent = 'メールアドレスを入力してください'
    errorDiv.classList.remove('hidden')
    successDiv.classList.add('hidden')
    return
  }
  
  errorDiv.classList.add('hidden')
  successDiv.classList.add('hidden')
  
  // Show loading state
  const originalBtnContent = submitBtn.innerHTML
  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>送信中...'
  
  try {
    const response = await fetch('/api/user/send-magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>送信完了！'
      successDiv.textContent = 'ログインリンクをメールで送信しました。メールをご確認ください。'
      successDiv.classList.remove('hidden')
      
      // Clear email input
      document.getElementById('magic-link-email').value = ''
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.disabled = false
        submitBtn.innerHTML = originalBtnContent
      }, 3000)
    } else {
      submitBtn.disabled = false
      submitBtn.innerHTML = originalBtnContent
      errorDiv.textContent = data.error || 'ログインリンクの送信に失敗しました'
      errorDiv.classList.remove('hidden')
    }
  } catch (error) {
    console.error('Magic link error:', error)
    submitBtn.disabled = false
    submitBtn.innerHTML = originalBtnContent
    errorDiv.textContent = 'ログインリンクの送信に失敗しました。もう一度お試しください。'
    errorDiv.classList.remove('hidden')
  }
}

// Handle magic link verification (called on page load with token)
async function verifyMagicLink(token) {
  try {
    const response = await fetch('/api/user/verify-magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token })
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      // Remove token from URL
      window.history.replaceState({}, document.title, '/')
      
      await checkAuthStatus()
      alert('ログインしました')
    } else {
      alert('ログインリンクが無効または期限切れです')
    }
  } catch (error) {
    console.error('Magic link verification error:', error)
    alert('ログインに失敗しました')
  }
}

// Handle user logout
async function handleLogout() {
  try {
    const response = await fetch('/api/user/logout', {
      method: 'POST',
      credentials: 'include'
    })
    
    if (response.ok) {
      state.isAuthenticated = false
      state.user = null
      updateAuthUI()
      
      alert('ログアウトしました')
      
      // Reload page to clear local state
      window.location.reload()
    }
  } catch (error) {
    console.error('Logout error:', error)
    alert('ログアウトに失敗しました')
  }
}

// Show my page
function showMyPage() {
  window.location.href = '/mypage'
}

// Show notification settings
function showNotificationSettings() {
  window.location.href = '/notifications'
}

// Utility function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Check for magic link token on page load
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  
  if (token) {
    await verifyMagicLink(token)
  } else {
    // Check authentication status on page load
    await checkAuthStatus()
  }
})

// Manual check auth - only call when user opens menu or interacts
async function manualCheckAuth() {
  if (state.isAuthenticated) {
    // Already checked
    return
  }
  await checkAuthStatus()
}
