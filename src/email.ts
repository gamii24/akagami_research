// Email helper functions for Cloudflare Email Workers

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Send email using fetch to a mail service
// For Cloudflare Email Workers, you'll need to set up email routing
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // For now, we'll use a simple email template
    // In production, you should configure Cloudflare Email Routing or use a service like Resend
    
    // Log email for development
    console.log('📧 Email would be sent:', {
      to: options.to,
      subject: options.subject,
      preview: options.text?.substring(0, 100) || options.html.substring(0, 100)
    })
    
    // TODO: Implement actual email sending with Cloudflare Email Workers
    // For now, return true to indicate success
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

// Email templates
export function getWelcomeEmailHtml(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #e75556 0%, #ff6b6b 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #e75556;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #999;
          font-size: 12px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">Akagami Research へようこそ！</h1>
      </div>
      <div class="content">
        <p>こんにちは、${name}さん</p>
        <p>Akagami Research の会員登録が完了しました！🎉</p>
        <p>これからは以下の機能をご利用いただけます：</p>
        <ul>
          <li>デバイス間でのダウンロード履歴とお気に入りの同期</li>
          <li>お気に入りカテゴリの新着資料をメールで通知</li>
          <li>カスタマイズされた資料管理</li>
        </ul>
        <div style="text-align: center;">
          <a href="https://akagami.net/" class="button">サイトにアクセス</a>
        </div>
        <p>素敵な学びの時間をお過ごしください！</p>
        <p>Akagami Research チーム</p>
      </div>
      <div class="footer">
        <p>© 2026 Akagami Research. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}

export function getMagicLinkEmailHtml(name: string, magicLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #e75556 0%, #ff6b6b 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          background: #e75556;
          color: white;
          padding: 15px 40px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
          font-size: 16px;
        }
        .warning {
          background: #fff3cd;
          border: 1px solid #ffc107;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #999;
          font-size: 12px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">🔐 ログインリンク</h1>
      </div>
      <div class="content">
        <p>こんにちは、${name}さん</p>
        <p>Akagami Research にログインするためのマジックリンクです。</p>
        <div style="text-align: center;">
          <a href="${magicLink}" class="button">ログインする</a>
        </div>
        <div class="warning">
          <strong>⚠️ セキュリティに関する注意</strong>
          <ul style="margin: 10px 0 0 0; padding-left: 20px;">
            <li>このリンクは15分間有効です</li>
            <li>1回のみ使用可能です</li>
            <li>このメールを他の人と共有しないでください</li>
          </ul>
        </div>
        <p>このメールに心当たりがない場合は、無視してください。</p>
        <p>Akagami Research チーム</p>
      </div>
      <div class="footer">
        <p>© 2026 Akagami Research. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}

export function getNewPdfNotificationEmailHtml(userName: string, pdfTitle: string, categoryName: string, pdfUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #e75556 0%, #ff6b6b 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-top: none;
          border-radius: 0 0 10px 10px;
        }
        .pdf-card {
          background: #f4eee0;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          border: 2px solid #e75556;
        }
        .button {
          display: inline-block;
          background: #e75556;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .category-tag {
          display: inline-block;
          background: #e75556;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          margin-bottom: 10px;
        }
        .footer {
          text-align: center;
          color: #999;
          font-size: 12px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">📚 新しい資料が追加されました</h1>
      </div>
      <div class="content">
        <p>こんにちは、${userName}さん</p>
        <p>お気に入りのカテゴリに新しい資料が追加されました！</p>
        
        <div class="pdf-card">
          <div class="category-tag">${categoryName}</div>
          <h2 style="margin: 10px 0; color: #e75556;">${pdfTitle}</h2>
          <div style="text-align: center;">
            <a href="${pdfUrl}" class="button">今すぐダウンロード</a>
          </div>
        </div>
        
        <p>通知設定を変更したい場合は、<a href="https://akagami.net/my-page/notifications">マイページ</a>からいつでも変更できます。</p>
        
        <p>Akagami Research チーム</p>
      </div>
      <div class="footer">
        <p>このメールは通知設定に基づいて送信されています。</p>
        <p>© 2026 Akagami Research. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}
