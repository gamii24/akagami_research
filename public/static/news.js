/**
 * News Page - Completely independent JavaScript
 * This file is self-contained and does not depend on app.js
 */

let newsData = [];
let isAuthenticated = false;

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Open auth modal (minimal implementation)
function openAuthModal() {
  window.location.href = '/admin';
}

// Check authentication status
async function checkAuth() {
  try {
    const response = await axios.get('/api/user/me', { withCredentials: true });
    isAuthenticated = response.data.authenticated;
  } catch (error) {
    isAuthenticated = false;
  }
}

// Load news articles with likes
async function loadNews() {
  try {
    console.log('[NEWS] Loading news from API...');
    const response = await axios.get('/api/news-with-likes', { withCredentials: true });
    console.log('[NEWS] API response:', response.data.length, 'items');
    newsData = response.data;
    renderNews();
  } catch (error) {
    console.error('[NEWS] Failed to load news:', error);
    document.getElementById('news-list').innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
        <p class="text-gray-600">ニュースの読み込みに失敗しました</p>
      </div>
    `;
  }
}

// Toggle like
window.toggleLike = async function(newsId, index) {
  if (!isAuthenticated) {
    showToast('いいねするにはログインが必要です', 'error');
    openAuthModal();
    return;
  }

  try {
    const response = await axios.post(`/api/news/${newsId}/like`, {}, { withCredentials: true });
    
    // Update local data
    newsData[index].user_liked = response.data.liked ? 1 : 0;
    newsData[index].likes_count = response.data.liked 
      ? parseInt(newsData[index].likes_count) + 1 
      : parseInt(newsData[index].likes_count) - 1;
    
    // Re-render just this news item
    renderNews();
    
    showToast(response.data.liked ? 'いいねしました！' : 'いいねを取り消しました', 'success');
  } catch (error) {
    console.error('Failed to toggle like:', error);
    showToast('エラーが発生しました', 'error');
  }
};

// Render news list
function renderNews() {
  console.log('[NEWS] Rendering news...', newsData.length, 'items');
  const newsListEl = document.getElementById('news-list');
  
  if (!newsListEl) {
    console.error('[NEWS] news-list element not found!');
    return;
  }
  
  if (newsData.length === 0) {
    console.log('[NEWS] No news data to render');
    newsListEl.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-600">ニュース記事がありません</p>
      </div>
    `;
    return;
  }
  
  console.log('[NEWS] Generating HTML for', newsData.length, 'items');
  const htmlContent = newsData.map((news, index) => {
    const date = new Date(news.published_at);
    const dateStr = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
    const likesCount = parseInt(news.likes_count) || 0;
    const userLiked = news.user_liked === 1;
    const likeButtonClass = userLiked 
      ? 'text-red-500 hover:text-red-600' 
      : 'text-gray-400 hover:text-red-500';
    const likeIconClass = userLiked ? 'fas fa-heart' : 'far fa-heart';
    
    return `
      <article class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <!-- Mobile: Clickable card -->
        <div class="md:hidden p-6">
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                ${news.category}
              </span>
              <span class="text-sm text-gray-500">${dateStr}</span>
            </div>
            <button 
              onclick="event.stopPropagation(); toggleLike(${news.id}, ${index})"
              class="${likeButtonClass} transition-colors flex items-center gap-1"
              title="${userLiked ? 'いいねを取り消す' : 'いいね'}"
            >
              <i class="${likeIconClass}"></i>
              <span class="text-sm">${likesCount}</span>
            </button>
          </div>
          <div class="cursor-pointer" onclick="showNewsDetail(${index})">
            <h3 class="text-xl font-bold text-gray-800 mb-2">${escapeHtml(news.title)}</h3>
            <p class="text-gray-600 line-clamp-4">${escapeHtml(news.summary)}</p>
          </div>
        </div>
        
        <!-- Desktop: Accordion style -->
        <div class="hidden md:block p-6">
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                ${news.category}
              </span>
              <span class="text-sm text-gray-500">${dateStr}</span>
            </div>
            <button 
              onclick="toggleLike(${news.id}, ${index})"
              class="${likeButtonClass} transition-colors flex items-center gap-2 text-lg"
              title="${userLiked ? 'いいねを取り消す' : 'いいね'}"
            >
              <i class="${likeIconClass}"></i>
              <span class="text-sm">${likesCount}</span>
            </button>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">${escapeHtml(news.title)}</h3>
          
          <!-- Summary: 2 lines with read more -->
          <div class="mb-4">
            <p id="summary-${index}" class="text-gray-600 line-clamp-2">${escapeHtml(news.summary)}</p>
            <button 
              id="toggle-${index}" 
              onclick="toggleSummary(${index})"
              class="text-primary text-sm font-semibold mt-2 hover:underline flex items-center gap-1"
            >
              <span id="toggle-text-${index}">続きを読む</span>
              <i id="toggle-icon-${index}" class="fas fa-chevron-down text-xs"></i>
            </button>
          </div>
          
          <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            <i class="fas fa-external-link-alt"></i>
            元記事を読む（外部サイト）
          </a>
        </div>
      </article>
    `;
  }).join('');
  
  newsListEl.innerHTML = htmlContent;
  console.log('[NEWS] Render complete! HTML length:', htmlContent.length);
}

