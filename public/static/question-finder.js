// キーワードチェック - Google検索データ連携

// SNS投稿適性スコアを判定（0-100）
function calculateSNSScore(keyword) {
  let score = 50 // 基本スコア
  
  const kw = keyword.toLowerCase()
  
  // 高スコア（SNS投稿に最適）
  const highValueKeywords = [
    'トレンド', '最新', '人気', 'おすすめ', 'ランキング',
    'デザイン', 'アイデア', 'ネタ', '方法', 'やり方', 
    'コツ', 'ポイント', '選び方', '比較', 'まとめ',
    'メリット', 'デメリット', '効果', '理由', '秘訣',
    '成功', '失敗', '注意点', 'おしゃれ', 'かわいい',
    'アレンジ', 'スタイル', 'テクニック', '活用',
    'セルフ', '初心者', '簡単', 'diy', '作り方'
  ]
  
  // 中スコア（まあまあ投稿向き）
  const mediumValueKeywords = [
    '始め方', '使い方', '設定', '手順', 'ステップ',
    '基礎', '基本', '入門', 'とは'
  ]
  
  // 低スコア（投稿向きでない）
  const lowValueKeywords = [
    '費用', '料金', '価格', '相場', '値段',
    '資格', '免許', '求人', '募集', '採用',
    '通販', '販売', '購入', '買う', '激安',
    '営業時間', '定休日', '電話番号', '住所'
  ]
  
  // 地名を含む場合は減点（地域限定的で汎用性が低い）
  const locationKeywords = [
    '渋谷', '新宿', '池袋', '銀座', '原宿', '表参道',
    '東京', '大阪', '名古屋', '福岡', '札幌', '横浜',
    '駅', '店', '店舗', 'サロン近く'
  ]
  
  // スコア加算
  highValueKeywords.forEach(keyword => {
    if (kw.includes(keyword)) score += 15
  })
  
  mediumValueKeywords.forEach(keyword => {
    if (kw.includes(keyword)) score += 5
  })
  
  // スコア減算
  lowValueKeywords.forEach(keyword => {
    if (kw.includes(keyword)) score -= 25
  })
  
  locationKeywords.forEach(keyword => {
    if (kw.includes(keyword)) score -= 30
  })
  
  // 年号を含む場合は加点（トレンド性が高い）
  if (kw.match(/202[0-9]/)) {
    score += 10
  }
  
  // 「〜とは」は基礎的なので少し減点
  if (kw.includes('とは') || kw.includes('意味')) {
    score -= 10
  }
  
  // スコアを0-100に正規化
  return Math.max(0, Math.min(100, score))
}

// Note: app.js already provides the state object for auth compatibility
// We use keywordCheckerState for local keyword-specific state

// State管理
const keywordCheckerState = {
  keywords: [],
  generatedKeywords: [],
  loading: false
}

// 初期化
function initKeywordChecker() {
  // Hide empty category and tag filters
  const categoryFilter = document.getElementById('category-filter')
  const tagFilter = document.getElementById('tag-filter')
  if (categoryFilter && !categoryFilter.hasChildNodes()) {
    categoryFilter.style.display = 'none'
  }
  if (tagFilter && !tagFilter.hasChildNodes()) {
    tagFilter.style.display = 'none'
  }
  
  // Immediately render page (don't wait for auth)
  renderKeywordCheckerPage()
  
  // Check authentication in background (non-blocking)
  checkAuthStatus()
  
  // イベントリスナー設定
  document.getElementById('generate-btn')?.addEventListener('click', generateKeywords)
  document.getElementById('generate-btn-mobile')?.addEventListener('click', generateKeywords)
  document.getElementById('keywords-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      generateKeywords()
    }
  })
}

