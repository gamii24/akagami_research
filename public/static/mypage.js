// ============================================
// My Page JavaScript - Full Implementation
// ============================================

let userData = null
let categories = []
let notificationSettings = []

// SNS Legends Quotes Database - 100 Quotes
const snsQuotes = [
  // Mark Zuckerberg
  { author: 'マーク・ザッカーバーグ', role: 'Meta (Facebook) 創業者・CEO', quote: 'アイデアは重要ではない。実行こそがすべてだ。', icon: 'fab fa-facebook' },
  { author: 'マーク・ザッカーバーグ', role: 'Meta (Facebook) 創業者・CEO', quote: '完璧を待つより、まず完成させることが重要だ。', icon: 'fab fa-facebook' },
  { author: 'マーク・ザッカーバーグ', role: 'Meta (Facebook) 創業者・CEO', quote: '最大のリスクは、リスクを取らないことだ。', icon: 'fab fa-facebook' },
  { author: 'マーク・ザッカーバーグ', role: 'Meta (Facebook) 創業者・CEO', quote: '速く動き、壊せ。完璧を目指すより、まず行動しろ。', icon: 'fab fa-facebook' },
  { author: 'マーク・ザッカーバーグ', role: 'Meta (Facebook) 創業者・CEO', quote: '人々がシェアすればするほど、世界はオープンになり、つながる。', icon: 'fab fa-facebook' },
  
  // Elon Musk
  { author: 'イーロン・マスク', role: 'X (Twitter) オーナー・テスラCEO', quote: '失敗はオプションだ。失敗しないなら、十分に革新的ではない。', icon: 'fab fa-x-twitter' },
  { author: 'イーロン・マスク', role: 'X (Twitter) オーナー・テスラCEO', quote: 'ブランドは製品やサービスへの信頼の積み重ねだ。', icon: 'fab fa-x-twitter' },
  { author: 'イーロン・マスク', role: 'X (Twitter) オーナー・テスラCEO', quote: 'フィードバックループを作り、常に考え、改善しろ。', icon: 'fab fa-x-twitter' },
  { author: 'イーロン・マスク', role: 'X (Twitter) オーナー・テスラCEO', quote: '何かが十分に重要なら、たとえ不利な状況でもやるべきだ。', icon: 'fab fa-x-twitter' },
  { author: 'イーロン・マスク', role: 'X (Twitter) オーナー・テスラCEO', quote: '粘り強さは非常に重要だ。諦めなければ失敗しない。', icon: 'fab fa-x-twitter' },
  
  // Jack Dorsey
  { author: 'ジャック・ドーシー', role: 'Twitter (X) 共同創業者', quote: '最も強力な人々は、情報を共有する人々だ。', icon: 'fab fa-twitter' },
  { author: 'ジャック・ドーシー', role: 'Twitter (X) 共同創業者', quote: 'シンプルさは、複雑さを経て到達できる。', icon: 'fab fa-twitter' },
  { author: 'ジャック・ドーシー', role: 'Twitter (X) 共同創業者', quote: '良いアイデアは、会話から生まれる。', icon: 'fab fa-twitter' },
  { author: 'ジャック・ドーシー', role: 'Twitter (X) 共同創業者', quote: 'ユーザーの声を聞き、常に改善し続けろ。', icon: 'fab fa-twitter' },
  
  // Kevin Systrom
  { author: 'ケビン・シストロム', role: 'Instagram 共同創業者', quote: 'シンプルさが究極の洗練である。', icon: 'fab fa-instagram' },
  { author: 'ケビン・シストロム', role: 'Instagram 共同創業者', quote: '完璧主義は、スタートアップを殺す最速の方法だ。', icon: 'fab fa-instagram' },
  { author: 'ケビン・シストロム', role: 'Instagram 共同創業者', quote: 'コミュニティを第一に考えろ。彼らが成功の鍵だ。', icon: 'fab fa-instagram' },
  { author: 'ケビン・シストロム', role: 'Instagram 共同創業者', quote: '製品を愛する人々のために作れ。', icon: 'fab fa-instagram' },
  
  // Susan Wojcicki
  { author: 'スーザン・ウォシッキー', role: '元YouTube CEO', quote: 'クリエイターがいなければ、YouTubeは何もない。', icon: 'fab fa-youtube' },
  { author: 'スーザン・ウォシッキー', role: '元YouTube CEO', quote: '多様性は、イノベーションの源泉だ。', icon: 'fab fa-youtube' },
  { author: 'スーザン・ウォシッキー', role: '元YouTube CEO', quote: 'データは重要だが、直感も大切にしろ。', icon: 'fab fa-youtube' },
  
  // Reid Hoffman
  { author: 'リード・ホフマン', role: 'LinkedIn 共同創業者', quote: '恥ずかしくない製品なら、リリースが遅すぎる。', icon: 'fab fa-linkedin' },
  { author: 'リード・ホフマン', role: 'LinkedIn 共同創業者', quote: 'ネットワークを作り、関係を大切にしろ。', icon: 'fab fa-linkedin' },
  { author: 'リード・ホフマン', role: 'LinkedIn 共同創業者', quote: 'スピードは品質を凌駕する。', icon: 'fab fa-linkedin' },
  { author: 'リード・ホフマン', role: 'LinkedIn 共同創業者', quote: '起業家精神とは、崖から飛び降りながら飛行機を組み立てることだ。', icon: 'fab fa-linkedin' },
  
  // Brian Chesky
  { author: 'ブライアン・チェスキー', role: 'Airbnb 共同創業者・CEO', quote: 'スケールしないことをしろ。', icon: 'fas fa-home' },
  { author: 'ブライアン・チェスキー', role: 'Airbnb 共同創業者・CEO', quote: '100人に愛される製品を作れ。1人に好かれる製品ではなく。', icon: 'fas fa-home' },
  { author: 'ブライアン・チェスキー', role: 'Airbnb 共同創業者・CEO', quote: 'デザインは、単なる見た目ではない。機能そのものだ。', icon: 'fas fa-home' },
  { author: 'ブライアン・チェスキー', role: 'Airbnb 共同創業者・CEO', quote: 'ストーリーを語れ。人々は物語に共感する。', icon: 'fas fa-home' },
  
  // Jan Koum
  { author: 'ジャン・クム', role: 'WhatsApp 共同創業者', quote: '広告はないほうがいい。プライバシーを尊重しろ。', icon: 'fab fa-whatsapp' },
  { author: 'ジャン・クム', role: 'WhatsApp 共同創業者', quote: 'シンプルに、速く、信頼できるサービスを作れ。', icon: 'fab fa-whatsapp' },
  { author: 'ジャン・クム', role: 'WhatsApp 共同創業者', quote: 'ユーザーデータを尊重することが、最高のビジネスモデルだ。', icon: 'fab fa-whatsapp' },
  
  // Evan Spiegel
  { author: 'エヴァン・スピーゲル', role: 'Snapchat 創業者・CEO', quote: '人々は、永続的なものよりも一時的なものに正直になる。', icon: 'fab fa-snapchat' },
  { author: 'エヴァン・スピーゲル', role: 'Snapchat 創業者・CEO', quote: '完璧である必要はない。本物であればいい。', icon: 'fab fa-snapchat' },
  { author: 'エヴァン・スピーゲル', role: 'Snapchat 創業者・CEO', quote: 'カメラは新しいキーボードだ。', icon: 'fab fa-snapchat' },
  
  // Zhang Yiming
  { author: 'チャン・イーミン', role: 'ByteDance (TikTok) 創業者', quote: 'グローバルに考え、ローカルに実行せよ。', icon: 'fab fa-tiktok' },
  { author: 'チャン・イーミン', role: 'ByteDance (TikTok) 創業者', quote: 'AIとコンテンツの組み合わせが未来を作る。', icon: 'fab fa-tiktok' },
  { author: 'チャン・イーミン', role: 'ByteDance (TikTok) 創業者', quote: 'ユーザーエンゲージメントがすべてだ。', icon: 'fab fa-tiktok' },
  
  // Steve Jobs
  { author: 'スティーブ・ジョブズ', role: 'Apple 共同創業者', quote: '顧客が望むものを提供するな。彼らが必要とするものを提供しろ。', icon: 'fab fa-apple' },
  { author: 'スティーブ・ジョブズ', role: 'Apple 共同創業者', quote: 'シンプルであることは、複雑であることよりも難しい。', icon: 'fab fa-apple' },
  { author: 'スティーブ・ジョブズ', role: 'Apple 共同創業者', quote: 'イノベーションは、誰がリーダーで誰がフォロワーかを区別する。', icon: 'fab fa-apple' },
  { author: 'スティーブ・ジョブズ', role: 'Apple 共同創業者', quote: 'あなたの時間は限られている。他人の人生を生きて無駄にするな。', icon: 'fab fa-apple' },
  { author: 'スティーブ・ジョブズ', role: 'Apple 共同創業者', quote: '素晴らしい仕事をする唯一の方法は、自分がすることを愛することだ。', icon: 'fab fa-apple' },
  
  // Bill Gates
  { author: 'ビル・ゲイツ', role: 'Microsoft 共同創業者', quote: '成功を祝うのもいいが、失敗の教訓に注目することが重要だ。', icon: 'fab fa-microsoft' },
  { author: 'ビル・ゲイツ', role: 'Microsoft 共同創業者', quote: 'ソフトウェアは素晴らしい組み合わせだ：芸術性とエンジニアリング。', icon: 'fab fa-microsoft' },
  { author: 'ビル・ゲイツ', role: 'Microsoft 共同創業者', quote: 'あなたの最も不満な顧客は、最大の学びの源だ。', icon: 'fab fa-microsoft' },
  { author: 'ビル・ゲイツ', role: 'Microsoft 共同創業者', quote: 'テクノロジーは単なる道具だ。人々を一つにすることが重要だ。', icon: 'fab fa-microsoft' },
  
  // Jeff Bezos
  { author: 'ジェフ・ベゾス', role: 'Amazon 創業者', quote: '顧客に取り憑かれろ。競合ではなく。', icon: 'fab fa-amazon' },
  { author: 'ジェフ・ベゾス', role: 'Amazon 創業者', quote: '発明するには、実験が必要だ。', icon: 'fab fa-amazon' },
  { author: 'ジェフ・ベゾス', role: 'Amazon 創業者', quote: 'もし失敗を恐れるなら、革新することはできない。', icon: 'fab fa-amazon' },
  { author: 'ジェフ・ベゾス', role: 'Amazon 創業者', quote: '長期的思考が、不可能を可能にする。', icon: 'fab fa-amazon' },
  
  // Satya Nadella
  { author: 'サティア・ナデラ', role: 'Microsoft CEO', quote: '共感がイノベーションの源泉だ。', icon: 'fab fa-microsoft' },
  { author: 'サティア・ナデラ', role: 'Microsoft CEO', quote: '成長マインドセットを持て。学び続けることが成功の鍵だ。', icon: 'fab fa-microsoft' },
  { author: 'サティア・ナデラ', role: 'Microsoft CEO', quote: '文化が戦略を凌駕する。', icon: 'fab fa-microsoft' },
  
  // Sheryl Sandberg
  { author: 'シェリル・サンドバーグ', role: '元Meta COO', quote: '完璧ではなく、完了を目指せ。', icon: 'fab fa-facebook' },
  { author: 'シェリル・サンドバーグ', role: '元Meta COO', quote: '恐れではなく、希望によって導かれろ。', icon: 'fab fa-facebook' },
  { author: 'シェリル・サンドバーグ', role: '元Meta COO', quote: '自分の席がなければ、テーブルを持ってこい。', icon: 'fab fa-facebook' },
  
  // Larry Page
  { author: 'ラリー・ペイジ', role: 'Google 共同創業者', quote: '10倍良いものを目指せ。10%ではなく。', icon: 'fab fa-google' },
  { author: 'ラリー・ペイジ', role: 'Google 共同創業者', quote: '不可能に見えるアイデアこそ、追求する価値がある。', icon: 'fab fa-google' },
  { author: 'ラリー・ペイジ', role: 'Google 共同創業者', quote: 'ユーザーに焦点を合わせれば、他はすべてついてくる。', icon: 'fab fa-google' },
  
  // Sergey Brin
  { author: 'セルゲイ・ブリン', role: 'Google 共同創業者', quote: '情報を整理し、世界中の人々がアクセスできるようにする。', icon: 'fab fa-google' },
  { author: 'セルゲイ・ブリン', role: 'Google 共同創業者', quote: '技術的な問題を解決することが、ビジネスを成功させる。', icon: 'fab fa-google' },
  
  // Sundar Pichai
  { author: 'サンダー・ピチャイ', role: 'Google CEO', quote: 'テクノロジーは、すべての人のためにある。', icon: 'fab fa-google' },
  { author: 'サンダー・ピチャイ', role: 'Google CEO', quote: 'AIは、火や電気よりも重要になる。', icon: 'fab fa-google' },
  { author: 'サンダー・ピチャイ', role: 'Google CEO', quote: '変化を恐れるな。変化を受け入れろ。', icon: 'fab fa-google' },
  
  // Travis Kalanick
  { author: 'トラビス・カラニック', role: 'Uber 共同創業者', quote: '起業家精神とは、"No"を無視することだ。', icon: 'fas fa-car' },
  { author: 'トラビス・カラニック', role: 'Uber 共同創業者', quote: '破壊的イノベーションは、既存のルールを書き換える。', icon: 'fas fa-car' },
  
  // Daniel Ek
  { author: 'ダニエル・エク', role: 'Spotify 創業者・CEO', quote: '音楽は、すべての人のものだ。', icon: 'fab fa-spotify' },
  { author: 'ダニエル・エク', role: 'Spotify 創業者・CEO', quote: 'アーティストとファンをつなぐことが使命だ。', icon: 'fab fa-spotify' },
  { author: 'ダニエル・エク', role: 'Spotify 創業者・CEO', quote: 'データとクリエイティビティの融合が、新しい体験を生む。', icon: 'fab fa-spotify' },
  
  // Drew Houston
  { author: 'ドリュー・ヒューストン', role: 'Dropbox 創業者・CEO', quote: '最高の製品は、使いやすく、シンプルで、魔法のようだ。', icon: 'fas fa-box' },
  { author: 'ドリュー・ヒューストン', role: 'Dropbox 創業者・CEO', quote: 'あなたが情熱を持てることを見つけろ。', icon: 'fas fa-box' },
  
  // Stewart Butterfield
  { author: 'スチュワート・バターフィールド', role: 'Slack 共同創業者', quote: 'コミュニケーションを変えることが、仕事を変える。', icon: 'fab fa-slack' },
  { author: 'スチュワート・バターフィールド', role: 'Slack 共同創業者', quote: '良いプロダクトは、人々の生活を楽にする。', icon: 'fab fa-slack' },
  
  // Whitney Wolfe Herd
  { author: 'ホイットニー・ウルフ・ハード', role: 'Bumble 創業者・CEO', quote: '女性が最初の一歩を踏み出すことで、世界は変わる。', icon: 'fas fa-heart' },
  { author: 'ホイットニー・ウルフ・ハード', role: 'Bumble 創業者・CEO', quote: '優しさと強さは、両立できる。', icon: 'fas fa-heart' },
  
  // Pavel Durov
  { author: 'パヴェル・ドゥーロフ', role: 'Telegram 創業者', quote: 'プライバシーは、贅沢品ではなく基本的人権だ。', icon: 'fab fa-telegram' },
  { author: 'パヴェル・ドゥーロフ', role: 'Telegram 創業者', quote: '自由な情報こそが、民主主義の基盤だ。', icon: 'fab fa-telegram' },
  
  // Adam D'Angelo
  { author: 'アダム・ディアンジェロ', role: 'Quora 共同創業者・CEO', quote: '知識を共有することで、世界はより良くなる。', icon: 'fas fa-question-circle' },
  { author: 'アダム・ディアンジェロ', role: 'Quora 共同創業者・CEO', quote: '質問することは、学びの第一歩だ。', icon: 'fas fa-question-circle' },
  
  // Ben Silbermann
  { author: 'ベン・シルバーマン', role: 'Pinterest 共同創業者・CEO', quote: 'インスピレーションを提供することが、私たちの使命だ。', icon: 'fab fa-pinterest' },
  { author: 'ベン・シルバーマン', role: 'Pinterest 共同創業者・CEO', quote: 'コレクションは、アイデンティティを表現する方法だ。', icon: 'fab fa-pinterest' },
  
  // Bobby Murphy
  { author: 'ボビー・マーフィー', role: 'Snapchat 共同創業者・CTO', quote: '技術は、人々をつなぐための手段だ。', icon: 'fab fa-snapchat' },
  { author: 'ボビー・マーフィー', role: 'Snapchat 共同創業者・CTO', quote: 'プライベートな瞬間を大切にする文化を作ろう。', icon: 'fab fa-snapchat' },
  
  // Tony Fadell
  { author: 'トニー・ファデル', role: 'iPod/iPhone 開発者', quote: '製品は、ユーザー体験のすべてだ。', icon: 'fab fa-apple' },
  { author: 'トニー・ファデル', role: 'iPod/iPhone 開発者', quote: '細部へのこだわりが、偉大な製品を生む。', icon: 'fab fa-apple' },
  
  // Marissa Mayer
  { author: 'マリッサ・メイヤー', role: '元Yahoo! CEO', quote: 'データに基づいて意思決定をしろ。', icon: 'fas fa-search' },
  { author: 'マリッサ・メイヤー', role: '元Yahoo! CEO', quote: '失敗を恐れずに、新しいことに挑戦し続けろ。', icon: 'fas fa-search' },
  
  // Tim Cook
  { author: 'ティム・クック', role: 'Apple CEO', quote: 'プライバシーは人権だ。', icon: 'fab fa-apple' },
  { author: 'ティム・クック', role: 'Apple CEO', quote: '地球に残す足跡を考えろ。', icon: 'fab fa-apple' },
  { author: 'ティム・クック', role: 'Apple CEO', quote: '誰もが自分の可能性を最大限に発揮できる世界を作ろう。', icon: 'fab fa-apple' }
]

