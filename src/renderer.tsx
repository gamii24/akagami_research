import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
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
        <title>Akagami Research - SNSマーケティング・生成AI資料保管庫</title>
        <meta name="description" content="YouTube、Instagram、TikTokなどのSNSマーケティングや生成AIに関する資料を無料で公開。カテゴリ別・タグ別に検索できる便利な資料管理システム。" />
        <meta name="keywords" content="SNSマーケティング,YouTube,Instagram,TikTok,Threads,生成AI,マーケティング資料,無料資料,赤髪社長" />
        <meta name="author" content="Akagami" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Japanese" />
        <meta name="revisit-after" content="7 days" />
        <link rel="canonical" href="https://akagami.net/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://akagami.net/" />
        <meta property="og:title" content="Akagami Research - SNSマーケティング・生成AI資料保管庫" />
        <meta property="og:description" content="YouTube、Instagram、TikTokなどのSNSマーケティングや生成AIに関する資料を無料で公開中！カテゴリ別・タグ別に簡単検索できます。" />
        <meta property="og:image" content="https://akagami.net/og-image.webp" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Akagami Research - 毎朝のInstagramLIVEで使用したSNSのことを深掘りしたレポートが無料でGETできる" />
        <meta property="og:site_name" content="Akagami Research" />
        <meta property="og:locale" content="ja_JP" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://akagami.net/" />
        <meta name="twitter:title" content="Akagami Research - SNSマーケティング・生成AI資料保管庫" />
        <meta name="twitter:description" content="YouTube、Instagram、TikTokなどのSNSマーケティングや生成AIに関する資料を無料で公開中！" />
        <meta name="twitter:image" content="https://akagami.net/og-image.webp" />
        <meta name="twitter:image:alt" content="Akagami Research - SNS資料保管庫" />
        <meta name="twitter:creator" content="@akagami0124" />
        
        {/* Alternative square image for some platforms */}
        <link rel="image_src" href="https://akagami.net/og-image-square.webp" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Web App Manifest (PWA) */}
        <link rel="manifest" href="/manifest.json" />
        
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          })
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
      <body class="bg-white">
        {children}
        <script src="/static/app.js" defer></script>
      </body>
    </html>
  )
})