// Toggle summary expansion
window.toggleSummary = function(index) {
  const summaryEl = document.getElementById(`summary-${index}`);
  const toggleTextEl = document.getElementById(`toggle-text-${index}`);
  const toggleIconEl = document.getElementById(`toggle-icon-${index}`);
  
  if (summaryEl.classList.contains('line-clamp-2')) {
    summaryEl.classList.remove('line-clamp-2');
    toggleTextEl.textContent = '閉じる';
    toggleIconEl.classList.remove('fa-chevron-down');
    toggleIconEl.classList.add('fa-chevron-up');
  } else {
    summaryEl.classList.add('line-clamp-2');
    toggleTextEl.textContent = '続きを読む';
    toggleIconEl.classList.remove('fa-chevron-up');
    toggleIconEl.classList.add('fa-chevron-down');
  }
}

// Show news detail modal (for mobile)
window.showNewsDetail = function(index) {
  const news = newsData[index];
  const date = new Date(news.published_at);
  const dateStr = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  const likesCount = parseInt(news.likes_count) || 0;
  const userLiked = news.user_liked === 1;
  const likeButtonClass = userLiked 
    ? 'text-red-500 hover:text-red-600' 
    : 'text-gray-400 hover:text-red-500';
  const likeIconClass = userLiked ? 'fas fa-heart' : 'far fa-heart';
  
  const modalHtml = `
    <div id="news-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onclick="closeNewsModal()">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up" onclick="event.stopPropagation()">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
              ${news.category}
            </span>
            <button onclick="closeNewsModal()" class="text-gray-400 hover:text-gray-600 text-2xl">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-800 mb-2">${escapeHtml(news.title)}</h2>
          <p class="text-sm text-gray-500 mb-4">${dateStr}</p>
          
          <p class="text-gray-600 mb-6 leading-relaxed">${escapeHtml(news.summary)}</p>
          
          <div class="flex items-center justify-between">
            <a href="${news.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              <i class="fas fa-external-link-alt"></i>
              元記事を読む
            </a>
            
            <button 
              onclick="event.stopPropagation(); toggleLike(${news.id}, ${index}); updateModalLike(${index})"
              class="${likeButtonClass} transition-colors flex items-center gap-2 text-lg"
              id="modal-like-btn-${index}"
            >
              <i class="${likeIconClass}" id="modal-like-icon-${index}"></i>
              <span id="modal-like-count-${index}">${likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Close news modal
window.closeNewsModal = function() {
  const modal = document.getElementById('news-modal');
  if (modal) {
    modal.remove();
  }
}

// Update like button in modal
window.updateModalLike = function(index) {
  setTimeout(() => {
    const news = newsData[index];
    const likesCount = parseInt(news.likes_count) || 0;
    const userLiked = news.user_liked === 1;
    
    const modalLikeBtn = document.getElementById(`modal-like-btn-${index}`);
    const modalLikeIcon = document.getElementById(`modal-like-icon-${index}`);
    const modalLikeCount = document.getElementById(`modal-like-count-${index}`);
    
    if (modalLikeBtn && modalLikeIcon && modalLikeCount) {
      modalLikeBtn.className = userLiked 
        ? 'text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 text-lg' 
        : 'text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 text-lg';
      modalLikeIcon.className = userLiked ? 'fas fa-heart' : 'far fa-heart';
      modalLikeCount.textContent = likesCount;
    }
  }, 100);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[NEWS] Page loaded, initializing...');
  await checkAuth();
  await loadNews();
});