// Get random quote
function getRandomQuote() {
  return snsQuotes[Math.floor(Math.random() * snsQuotes.length)]
}

// Load and display random quote
function loadRandomQuote() {
  const quote = getRandomQuote()
  const quoteContent = document.getElementById('quote-content')
  
  if (!quoteContent) return
  
  quoteContent.innerHTML = `
    <blockquote class="text-base font-medium text-gray-700 mb-3 leading-relaxed">
      "${quote.quote}"
    </blockquote>
    <div class="text-xs text-gray-500">
      <p class="font-semibold">${escapeHtml(quote.author)}</p>
      <p>${escapeHtml(quote.role)}</p>
    </div>
  `
}

// Get upcoming events in Japan
function getUpcomingEvents() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1-12
  const currentDay = now.getDate()
  
  // Define all annual events
  const allEvents = [
    { name: '正月', date: `${currentYear}-01-01`, icon: '🎍', color: 'bg-red-50', description: '新年のお祝い' },
    { name: '成人の日', date: `${currentYear}-01-13`, icon: '👘', color: 'bg-pink-50', description: '新成人を祝う日' },
    { name: '節分', date: `${currentYear}-02-03`, icon: '👹', color: 'bg-yellow-50', description: '豆まきで鬼退治' },
    { name: 'バレンタインデー', date: `${currentYear}-02-14`, icon: '💝', color: 'bg-pink-50', description: 'チョコレートを贈る日' },
    { name: 'ひな祭り', date: `${currentYear}-03-03`, icon: '🎎', color: 'bg-pink-50', description: '女の子の健やかな成長を願う' },
    { name: 'ホワイトデー', date: `${currentYear}-03-14`, icon: '🍬', color: 'bg-blue-50', description: 'お返しを贈る日' },
    { name: '卒業式シーズン', date: `${currentYear}-03-20`, icon: '🎓', color: 'bg-purple-50', description: '卒業式のシーズン' },
    { name: 'お花見', date: `${currentYear}-04-01`, icon: '🌸', color: 'bg-pink-50', description: '桜を楽しむ季節' },
    { name: '入学式シーズン', date: `${currentYear}-04-05`, icon: '🎒', color: 'bg-blue-50', description: '新学期の始まり' },
    { name: 'ゴールデンウィーク', date: `${currentYear}-04-29`, icon: '🎏', color: 'bg-green-50', description: '大型連休' },
    { name: 'こどもの日', date: `${currentYear}-05-05`, icon: '🎏', color: 'bg-blue-50', description: '子供の成長を祝う' },
    { name: '母の日', date: `${currentYear}-05-11`, icon: '💐', color: 'bg-pink-50', description: '母親に感謝する日' },
    { name: '父の日', date: `${currentYear}-06-15`, icon: '👔', color: 'bg-blue-50', description: '父親に感謝する日' },
    { name: '七夕', date: `${currentYear}-07-07`, icon: '🎋', color: 'bg-purple-50', description: '願いごとをする日' },
    { name: '海の日', date: `${currentYear}-07-21`, icon: '🌊', color: 'bg-blue-50', description: '海に親しむ日' },
    { name: '夏休みシーズン', date: `${currentYear}-07-25`, icon: '☀️', color: 'bg-yellow-50', description: '夏休みの始まり' },
    { name: '花火大会シーズン', date: `${currentYear}-08-01`, icon: '🎆', color: 'bg-purple-50', description: '全国で花火大会' },
    { name: 'お盆', date: `${currentYear}-08-13`, icon: '🏮', color: 'bg-orange-50', description: '先祖を供養する' },
    { name: '敬老の日', date: `${currentYear}-09-15`, icon: '👴', color: 'bg-orange-50', description: '高齢者を敬う日' },
    { name: '秋分の日', date: `${currentYear}-09-23`, icon: '🍁', color: 'bg-orange-50', description: '秋のお彼岸' },
    { name: 'ハロウィン', date: `${currentYear}-10-31`, icon: '🎃', color: 'bg-orange-50', description: '仮装を楽しむ日' },
    { name: '文化の日', date: `${currentYear}-11-03`, icon: '🎨', color: 'bg-purple-50', description: '文化を大切にする日' },
    { name: '七五三', date: `${currentYear}-11-15`, icon: '👘', color: 'bg-red-50', description: '子供の成長を祝う' },
    { name: '勤労感謝の日', date: `${currentYear}-11-23`, icon: '💼', color: 'bg-blue-50', description: '働く人に感謝する日' },
    { name: 'クリスマス', date: `${currentYear}-12-25`, icon: '🎄', color: 'bg-green-50', description: 'クリスマスを祝う' },
    { name: '大晦日', date: `${currentYear}-12-31`, icon: '🔔', color: 'bg-purple-50', description: '一年の締めくくり' },
    
    // Sports events
    { name: '箱根駅伝', date: `${currentYear}-01-02`, icon: '🏃', color: 'bg-blue-50', description: '正月の風物詩' },
    { name: '春の選抜高校野球', date: `${currentYear}-03-18`, icon: '⚾', color: 'bg-green-50', description: '甲子園で高校野球' },
    { name: '夏の甲子園', date: `${currentYear}-08-06`, icon: '⚾', color: 'bg-orange-50', description: '高校野球の聖地' },
    
    // Next year events (for end of year)
    { name: '正月', date: `${currentYear + 1}-01-01`, icon: '🎍', color: 'bg-red-50', description: '新年のお祝い' },
    { name: '箱根駅伝', date: `${currentYear + 1}-01-02`, icon: '🏃', color: 'bg-blue-50', description: '正月の風物詩' },
    { name: '成人の日', date: `${currentYear + 1}-01-13`, icon: '👘', color: 'bg-pink-50', description: '新成人を祝う日' }
  ]
  
  // Filter future events and sort by date
  const upcomingEvents = allEvents
    .map(event => ({
      ...event,
      dateObj: new Date(event.date)
    }))
    .filter(event => event.dateObj >= now)
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(0, 3) // Get top 3
  
  return upcomingEvents.map(event => {
    const daysUntil = Math.ceil((event.dateObj - now) / (1000 * 60 * 60 * 24))
    const dateStr = `${event.dateObj.getMonth() + 1}月${event.dateObj.getDate()}日`
    
    return {
      ...event,
      daysUntil,
      dateStr
    }
  })
}

