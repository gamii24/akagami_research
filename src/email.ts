// Email helper functions using Resend API

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export interface EmailEnvironment {
  RESEND_API_KEY?: string
}

// Send email using Resend API
// Resend is a modern email API service with a generous free tier
export async function sendEmail(options: EmailOptions, env?: EmailEnvironment): Promise<boolean> {
  try {
    const apiKey = env?.RESEND_API_KEY
    
    // If no API key is configured, log to console (development mode)
    if (!apiKey) {
      console.log('⚠️  RESEND_API_KEY not configured. Email not sent.')
      console.log('📧 Email would be sent:', {
        to: options.to,
        subject: options.subject,
        preview: options.text?.substring(0, 100) || options.html.substring(0, 100)
      })
      return true // Return true to not break the flow
    }
    
    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Akagami Research <noreply@akagami.net>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      })
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ Resend API error:', response.status, errorData)
      return false
    }
    
    const result = await response.json()
    console.log('✅ Email sent successfully via Resend:', {
      id: result.id,
      to: options.to,
      subject: options.subject
    })
    
    return true
  } catch (error) {
    console.error('❌ Failed to send email:', error)
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

// Admin notification for new user registration
export function getAdminNewUserNotificationHtml(userName: string, userEmail: string, userId: number, registrationDate: string): string {
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
          background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
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
        .user-card {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          border-left: 4px solid #4caf50;
        }
        .info-row {
          display: flex;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .info-label {
          font-weight: bold;
          min-width: 120px;
          color: #666;
        }
        .info-value {
          color: #333;
        }
        .button {
          display: inline-block;
          background: #4caf50;
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
        <h1 style="margin: 0;">🎉 新規会員登録通知</h1>
      </div>
      <div class="content">
        <p>Akagami Research に新しい会員が登録されました！</p>
        
        <div class="user-card">
          <h2 style="margin: 0 0 15px 0; color: #4caf50;">会員情報</h2>
          <div class="info-row">
            <div class="info-label">会員番号:</div>
            <div class="info-value">${userId}</div>
          </div>
          <div class="info-row">
            <div class="info-label">名前:</div>
            <div class="info-value">${userName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">メールアドレス:</div>
            <div class="info-value">${userEmail}</div>
          </div>
          <div class="info-row" style="border-bottom: none;">
            <div class="info-label">登録日時:</div>
            <div class="info-value">${registrationDate}</div>
          </div>
        </div>
        
        <div style="text-align: center;">
          <a href="https://akagami.net/admin" class="button">管理画面を開く</a>
        </div>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          この通知は新規会員登録時に自動送信されています。
        </p>
      </div>
      <div class="footer">
        <p>© 2026 Akagami Research. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}
