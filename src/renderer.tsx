import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title, description, keywords, categoryName, categoryId }) => {
  // Default meta values
  const pageTitle = title || "Akagami.net - SNSマーケティング・生成AI資料保管庫"
  const pageDescription = description || "YouTube、Instagram、TikTokなどのSNSマーケティングや生成AIに関する資料を無料で公開。カテゴリ別・タグ別に検索できる便利な資料管理システム。"
  const pageKeywords = keywords || "SNSマーケティング,YouTube,Instagram,TikTok,Threads,生成AI,マーケティング資料,無料資料,赤髪社長"
  
  // Build structured data based on page type
  const structuredDataArray: any[] = [
    // WebSite schema (always present)
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Akagami.net",
      "description": "SNSマーケティング・生成AI資料保管庫",
      "url": "https://akagami.net/",
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
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://akagami.net/?search={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "ja-JP"
    }
  ]
  
  // Add BreadcrumbList for category pages
  if (categoryId && categoryName) {
    structuredDataArray.push({
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
          "name": categoryName,
          "item": `https://akagami.net/?category=${categoryId}`
        }
      ]
    })
    
    // Add CollectionPage for category pages
    structuredDataArray.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": pageTitle,
      "description": pageDescription,
      "url": `https://akagami.net/?category=${categoryId}`,
      "about": {
        "@type": "Thing",
        "name": categoryName
      },
      "isPartOf": {
        "@type": "WebSite",
        "name": "Akagami.net",
        "url": "https://akagami.net/"
      },
      "inLanguage": "ja-JP"
    })
  }
  
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Performance Optimization - Preconnect to external domains */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="author" content="Akagami" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Japanese" />
        <meta name="revisit-after" content="7 days" />
        <link rel="canonical" href="https://akagami.net/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://akagami.net/" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://akagami.net/og-image.webp" />
        <meta property="og:image:secure_url" content="https://akagami.net/og-image.webp" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="538" />
        <meta property="og:image:alt" content="Akagami.net - SNSマーケティング・生成AI資料保管庫" />
        <meta property="og:site_name" content="Akagami.net" />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:locale:alternate" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@akagami0124" />
        <meta name="twitter:url" content="https://akagami.net/" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://akagami.net/og-image.webp" />
        <meta name="twitter:image:alt" content="Akagami.net - SNS資料保管庫" />
        <meta name="twitter:creator" content="@akagami0124" />
        <meta name="twitter:domain" content="akagami.net" />
        
        {/* Alternative square image for some platforms */}
        <link rel="image_src" href="https://akagami.net/og-image-square.webp" />
        
        {/* Color scheme and theme */}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#e75556" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Web App Manifest (PWA) */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Humans.txt - Developer info */}
        <link rel="author" href="/humans.txt" />
        
        {/* Additional SEO meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Akagami.net" />
        
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
        
        {/* Microsoft Clarity - Heatmap & Session Recording */}
        {/* Setup: 1. Create project at https://clarity.microsoft.com/ 
                   2. Copy Project ID
                   3. Replace CLARITY_PROJECT_ID below with your actual ID
                   Example: "abc123xyz" */}
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "CLARITY_PROJECT_ID");
          `
        }} />
        
        {/* Structured Data (JSON-LD) for SEO */}
        {structuredDataArray.map((schema, index) => (
          <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }} />
        ))}
        
        {/* Tailwind CSS - Production build (optimized and purged) */}
        <link href="/static/output.css" rel="stylesheet" />
        
        {/* Font Awesome - restored for proper icon rendering */}
        <link 
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" 
          rel="stylesheet"
        />
        {/* Custom CSS */}
        <link href="/static/style.css" rel="stylesheet" />
        {/* Eruda - Mobile Debug Console (Development only) */}
        {/* Eruda is disabled in production for security. To enable for debugging:
            Add ?debug=true to URL, or set localStorage.debug_mode = 'true' */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Only load Eruda if explicitly enabled
              const urlParams = new URLSearchParams(window.location.search);
              const debugParam = urlParams.get('debug');
              const debugMode = localStorage.getItem('debug_mode') === 'true' || debugParam === 'true';
              
              // Save debug mode if URL parameter is present
              if (debugParam === 'true') {
                localStorage.setItem('debug_mode', 'true');
                console.log('[DEBUG] Debug mode enabled via URL parameter');
              } else if (debugParam === 'false') {
                localStorage.removeItem('debug_mode');
                console.log('[DEBUG] Debug mode disabled via URL parameter');
              }
              
              // Load Eruda only in debug mode
              if (debugMode) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/eruda';
                script.onload = function() {
                  if (typeof eruda !== 'undefined') {
                    eruda.init();
                    console.log('[ERUDA] Debug console initialized');
                  }
                };
                document.head.appendChild(script);
              }
            })();
          `
        }} />
      </head>
      <body class="bg-white dark:bg-darker transition-colors duration-300">
        <script dangerouslySetInnerHTML={{
          __html: `
            // Initialize dark mode from localStorage before page render
            (function() {
              const darkMode = localStorage.getItem('dark_mode') === 'true';
              if (darkMode) {
                document.documentElement.classList.add('dark');
              }
            })();
          `
        }} />
        {children}
        
        {/* Auth Modal */}
        <div id="auth-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden items-center justify-center p-4">
          <div class="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 relative animate-slide-up max-h-[90vh] overflow-y-auto">
            <button 
              onclick="closeAuthModal()"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="閉じる"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
            
            <h2 id="auth-modal-title" class="text-2xl font-bold text-gray-800 mb-6">ログイン</h2>
            
            {/* Password Login Form */}
            <form id="password-login-form" onsubmit="handlePasswordLogin(event); return false;" class="space-y-4">
              <div>
                <label for="login-email" class="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label for="login-password" class="block text-sm font-medium text-gray-700 mb-1">
                  パスワード
                </label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              
              <div id="login-error" class="hidden text-sm text-red-600 bg-red-50 p-3 rounded-lg"></div>
              
              <button
                type="submit"
                class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <i class="fas fa-sign-in-alt mr-2"></i>
                ログイン
              </button>
              
              <button
                type="button"
                onclick="switchToMagicLink()"
                class="w-full text-primary text-sm hover:underline"
              >
                パスワードなしでログイン（メールリンク）
              </button>
            </form>
            
            {/* Magic Link Form */}
            <form id="magic-link-form" onsubmit="handleMagicLinkRequest(event); return false;" class="space-y-4 hidden">
              <div>
                <label for="magic-link-email" class="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="magic-link-email"
                  name="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div id="magic-link-error" class="hidden text-sm text-red-600 bg-red-50 p-3 rounded-lg"></div>
              <div id="magic-link-success" class="hidden text-sm text-green-600 bg-green-50 p-3 rounded-lg"></div>
              
              <button
                type="submit"
                class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <i class="fas fa-paper-plane mr-2"></i>
                ログインリンクを送信
              </button>
              
              <button
                type="button"
                onclick="switchToPasswordLogin()"
                class="w-full text-primary text-sm hover:underline"
              >
                パスワードでログイン
              </button>
            </form>
            
            {/* Register Form */}
            <form id="register-form" onsubmit="handleRegister(event); return false;" class="space-y-4 hidden">
              <div>
                <label for="register-email" class="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label for="register-password" class="block text-sm font-medium text-gray-700 mb-1">
                  パスワード（8文字以上）
                </label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  required
                  minlength="8"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              
              <div id="register-error" class="hidden text-sm text-red-600 bg-red-50 p-3 rounded-lg"></div>
              
              <button
                type="submit"
                class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <i class="fas fa-user-plus mr-2"></i>
                会員登録（無料）
              </button>
            </form>
            
            <div id="switch-auth-mode" class="mt-6 text-center text-sm text-gray-600">
              <span>アカウントをお持ちでないですか？</span>
              <button 
                onclick="switchToRegister()"
                class="text-primary font-semibold hover:underline ml-1"
              >
                会員登録
              </button>
            </div>
          </div>
        </div>
        
        <script src="/static/utils.js?v=202601181036" defer></script>
        <script src="/static/app.js?v=202602051332" defer></script>
        <script src="/static/auth.js?v=202601181036" defer></script>
      </body>
    </html>
  )
})
