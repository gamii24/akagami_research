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
        // Check if state exists (for pages that use state)
        if (typeof state !== 'undefined') {
          state.isAuthenticated = true
          state.user = data.user
        }
        
        // Update UI immediately for fast menu display
        updateAuthUI()
        
        // Sync local storage data to server (background) - only if state exists
        if (typeof state !== 'undefined' && typeof syncLocalDataToServer !== 'undefined') {
          syncLocalDataToServer().catch(err => console.error('Sync failed:', err))
        }
        
        // Load server data (background) - only if function exists
        if (typeof loadUserData !== 'undefined') {
          loadUserData().catch(err => console.error('Load user data failed:', err))
        }
        
        return true
      }
    }
    
    // Check if state exists
    if (typeof state !== 'undefined') {
      state.isAuthenticated = false
      state.user = null
    }
    updateAuthUI()
    return false
  } catch (error) {
    if (typeof state !== 'undefined') {
      state.isAuthenticated = false
      state.user = null
    }
    updateAuthUI()
    return false
  }
}

// Sync localStorage data to server after login
async function syncLocalDataToServer() {
  // Check if state exists
  if (typeof state === 'undefined') {
    return
  }
  
  try {
    // Sync downloaded PDFs
    if (state.downloadedPdfs && state.downloadedPdfs.size > 0) {
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
  }
}

// Update UI based on authentication status
function updateAuthUI() {
  const userAccountSection = document.getElementById('user-account-section')
  
  if (!userAccountSection) return
  
  if (state.isAuthenticated && state.user) {
    // Show user menu - only MyPage button with double height
    userAccountSection.innerHTML = `
      <div class="mb-4">
        <button 
          onclick="showMyPage()"
          class="w-full px-4 py-5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-base flex items-center justify-center gap-3 border border-gray-200 shadow-sm"
        >
          ${state.user.profilePhotoUrl ? `
            <img src="${escapeHtml(state.user.profilePhotoUrl)}" 
              alt="Profile" 
              class="w-7 h-7 rounded-full object-cover"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
            <i class="fas fa-user text-lg" style="display:none;"></i>
          ` : `
            <i class="fas fa-user text-lg"></i>
          `}
          <span class="font-semibold">マイページ</span>
        </button>
      </div>
    `
  } else {
    // Show login/register buttons
    userAccountSection.innerHTML = `
      <button 
        onclick="showLoginModal()"
        class="w-full px-4 py-3 bg-olive hover:bg-olive-dark text-white rounded-lg transition-colors font-semibold shadow-sm flex items-center justify-center gap-2 mb-4"
        style="background-color: #6B8E23; hover:background-color: #556B2F;"
        onmouseover="this.style.backgroundColor='#556B2F'" 
        onmouseout="this.style.backgroundColor='#6B8E23'"
        aria-label="ログイン"
      >
        <i class="fas fa-sign-in-alt"></i>
        <span>Login</span>
      </button>
    `
  }
  
  // Update logout section at the bottom
  updateLogoutSection()
}

// Update logout section
function updateLogoutSection() {
  const logoutSection = document.getElementById('logout-section')
  
  if (!logoutSection) return
  
  if (state.isAuthenticated && state.user) {
    // Show logout button for authenticated users
    logoutSection.innerHTML = `
      <button 
        onclick="if(confirm('ログアウトしますか？')) { handleLogout() }"
        class="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 border border-gray-300"
        aria-label="ログアウト"
      >
        <i class="fas fa-sign-out-alt"></i>
        <span>ログアウト</span>
      </button>
    `
  } else {
    // Hide logout section for non-authenticated users
    logoutSection.innerHTML = ''
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
        
        // Redirect to mypage if on restricted pages
        const currentPath = window.location.pathname
        if (currentPath === '/sns-faq' || currentPath === '/question-finder') {
          window.location.href = '/mypage'
        } else {
          // Show success message and reload for other pages
          window.location.reload()
        }
      }, 500)
    } else {
      submitBtn.disabled = false
      submitBtn.innerHTML = originalBtnContent
      errorDiv.textContent = data.error || 'ログインに失敗しました'
      errorDiv.classList.remove('hidden')
    }
  } catch (error) {
    submitBtn.disabled = false
    submitBtn.innerHTML = originalBtnContent
    errorDiv.textContent = 'ログインに失敗しました。もう一度お試しください。'
    errorDiv.classList.remove('hidden')
  }
}

// Handle user registration
async function handleRegister(event) {
  event.preventDefault()
  
  const email = document.getElementById('register-email').value
  const password = document.getElementById('register-password').value
  const errorDiv = document.getElementById('register-error')
  const submitBtn = event.target.querySelector('button[type="submit"]')
  
  if (!email) {
    errorDiv.textContent = 'メールアドレスを入力してください'
    errorDiv.classList.remove('hidden')
    return
  }
  
  // Password is optional, but if provided, must be at least 6 characters
  if (password && password.length < 6) {
    errorDiv.textContent = 'パスワードは6文字以上で入力してください'
    errorDiv.classList.remove('hidden')
    return
  }
  
  errorDiv.classList.add('hidden')
  
  // Show loading state
  const originalBtnContent = submitBtn.innerHTML
  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>登録中...'
  
  try {
    const usePasswordless = !password || password.length === 0
    
    const response = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        email, 
        password: password || null,
        usePasswordless
      })
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      // Registration successful
      submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>登録完了！'
      
      await checkAuthStatus()
      
      setTimeout(() => {
        closeAuthModal()
        
        // Redirect to mypage if on restricted pages
        const currentPath = window.location.pathname
        if (currentPath === '/sns-faq' || currentPath === '/question-finder') {
          window.location.href = '/mypage'
        } else {
          // Show success message and reload for other pages
          alert('会員登録が完了しました！\nマイページからプロフィール情報を追加できます。')
          window.location.reload()
        }
      }, 500)
    } else {
      submitBtn.disabled = false
      submitBtn.innerHTML = originalBtnContent
      errorDiv.textContent = data.error || '会員登録に失敗しました'
      errorDiv.classList.remove('hidden')
    }
  } catch (error) {
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

// escapeHtml is now in utils.js

// Check for magic link token on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Wait for state to be defined (from app.js)
  const waitForState = () => {
    return new Promise((resolve) => {
      if (typeof state !== 'undefined') {
        resolve()
      } else {
        const interval = setInterval(() => {
          if (typeof state !== 'undefined') {
            clearInterval(interval)
            resolve()
          }
        }, 50)
      }
    })
  }
  
  await waitForState()
  
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