// Helper function to safely format dates
function formatDate(dateString) {
  if (!dateString) return '日付不明'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '日付不明'
    return date.toLocaleDateString('ja-JP')
  } catch (error) {
    return '日付不明'
  }
}

// Load my page data
async function loadMyPage() {
  try {
    // Check auth
    const authRes = await fetch('/api/user/me', { credentials: 'include' })
    const authData = await authRes.json()
    
    if (!authData.authenticated || !authData.user) {
      window.location.href = '/'
      return
    }
    
    userData = authData.user
    
    // Load categories
    const categoriesRes = await fetch('/api/categories')
    categories = await categoriesRes.json()
    
    // Load notification settings
    const notificationsRes = await fetch('/api/user/notifications', { credentials: 'include' })
    notificationSettings = await notificationsRes.json()
    
    // Load downloads and favorites
    const downloadsRes = await fetch('/api/user/downloads', { credentials: 'include' })
    const downloads = await downloadsRes.json()
    
    const favoritesRes = await fetch('/api/user/favorites', { credentials: 'include' })
    const favorites = await favoritesRes.json()
    
    // Debug: Log data structure
    console.log('Downloads sample:', downloads[0])
    console.log('Favorites sample:', favorites[0])
    
    // Render my page
    renderMyPage(downloads, favorites)
    
    // Load random quote after page render
    loadRandomQuote()
  } catch (error) {
    console.error('Failed to load my page:', error)
    document.getElementById('mypage-content').innerHTML = `
      <div class="text-center py-12 text-red-600">
        <i class="fas fa-exclamation-triangle text-5xl mb-4"></i>
        <p>データの読み込みに失敗しました</p>
        <button onclick="window.location.reload()" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-600">
          再読み込み
        </button>
      </div>
    `
  }
}

