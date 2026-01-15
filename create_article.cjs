const fs = require('fs');

// Read HTML content
const htmlContent = fs.readFileSync('us_threads_article_body.html', 'utf-8');

// Create article payload
const articleData = {
  title: 'Threadsのアメリカ企業運用事例',
  slug: 'threads-us-case-study-2026',
  category_id: 9,
  content: htmlContent,
  summary: 'アメリカで先行するThreadsの企業運用事例を分析。「映え」より「会話」が主役、スピード感が信頼を生む運用サイクルを解説。',
  published: true,
  sort_order: 0
};

console.log(JSON.stringify(articleData));
