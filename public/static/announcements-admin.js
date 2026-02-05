// Announcements Admin JavaScript

let announcements = [];
let editingId = null;

// Load announcements
async function loadAnnouncements() {
  try {
    const response = await fetch('/api/announcements');
    const data = await response.json();
    
    if (data.success) {
      announcements = data.announcements;
      renderAnnouncements();
    }
  } catch (error) {
    console.error('お知らせの読み込みに失敗しました:', error);
    alert('お知らせの読み込みに失敗しました');
  }
}

// Render announcements list
function renderAnnouncements() {
  const container = document.getElementById('announcements-list');
  
  if (announcements.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-inbox text-5xl mb-4" style="color: #6b7280;"></i>
        <p style="color: #9ca3af;">お知らせがありません</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = announcements.map(announcement => `
    <div class="announcement-card" style="background-color: #2d2d2d; border: 1px solid #404040; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <h3 style="color: #f3f4f6; font-size: 18px; font-weight: 600; margin: 0;">${escapeHtml(announcement.title)}</h3>
            ${announcement.is_published 
              ? '<span style="background-color: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">公開中</span>'
              : '<span style="background-color: #6b7280; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">非公開</span>'
            }
          </div>
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            ${new Date(announcement.announcement_date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="editAnnouncement(${announcement.id})" 
                  style="background-color: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            <i class="fas fa-edit"></i> 編集
          </button>
          <button onclick="deleteAnnouncement(${announcement.id})" 
                  style="background-color: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            <i class="fas fa-trash"></i> 削除
          </button>
        </div>
      </div>
      <p style="color: #d1d5db; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(announcement.content)}</p>
    </div>
  `).join('');
}

// Show add modal
function showAddModal() {
  editingId = null;
  document.getElementById('modal-title').textContent = '新しいお知らせを追加';
  document.getElementById('announcement-title').value = '';
  document.getElementById('announcement-content').value = '';
  document.getElementById('announcement-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('announcement-published').checked = true;
  document.getElementById('announcement-modal').classList.remove('hidden');
  document.getElementById('announcement-modal').classList.add('flex');
  
  // Attach uploadImage event listener when modal opens
  setTimeout(() => {
    const uploadBtn = document.getElementById('upload-image-btn');
    if (uploadBtn) {
      // Remove any existing listener first
      const newBtn = uploadBtn.cloneNode(true);
      uploadBtn.parentNode.replaceChild(newBtn, uploadBtn);
      // Add new listener
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        uploadImage();
      });
      console.log('Upload button listener attached');
    }
  }, 100);
}

// Edit announcement
function editAnnouncement(id) {
  const announcement = announcements.find(a => a.id === id);
  if (!announcement) return;
  
  editingId = id;
  document.getElementById('modal-title').textContent = 'お知らせを編集';
  document.getElementById('announcement-title').value = announcement.title;
  document.getElementById('announcement-content').value = announcement.content;
  document.getElementById('announcement-date').value = announcement.announcement_date;
  document.getElementById('announcement-published').checked = announcement.is_published === 1;
  document.getElementById('announcement-modal').classList.remove('hidden');
  document.getElementById('announcement-modal').classList.add('flex');
  
  // Attach uploadImage event listener when modal opens
  setTimeout(() => {
    const uploadBtn = document.getElementById('upload-image-btn');
    if (uploadBtn) {
      // Remove any existing listener first
      const newBtn = uploadBtn.cloneNode(true);
      uploadBtn.parentNode.replaceChild(newBtn, uploadBtn);
      // Add new listener
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        uploadImage();
      });
      console.log('Upload button listener attached (edit mode)');
    }
  }, 100);
}

// Close modal
function closeModal() {
  document.getElementById('announcement-modal').classList.add('hidden');
  document.getElementById('announcement-modal').classList.remove('flex');
  editingId = null;
}

// Save announcement
async function saveAnnouncement() {
  const title = document.getElementById('announcement-title').value.trim();
  const content = document.getElementById('announcement-content').value.trim();
  const announcement_date = document.getElementById('announcement-date').value;
  const is_published = document.getElementById('announcement-published').checked;
  
  if (!title || !content || !announcement_date) {
    alert('すべての項目を入力してください');
    return;
  }
  
  try {
    const url = editingId ? `/api/announcements/${editingId}` : '/api/announcements';
    const method = editingId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        content,
        announcement_date,
        is_published
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      closeModal();
      await loadAnnouncements();
      alert(editingId ? 'お知らせを更新しました' : 'お知らせを追加しました');
    } else {
      alert('エラー: ' + (data.error || '保存に失敗しました'));
    }
  } catch (error) {
    console.error('保存エラー:', error);
    alert('保存に失敗しました');
  }
}

// Delete announcement
async function deleteAnnouncement(id) {
  if (!confirm('このお知らせを削除してもよろしいですか？')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/announcements/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      await loadAnnouncements();
      alert('お知らせを削除しました');
    } else {
      alert('削除に失敗しました');
    }
  } catch (error) {
    console.error('削除エラー:', error);
    alert('削除に失敗しました');
  }
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Upload image
async function uploadImage() {
  console.log('uploadImage function called');
  
  const fileInput = document.getElementById('image-upload-input');
  const file = fileInput.files[0];
  
  console.log('File input:', fileInput);
  console.log('Selected file:', file);
  
  if (!file) {
    alert('画像ファイルを選択してください');
    return;
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    alert('JPG, PNG, GIF, WebP, SVG形式のファイルのみアップロード可能です');
    return;
  }
  
  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('ファイルサイズは5MB以下にしてください');
    return;
  }
  
  try {
    // Show loading state
    const uploadBtn = document.getElementById('upload-image-btn');
    const originalText = uploadBtn.innerHTML;
    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> アップロード中...';
    uploadBtn.disabled = true;
    
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/announcements/upload-image', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Insert image URL into content textarea
      const contentTextarea = document.getElementById('announcement-content');
      const currentContent = contentTextarea.value;
      const imageUrl = data.url;
      
      // Add image URL with line breaks
      contentTextarea.value = currentContent + (currentContent ? '\n\n' : '') + imageUrl;
      
      // Clear file input
      fileInput.value = '';
      
      alert('画像をアップロードしました！URLが内容欄に追加されました。');
    } else {
      alert('アップロード失敗: ' + (data.error || '不明なエラー'));
    }
    
    // Restore button state
    uploadBtn.innerHTML = originalText;
    uploadBtn.disabled = false;
  } catch (error) {
    console.error('アップロードエラー:', error);
    alert('画像のアップロードに失敗しました');
    
    // Restore button state
    const uploadBtn = document.getElementById('upload-image-btn');
    uploadBtn.innerHTML = '<i class="fas fa-upload"></i> アップロード';
    uploadBtn.disabled = false;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadAnnouncements();
  
  // Expose functions to global scope for onclick handlers
  window.showAddModal = showAddModal;
  window.editAnnouncement = editAnnouncement;
  window.closeModal = closeModal;
  window.saveAnnouncement = saveAnnouncement;
  window.deleteAnnouncement = deleteAnnouncement;
  window.uploadImage = uploadImage;
});