// Show login required page
function showLoginRequiredPage() {
  const app = document.getElementById('question-finder-app')
  if (!app) return
  
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-primary">
        <div class="mb-6">
          <i class="fas fa-lock text-6xl text-primary mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">ログインが必要です</h2>
          <p class="text-gray-600 mb-6">
            キーワードチェック機能は会員限定です。<br>
            ログインまたは会員登録してご利用ください。
          </p>
        </div>
        
        <div class="space-y-3">
          <button 
            onclick="showLoginModal()"
            class="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <i class="fas fa-sign-in-alt"></i>
            <span>ログイン</span>
          </button>
          
          <button 
            onclick="showRegisterModal()"
            class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <i class="fas fa-user-plus"></i>
            <span>会員登録（無料）</span>
          </button>
          
          <a 
            href="/"
            class="block w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <i class="fas fa-home mr-2"></i>
            トップページに戻る
          </a>
        </div>
      </div>
    </div>
  `
}

// ページレンダリング
function renderKeywordCheckerPage() {
  const app = document.getElementById('question-finder-app')
  if (!app) return
  
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 sm:gap-3 min-w-0">
              <i class="fas fa-search text-xl sm:text-3xl text-primary flex-shrink-0"></i>
              <div class="min-w-0">
                <h1 class="text-base sm:text-2xl font-bold text-gray-800 truncate">キーワードチェック</h1>
                <p class="text-xs text-gray-500 hidden sm:block">Google検索データ連携・SNS投稿ネタ発見</p>
              </div>
            </div>
            <a href="/mypage" class="text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors whitespace-nowrap flex-shrink-0">
              <i class="fas fa-arrow-left mr-1"></i><span class="hidden sm:inline">マイページに戻る</span><span class="sm:hidden">戻る</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-5xl">
        <!-- 説明カード -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
          <div class="flex items-start gap-2 sm:gap-3">
            <i class="fas fa-lightbulb text-xl sm:text-2xl text-yellow-500 mt-1 flex-shrink-0"></i>
            <div class="min-w-0">
              <h2 class="text-sm sm:text-lg font-bold text-gray-800 mb-2">Google検索データからSNS投稿ネタを発見</h2>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Googleで検索されている関連キーワードを取得し、SNS投稿ネタとして使える度合いを自動判定します。
              </p>
            </div>
          </div>
        </div>

        <!-- 入力エリア -->
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-8 mb-4 sm:mb-6 border-2 border-primary/20">
          <label class="block text-base sm:text-xl font-bold text-gray-800 mb-4">
            <i class="fas fa-keyboard mr-2 text-primary text-lg sm:text-2xl"></i>キーワードを入力
          </label>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input 
              type="text" 
              id="keywords-input" 
              class="flex-1 px-4 sm:px-6 py-4 sm:py-5 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-800 text-base sm:text-lg font-medium placeholder:text-gray-400"
              placeholder="例：Instagram, ネイル"
              style="height: 60px;"
            >
            <button 
              id="generate-btn"
              class="hidden sm:block px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-primary to-pink-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap text-base sm:text-lg"
              style="min-height: 60px;">
              <i class="fas fa-search mr-2"></i>チェック
            </button>
          </div>
          <!-- Mobile Check Button (Below Input) -->
          <button 
            id="generate-btn-mobile"
            class="sm:hidden w-full mt-3 px-6 py-4 bg-gradient-to-r from-primary to-pink-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 text-base"
            style="min-height: 56px;">
            <i class="fas fa-search mr-2"></i>チェック
          </button>
          <p class="text-sm text-gray-500 mt-3">
            <i class="fas fa-info-circle mr-1"></i>複数入力時はカンマ（,）区切り
          </p>
        </div>

        <!-- 結果エリア -->
        <div id="results-area"></div>

        <!-- SNS運用のヒント -->
        <div class="mt-8 space-y-6">
          <!-- 一貫性の重要性 -->
          <div class="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl shadow-lg p-6 border border-pink-100">
            <div class="flex items-start gap-3 mb-4">
              <div class="bg-white rounded-full p-3 shadow-md">
                <i class="fas fa-sync-alt text-2xl text-primary"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-800 mb-2">SNS運用における一貫性の重要性</h2>
                <p class="text-sm text-gray-600">継続的な発信で信頼を築く</p>
              </div>
            </div>
            <div class="bg-white rounded-xl p-5 space-y-4">
              <div class="flex items-start gap-3">
                <i class="fas fa-check-circle text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <h3 class="font-bold text-gray-800 mb-1">テーマの一貫性を保つ</h3>
                  <p class="text-sm text-gray-600">あなたのアカウントが何の専門家なのかを明確にしましょう。「ネイルサロン経営者」「料理研究家」「育児アドバイザー」など、軸を決めることでフォロワーが期待する投稿内容が定まります。</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <i class="fas fa-check-circle text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <h3 class="font-bold text-gray-800 mb-1">投稿頻度の一貫性</h3>
                  <p class="text-sm text-gray-600">週3回なら週3回、毎日なら毎日と、投稿リズムを一定に保つことでフォロワーの期待値をコントロールできます。不規則な投稿は「このアカウントは更新されているのか？」という不安を生みます。</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <i class="fas fa-check-circle text-green-500 mt-1 flex-shrink-0"></i>
                <div>
                  <h3 class="font-bold text-gray-800 mb-1">トーン＆マナーの統一</h3>
                  <p class="text-sm text-gray-600">「です・ます調」か「だ・である調」か、絵文字を使うか使わないか、丁寧語かフランクな口調か。文体やビジュアルの雰囲気を統一することで、ブランドイメージが確立されます。</p>
                </div>
              </div>
              <div class="bg-pink-50 rounded-lg p-4 mt-4">
                <p class="text-sm text-gray-700">
                  <i class="fas fa-quote-left text-pink-400 mr-2"></i>
                  <strong>赤髪Tips:</strong> 一貫性があると「このアカウントは信頼できる」という印象を与え、フォロワーが離脱しにくくなります。投稿ネタに困ったときこそ、軸となるテーマに立ち返りましょう。
                </p>
              </div>
            </div>
          </div>

          <!-- キーワードから投稿を考えるポイント -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100">
            <div class="flex items-start gap-3 mb-4">
              <div class="bg-white rounded-full p-3 shadow-md">
                <i class="fas fa-lightbulb text-2xl text-blue-500"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-800 mb-2">キーワードから投稿を考えるポイント</h2>
                <p class="text-sm text-gray-600">検索データを投稿ネタに変換する方法</p>
              </div>
            </div>
            <div class="bg-white rounded-xl p-5 space-y-4">
              <div class="flex items-start gap-3">
                <div class="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">1</div>
                <div>
                  <h3 class="font-bold text-gray-800 mb-1">「〇〇 おすすめ」系キーワード → ランキング投稿</h3>
                  <p class="text-sm text-gray-600">「ネイル おすすめ」なら「今月おすすめのネイルデザインBEST5」として画像カルーセルで紹介。視覚的に分かりやすく、保存されやすい投稿になります。</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">2</div>
                <div>
                  <h3 class="font-bold text-gray-800 mb-1">「〇〇 やり方」系キーワード → ハウツー投稿</h3>
                  <p class="text-sm text-gray-600">「セルフネイル やり方」なら、ステップバイステップで解説する投稿に。「STEP1: 爪の形を整える」「STEP2: ベースコートを塗る」のように手順を分けると保存率UP。</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">3</div>
                <div>
                  <h3 class="font-bold text-gray-800 mb-1">「〇〇 失敗」系キーワード → 注意喚起投稿</h3>
                  <p class="text-sm text-gray-600">「ネイル 失敗」なら「セルフネイルでやりがちな失敗5選と対策」として、NG例と正解例をセットで紹介。共感と学びが得られる投稿は反応率が高くなります。</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">4</div>
                <div>
                  <h3 class="font-bold text-gray-800 mb-1">「〇〇 トレンド」系キーワード → 最新情報投稿</h3>
                  <p class="text-sm text-gray-600">「ネイル トレンド 2024」なら「2024年春夏トレンドネイル」として、今シーズンの人気デザインや色を紹介。タイムリーな情報は拡散されやすい特徴があります。</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">5</div>
                <div>
                  <h3 class="font-bold text-gray-800 mb-1">「〇〇 初心者」系キーワード → 入門ガイド投稿</h3>
                  <p class="text-sm text-gray-600">「ネイル 初心者」なら「初心者さん向け！必要な道具リスト」や「まずはこれから始めよう」といった、ハードルを下げる投稿に。初心者層の獲得に有効です。</p>
                </div>
              </div>
              <div class="bg-blue-50 rounded-lg p-4 mt-4">
                <p class="text-sm text-gray-700 mb-3">
                  <i class="fas fa-star text-yellow-500 mr-2"></i>
                  <strong>キーワード活用の黄金ルール</strong>
                </p>
                <ul class="text-sm text-gray-600 space-y-2 ml-4">
                  <li class="flex items-start gap-2">
                    <i class="fas fa-caret-right text-blue-500 mt-1"></i>
                    <span><strong>検索意図を理解する:</strong> そのキーワードで検索する人は何を知りたいのか？を考える</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fas fa-caret-right text-blue-500 mt-1"></i>
                    <span><strong>自分の強みと掛け合わせる:</strong> キーワード + あなただけの経験や知識</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fas fa-caret-right text-blue-500 mt-1"></i>
                    <span><strong>視覚的に訴える:</strong> テキストだけでなく、画像や動画で分かりやすく</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="fas fa-caret-right text-blue-500 mt-1"></i>
                    <span><strong>保存・共有を促す:</strong> 「保存しておくと便利！」など行動を促す一言を添える</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- データ活用のコツ -->
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-100">
            <div class="flex items-start gap-3 mb-4">
              <div class="bg-white rounded-full p-3 shadow-md">
                <i class="fas fa-chart-line text-2xl text-purple-500"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-800 mb-2">検索データを活用するコツ</h2>
                <p class="text-sm text-gray-600">SNSスコアの見方と活用法</p>
              </div>
            </div>
            <div class="bg-white rounded-xl p-5 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">80-100</span>
                    <span class="font-bold text-gray-800">高スコア</span>
                  </div>
                  <p class="text-xs text-gray-600">積極的に投稿ネタとして活用。視覚的なコンテンツに最適です。</p>
                </div>
                <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">50-79</span>
                    <span class="font-bold text-gray-800">中スコア</span>
                  </div>
                  <p class="text-xs text-gray-600">工夫次第で投稿ネタに。あなたの経験談と組み合わせると◎</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold">0-49</span>
                    <span class="font-bold text-gray-800">低スコア</span>
                  </div>
                  <p class="text-xs text-gray-600">参考情報として活用。直接的な投稿ネタには不向きです。</p>
                </div>
              </div>
              <div class="bg-purple-50 rounded-lg p-4 mt-4">
                <p class="text-sm text-gray-700">
                  <i class="fas fa-info-circle text-purple-500 mr-2"></i>
                  <strong>活用のヒント:</strong> 高スコアのキーワードを月間投稿カレンダーに組み込み、中スコアのキーワードはストーリーズやリール短編で活用、低スコアは補足情報として使いましょう。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
}

// キーワード生成
async function generateKeywords() {
  if (keywordCheckerState.loading) return
  
  const input = document.getElementById('keywords-input')
  const keywords = input.value
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0)
  
  if (keywords.length === 0) {
    showToast('キーワードを入力してください', 'error')
    return
  }
  
  keywordCheckerState.loading = true
  keywordCheckerState.keywords = keywords
  keywordCheckerState.generatedKeywords = []
  
  // ローディング表示
  const resultsArea = document.getElementById('results-area')
  resultsArea.innerHTML = `
    <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
      <i class="fas fa-spinner fa-spin text-5xl text-primary mb-4"></i>
      <p class="text-gray-600 font-semibold">Google検索データを取得中...</p>
      <p class="text-gray-500 text-sm mt-2">関連キーワードを分析しています</p>
    </div>
  `
  
  try {
    // 各キーワードに対して処理
    for (const keyword of keywords) {
      const keywordData = await generateKeywordsForKeyword(keyword)
      
      keywordCheckerState.generatedKeywords.push({
        keyword: keyword,
        keywords: keywordData
      })
    }
    
    renderResults()
    showToast(`${keywords.length}個のキーワードで関連キーワードを取得しました！`, 'success')
  } catch (error) {
    showToast('関連キーワードの取得に失敗しました', 'error')
    resultsArea.innerHTML = ''
  } finally {
    keywordCheckerState.loading = false
  }
}

// キーワードごとの関連キーワード生成
async function generateKeywordsForKeyword(keyword) {
  const keywordsWithScores = []
  
  // Google Suggestから関連キーワードを取得
  const suggestions = await fetchGoogleSuggestions(keyword)
  
  // 各サジェストにスコアを付与
  for (const suggestion of suggestions) {
    keywordsWithScores.push({ 
      text: suggestion, 
      score: calculateSNSScore(suggestion) 
    })
  }
  
  // SNSスコアでソート（高い順）
  const sortedKeywords = keywordsWithScores.sort((a, b) => b.score - a.score)
  
  // SNS投稿向け（スコア55以上）と参考用に分類
  const snsKeywords = sortedKeywords.filter(k => k.score >= 55).slice(0, 50)
  const referenceKeywords = sortedKeywords.filter(k => k.score < 55).slice(0, 50)
  
  return {
    snsKeywords: snsKeywords,
    referenceKeywords: referenceKeywords,
    allKeywords: [...snsKeywords, ...referenceKeywords]
  }
}

// Google Suggestから関連キーワードを取得（複数サフィックスで50件以上取得）
async function fetchGoogleSuggestions(keyword) {
  try {
    // 複数のサフィックスを使って多くのキーワードを取得
    const suffixes = ['', ' あ', ' い', ' う', ' え', ' お', ' か', ' き', ' く', ' け', ' こ', 
                      ' と', ' は', ' 方法', ' 使い方', ' おすすめ', ' 比較', ' 違い', ' 料金', ' 無料']
    
    const allSuggestions = new Set()
    
    // 並列でAPIを呼び出し
    const promises = suffixes.map(async (suffix) => {
      try {
        const response = await fetch(`/api/suggest?q=${encodeURIComponent(keyword + suffix)}`)
        const data = await response.json()
        
        if (data.suggestions && Array.isArray(data.suggestions)) {
          data.suggestions.forEach(s => allSuggestions.add(s))
        }
      } catch (error) {
        // エラーは無視して続行
      }
    })
    
    await Promise.all(promises)
    
    return Array.from(allSuggestions)
  } catch (error) {
    return []
  }
}

// 結果表示
function renderResults() {
  const resultsArea = document.getElementById('results-area')
  if (!resultsArea || keywordCheckerState.generatedKeywords.length === 0) return
  
  resultsArea.innerHTML = keywordCheckerState.generatedKeywords.map((item, index) => {
    const snsCount = item.keywords.snsKeywords.length
    const refCount = item.keywords.referenceKeywords.length
    const totalCount = snsCount + refCount
    
    return `
    <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100" id="keyword-section-${index}">
      <!-- キーワードヘッダー -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-200 gap-3">
        <h2 class="text-base sm:text-xl font-bold text-gray-800 flex flex-col sm:flex-row sm:items-center gap-2">
          <span class="bg-gradient-to-r from-primary to-pink-500 text-white rounded-lg px-3 py-1.5 text-sm sm:text-base inline-block">
            ${escapeHtml(item.keyword)}
          </span>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs sm:text-sm text-gray-500">全 ${totalCount} 件</span>
            <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              <i class="fas fa-check-circle mr-1"></i>Google検索データ
            </span>
          </div>
        </h2>
        <div class="flex flex-wrap gap-2">
          <button 
            onclick="copyAllKeywords(${index})"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fas fa-copy mr-1 sm:mr-2"></i><span class="hidden sm:inline">全て</span>コピー
          </button>
          <button 
            onclick="exportToText(${index})"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors">
            <i class="fas fa-file-download mr-1 sm:mr-2"></i>TXT
          </button>
          <button 
            onclick="exportToCSV(${index})"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-purple-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-purple-600 transition-colors">
            <i class="fas fa-file-csv mr-1 sm:mr-2"></i>CSV
          </button>
        </div>
      </div>
      
      <!-- SNS投稿ネタセクション -->
      ${snsCount > 0 ? `
      <div class="mb-4 sm:mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center mb-3 gap-2">
          <div class="flex items-center bg-gradient-to-r from-pink-500 to-primary text-white px-3 py-1.5 rounded-lg text-sm">
            <i class="fas fa-fire mr-2"></i>
            <span class="font-bold">SNS投稿ネタ候補</span>
          </div>
          <span class="text-xs sm:text-sm text-gray-600">${snsCount}件（投稿で反応が得やすいキーワード）</span>
        </div>
        <div class="grid grid-cols-1 gap-2 sm:gap-3 bg-gradient-to-r from-pink-50 to-red-50 p-3 sm:p-4 rounded-lg">
          ${item.keywords.snsKeywords.map((k, kIndex) => `
            <div class="flex items-center p-2.5 sm:p-3 bg-white rounded-lg hover:shadow-md transition-all group">
              <span class="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-pink-500 to-primary text-white rounded-full text-xs font-bold mr-2 sm:mr-3 flex-shrink-0">
                ${kIndex + 1}
              </span>
              <span class="flex-1 text-sm sm:text-base text-gray-800 font-medium break-all">${escapeHtml(k.text)}</span>
              <div class="flex items-center gap-1.5 sm:gap-2 ml-2 sm:ml-3 flex-shrink-0">
                <span class="text-xs bg-yellow-100 text-yellow-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold whitespace-nowrap">
                  ${k.score}点
                </span>
                <button 
                  onclick="copyKeyword('${escapeHtml(k.text)}')"
                  class="px-2 sm:px-3 py-1 text-xs bg-primary text-white rounded hover:bg-red-600 transition-colors flex-shrink-0">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      <!-- 参考用セクション -->
      ${refCount > 0 ? `
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center mb-3 gap-2">
          <div class="flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm">
            <i class="fas fa-book mr-2"></i>
            <span class="font-bold">参考用キーワード</span>
          </div>
          <span class="text-xs sm:text-sm text-gray-500">${refCount}件（基礎情報・地域限定など）</span>
        </div>
        <div class="grid grid-cols-1 gap-2">
          ${item.keywords.referenceKeywords.map((k, kIndex) => `
            <div class="flex items-center p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <span class="text-xs sm:text-sm font-semibold text-gray-400 mr-2 sm:mr-3 flex-shrink-0">${snsCount + kIndex + 1}.</span>
              <span class="flex-1 text-sm sm:text-base text-gray-600 break-all">${escapeHtml(k.text)}</span>
              <button 
                onclick="copyKeyword('${escapeHtml(k.text)}')"
                class="ml-2 sm:ml-3 px-2 sm:px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </div>
    `
  }).join('')
}

// 1つのキーワードをコピー
function copyKeyword(keyword) {
  // HTMLエンティティをデコード
  const textarea = document.createElement('textarea')
  textarea.innerHTML = keyword
  const decodedKeyword = textarea.value
  
  navigator.clipboard.writeText(decodedKeyword).then(() => {
    showToast('キーワードをコピーしました', 'success')
  }).catch(err => {
    showToast('コピーに失敗しました', 'error')
  })
}

// 全キーワードをコピー
function copyAllKeywords(index) {
  const item = keywordCheckerState.generatedKeywords[index]
  const snsTexts = item.keywords.snsKeywords.map(k => k.text)
  const refTexts = item.keywords.referenceKeywords.map(k => k.text)
  const allTexts = [...snsTexts, ...refTexts]
  const text = allTexts.join('\n')
  
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${item.keyword}の全キーワードをコピーしました`, 'success')
  }).catch(err => {
    showToast('コピーに失敗しました', 'error')
  })
}

