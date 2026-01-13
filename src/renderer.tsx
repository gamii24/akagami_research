import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title, description, keywords, categoryName, categoryId }) => {
  // Default meta values
  const pageTitle = title || "Akagami Research - SNSマーケティング・生成AI資料保管庫"
  const pageDescription = description || "YouTube、Instagram、TikTokなどのSNSマーケティングや生成AIに関する資料を無料で公開。カテゴリ別・タグ別に検索できる便利な資料管理システム。"
  const pageKeywords = keywords || "SNSマーケティング,YouTube,Instagram,TikTok,Threads,生成AI,マーケティング資料,無料資料,赤髪社長"
  
  // Build structured data based on page type
  const structuredDataArray: any[] = [
    // WebSite schema (always present)
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Akagami Research",
      "description": "SNSマーケティング・生成AI資料保管庫",
      "url": "https://akagami.net/",
      "author": {
        "@type": "Person",
        "name": "Akagami",
        "url": "https://www.instagram.com/akagami_sns/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Akagami Research",
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
        "name": "Akagami Research",
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
        <link rel="preconnect" href="https://cdn.tailwindcss.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdn.tailwindcss.com" />
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
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Akagami Research - 毎朝のInstagramLIVEで使用したSNSのことを深掘りしたレポートが無料でGETできる" />
        <meta property="og:site_name" content="Akagami Research" />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:locale:alternate" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@akagami0124" />
        <meta name="twitter:url" content="https://akagami.net/" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://akagami.net/og-image.webp" />
        <meta name="twitter:image:alt" content="Akagami Research - SNS資料保管庫" />
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
        <meta name="apple-mobile-web-app-title" content="Akagami Research" />
        
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
        
        {/* Structured Data (JSON-LD) for SEO */}
        {structuredDataArray.map((schema, index) => (
          <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }} />
        ))}
        
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
                  },
                  fontFamily: {
                    sans: [
                      '-apple-system',
                      'BlinkMacSystemFont',
                      '"Segoe UI"',
                      'Roboto',
                      '"Helvetica Neue"',
                      'Arial',
                      '"Noto Sans"',
                      'sans-serif',
                      '"Apple Color Emoji"',
                      '"Segoe UI Emoji"',
                      '"Segoe UI Symbol"',
                      '"Noto Color Emoji"'
                    ]
                  }
                }
              }
            }
          `
        }} />
        <link 
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" 
          rel="preload" 
          as="style"
          onload="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
        </noscript>
        <link href="/static/style.css" rel="stylesheet" />
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
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  )
})
