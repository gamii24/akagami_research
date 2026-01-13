import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Basic Meta Tags */}
        <title>Akagami Research - SNSマーケティング・生成AI資料保管庫</title>
        <meta name="description" content="YouTube、Instagram、TikTokなどのSNSマーケティングや生成AIに関する資料を無料で公開。カテゴリ別・タグ別に検索できる便利な資料管理システム。" />
        <meta name="keywords" content="SNSマーケティング,YouTube,Instagram,TikTok,Threads,生成AI,マーケティング資料,無料資料,赤髪社長" />
        <meta name="author" content="Akagami" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://akagami.net/" />
        <meta property="og:title" content="Akagami Research - SNSマーケティング・生成AI資料保管庫" />
        <meta property="og:description" content="YouTube、Instagram、TikTokなどのSNSマーケティングや生成AIに関する資料を無料で公開中！カテゴリ別・タグ別に簡単検索できます。" />
        <meta property="og:image" content="https://akagami.net/og-image.png" />
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
        <meta name="twitter:image" content="https://akagami.net/og-image.png" />
        <meta name="twitter:image:alt" content="Akagami Research - SNS資料保管庫" />
        <meta name="twitter:creator" content="@akagami0124" />
        
        {/* Alternative square image for some platforms */}
        <link rel="image_src" href="https://akagami.net/og-image-square.png" />
        
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
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" media="print" onload="this.media='all'" />
        <noscript><link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" /></noscript>
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body class="bg-white">
        {children}
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})