// テキストファイルとしてエクスポート
function exportToText(index) {
  const item = keywordCheckerState.generatedKeywords[index]
  let text = `【${item.keyword}】の関連キーワード\n\n`
  
  if (item.keywords.snsKeywords.length > 0) {
    text += '■ SNS投稿ネタ候補（投稿で反応が得やすいキーワード）\n\n'
    text += item.keywords.snsKeywords.map((k, i) => `${i + 1}. ${k.text} (スコア: ${k.score})`).join('\n')
    text += '\n\n'
  }
  
  if (item.keywords.referenceKeywords.length > 0) {
    text += '■ 参考用キーワード（基礎情報・地域限定など）\n\n'
    text += item.keywords.referenceKeywords.map((k, i) => `${i + 1}. ${k.text}`).join('\n')
  }
  
  downloadFile(text, `keywords_${item.keyword}.txt`, 'text/plain')
  showToast('テキストファイルをダウンロードしました', 'success')
}

// CSVファイルとしてエクスポート
function exportToCSV(index) {
  const item = keywordCheckerState.generatedKeywords[index]
  let csv = 'No,カテゴリ,キーワード,SNSスコア\n'
  
  let no = 1
  item.keywords.snsKeywords.forEach(k => {
    csv += `${no},"SNS投稿ネタ","${k.text.replace(/"/g, '""')}",${k.score}\n`
    no++
  })
  
  item.keywords.referenceKeywords.forEach(k => {
    csv += `${no},"参考用","${k.text.replace(/"/g, '""')}",${k.score}\n`
    no++
  })
  
  downloadFile(csv, `keywords_${item.keyword}.csv`, 'text/csv')
  showToast('CSVファイルをダウンロードしました', 'success')
}

// downloadFile is now in utils.js

// escapeHtml is now in utils.js

// showToast is now in utils.js

// Toggle mobile menu (for hamburger menu)
function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
  }
}

// ページ読み込み時に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKeywordChecker)
} else {
  initKeywordChecker()
}