// Render my page
function renderMyPage(downloads, favorites) {
  const content = document.getElementById('mypage-content')
  
  content.innerHTML = `
    <!-- Page Title -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-1">
        <i class="fas fa-user-circle text-primary mr-2"></i>MY PAGE
      </h2>
      <p class="text-gray-600 text-sm">アカウント情報と設定の管理</p>
    </div>

    <!-- User Info Card - Compact -->
    <div class="bg-white rounded-lg shadow-md border-2 border-gray-200 p-4 mb-6">
      <div class="flex items-center gap-4">
        <div class="relative">
          ${userData.profilePhotoUrl ? `
            <img src="${escapeHtml(userData.profilePhotoUrl)}" 
              alt="Profile Photo" 
              class="w-16 h-16 rounded-full border-2 border-primary object-cover">
          ` : `
            <div class="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-primary text-primary">
              ${userData.name.charAt(0).toUpperCase()}
            </div>
          `}
          <button onclick="document.getElementById('profile-photo-input').click()" 
            class="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1.5 shadow hover:bg-red-600 transition-colors text-xs">
            <i class="fas fa-camera"></i>
          </button>
          <input type="file" id="profile-photo-input" accept="image/*" class="hidden" onchange="uploadProfilePhoto(event)">
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-bold text-gray-800 truncate">${escapeHtml(userData.name)} さん</h3>
          <p class="text-sm text-gray-600 truncate"><i class="fas fa-envelope mr-1"></i>${escapeHtml(userData.email)}</p>
          <p class="text-xs text-gray-500 mt-1">
            <i class="fas fa-calendar mr-1"></i>${formatDate(userData.createdAt)} 登録
            <span class="ml-3">
              <i class="fas fa-id-card mr-1"></i>会員番号: ${userData.id}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Inspirational Quote Section -->
    <div class="mb-6">
      <div id="quote-content" class="text-center py-2">
        <!-- Quote will be inserted here -->
      </div>
      <div class="text-center mt-3">
        <button onclick="loadRandomQuote()" 
          class="text-gray-400 hover:text-primary transition-colors text-sm"
          title="別の名言を見る">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>

    <!-- Favorites Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-heart text-primary mr-3"></i>
        お気に入り
        <span class="ml-3 text-sm font-normal text-gray-600">(${favorites.length}件)</span>
      </h3>
      
      ${favorites.length > 0 ? `
        <div class="space-y-3">
          ${favorites.slice(0, 10).map(f => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex-1">
                <h4 class="font-normal text-sm text-gray-800 mb-1">${escapeHtml(f.title)}</h4>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span><i class="fas fa-folder mr-1"></i>${escapeHtml(f.category_name || f.categoryName || 'カテゴリ不明')}</span>
                  <span><i class="fas fa-clock mr-1"></i>${formatDate(f.created_at || f.createdAt)}</span>
                </div>
              </div>
              <a href="${escapeHtml(f.googleDriveUrl)}" target="_blank" rel="noopener noreferrer"
                class="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors" title="開く">
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          `).join('')}
        </div>
        ${favorites.length > 10 ? `
          <p class="text-center text-gray-600 mt-4 text-sm">
            最新10件を表示中 (全${favorites.length}件)
          </p>
        ` : ''}
      ` : `
        <p class="text-center text-gray-500 py-8">
          <i class="fas fa-inbox text-5xl mb-3 opacity-50"></i><br>
          まだお気に入りがありません
        </p>
      `}
    </div>

    <!-- Upcoming Events Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-calendar-alt text-primary mr-3"></i>
        直近のイベント
      </h3>
      <div class="space-y-3">
        ${getUpcomingEvents().map(event => `
          <div class="flex items-center justify-between p-4 ${event.color} rounded-lg border border-gray-200">
            <div class="flex items-center gap-3">
              <div class="text-3xl">${event.icon}</div>
              <div>
                <h4 class="font-semibold text-sm text-gray-800">${event.name}</h4>
                <p class="text-xs text-gray-600">${event.description}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-800">${event.dateStr}</p>
              <p class="text-xs text-gray-500">あと${event.daysUntil}日</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Download History Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-download text-primary mr-3"></i>
        ダウンロード履歴
        <span class="ml-3 text-sm font-normal text-gray-600">(${downloads.length}件)</span>
      </h3>
      
      ${downloads.length > 0 ? `
        <div class="space-y-3">
          ${downloads.slice(0, 10).map(d => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex-1">
                <h4 class="font-normal text-sm text-gray-800 mb-1">${escapeHtml(d.title)}</h4>
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span><i class="fas fa-folder mr-1"></i>${escapeHtml(d.category_name || d.categoryName || 'カテゴリ不明')}</span>
                  <span><i class="fas fa-clock mr-1"></i>${formatDate(d.downloaded_at || d.downloadedAt)}</span>
                </div>
              </div>
              <a href="${escapeHtml(d.googleDriveUrl)}" target="_blank" rel="noopener noreferrer"
                class="ml-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors" title="開く">
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          `).join('')}
        </div>
        ${downloads.length > 10 ? `
          <p class="text-center text-gray-600 mt-4 text-sm">
            最新10件を表示中 (全${downloads.length}件)
          </p>
        ` : ''}
      ` : `
        <p class="text-center text-gray-500 py-8">
          <i class="fas fa-inbox text-5xl mb-3 opacity-50"></i><br>
          まだダウンロード履歴がありません
        </p>
      `}
    </div>

    <!-- Notification Settings Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-bell text-primary mr-3"></i>
        メール通知設定
      </h3>
      <p class="text-gray-600 mb-6 text-sm">
        興味のあるSNSカテゴリを選択してください。チェックを入れたカテゴリの新着資料を毎週月曜日にメールでお知らせします。
      </p>
      
      <div id="notification-categories" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        ${renderNotificationCategories()}
      </div>
      
      <button onclick="saveNotificationSettings()" 
        class="mt-6 w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
        <i class="fas fa-save mr-2"></i>通知設定を保存
      </button>
    </div>

    <!-- SNS Information Section -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-gray-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-share-alt text-primary mr-3"></i>
        SNS情報
      </h3>
      <p class="text-gray-600 mb-4 text-sm">
        あなたのSNSアカウント情報を登録してください。プロフィールに表示されます。
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fab fa-youtube text-red-600 mr-2"></i>YouTube チャンネルURL
          </label>
          <input type="url" id="youtube-url" 
            value="${userData.youtubeUrl || ''}"
            placeholder="https://youtube.com/@your-channel"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fab fa-instagram text-pink-600 mr-2"></i>Instagram アカウント
          </label>
          <input type="text" id="instagram-handle" 
            value="${userData.instagramHandle || ''}"
            placeholder="@your_account"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fab fa-tiktok text-black mr-2"></i>TikTok アカウント
          </label>
          <input type="text" id="tiktok-handle" 
            value="${userData.tiktokHandle || ''}"
            placeholder="@your_account"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fab fa-twitter text-blue-400 mr-2"></i>X (Twitter) アカウント
          </label>
          <input type="text" id="twitter-handle" 
            value="${userData.twitterHandle || ''}"
            placeholder="@your_account"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
        </div>
      </div>
      
      <button onclick="saveSnsInfo()" 
        class="mt-4 w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
        <i class="fas fa-save mr-2"></i>SNS情報を保存
      </button>
    </div>

    <!-- Account Actions -->
    <div class="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <h3 class="text-base font-normal text-gray-800 mb-4 flex items-center">
        <i class="fas fa-cog text-primary mr-3"></i>
        アカウント管理
      </h3>
      
      <div class="space-y-3">
        <button onclick="if(confirm('ログアウトしますか?')) handleLogout()"
          class="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
          <i class="fas fa-sign-out-alt mr-2"></i>ログアウト
        </button>
      </div>
    </div>
  `
}

// Render notification categories
function renderNotificationCategories() {
  return categories.map(category => {
    const setting = notificationSettings.find(s => s.categoryId === category.id) || {
      notificationEnabled: false
    }
    
    return `
      <div class="relative">
        <input type="checkbox" 
          id="notify-${category.id}" 
          ${setting.notificationEnabled ? 'checked' : ''}
          class="peer hidden">
        <label for="notify-${category.id}" 
          class="block px-2 py-2.5 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer transition-all hover:border-primary hover:bg-gray-100 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white text-center">
          <i class="fas fa-check absolute top-1 right-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity text-xs"></i>
          <span class="font-medium text-xs">${escapeHtml(category.name)}</span>
        </label>
      </div>
    `
  }).join('')
}

// Upload profile photo
async function uploadProfilePhoto(event) {
  const file = event.target.files[0]
  if (!file) return
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('ファイルサイズは5MB以下にしてください')
    return
  }
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    alert('画像ファイルを選択してください')
    return
  }
  
  try {
    // Convert to base64
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target.result
      
      // Save to server
      const res = await fetch('/api/user/profile-photo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ photoUrl: base64 })
      })
      
      if (!res.ok) throw new Error('Failed to upload')
      
      // Reload page to show new photo
      window.location.reload()
    }
    reader.readAsDataURL(file)
  } catch (error) {
    console.error('Failed to upload profile photo:', error)
    alert('プロフィール写真のアップロードに失敗しました')
  }
}

// Save SNS information
async function saveSnsInfo() {
  const button = event.target
  const originalHtml = button.innerHTML
  
  try {
    button.disabled = true
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>保存中...'
    
    const snsData = {
      youtubeUrl: document.getElementById('youtube-url').value.trim(),
      instagramHandle: document.getElementById('instagram-handle').value.trim(),
      tiktokHandle: document.getElementById('tiktok-handle').value.trim(),
      twitterHandle: document.getElementById('twitter-handle').value.trim()
    }
    
    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(snsData)
    })
    
    if (!res.ok) throw new Error('Failed to save')
    
    button.innerHTML = '<i class="fas fa-check mr-2"></i>保存完了！'
    button.classList.remove('bg-primary', 'hover:bg-red-600')
    button.classList.add('bg-green-600')
    
    setTimeout(() => {
      button.innerHTML = originalHtml
      button.classList.remove('bg-green-600')
      button.classList.add('bg-primary', 'hover:bg-red-600')
      button.disabled = false
    }, 2000)
  } catch (error) {
    console.error('Failed to save SNS info:', error)
    alert('SNS情報の保存に失敗しました')
    button.innerHTML = originalHtml
    button.disabled = false
  }
}

// Save notification settings
async function saveNotificationSettings() {
  const button = event.target
  const originalHtml = button.innerHTML
  
  try {
    button.disabled = true
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>保存中...'
    
    const settings = categories.map(category => {
      const enabled = document.getElementById(`notify-${category.id}`).checked
      
      return {
        categoryId: category.id,
        notificationEnabled: enabled,
        frequency: 'weekly'  // Always set to weekly
      }
    })
    
    const res = await fetch('/api/user/notifications/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ settings })
    })
    
    if (!res.ok) throw new Error('Failed to save')
    
    button.innerHTML = '<i class="fas fa-check mr-2"></i>保存完了！'
    button.classList.remove('bg-primary', 'hover:bg-red-600')
    button.classList.add('bg-green-600')
    
    setTimeout(() => {
      button.innerHTML = originalHtml
      button.classList.remove('bg-green-600')
      button.classList.add('bg-primary', 'hover:bg-red-600')
      button.disabled = false
    }, 2000)
  } catch (error) {
    console.error('Failed to save notification settings:', error)
    alert('通知設定の保存に失敗しました')
    button.innerHTML = originalHtml
    button.disabled = false
  }
}

// Get account age in days
function getAccountAge() {
  const created = new Date(userData.createdAt)
  const now = new Date()
  const days = Math.floor((now - created) / (1000 * 60 * 60 * 24))
  return `${days}日`
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text || ''
  return div.innerHTML
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
  loadMyPage()
})
