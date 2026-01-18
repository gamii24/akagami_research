/**
 * Users Admin Page - Manage registered users
 */

// State management
const usersState = {
  users: [],
  filteredUsers: [],
  searchQuery: '',
  sortBy: 'id', // id, name, email, birthday, location, created_at
  sortOrder: 'asc',
  birthdayMonth: '', // 1-12 or empty for all
  birthdayDay: '' // 1-31 or empty for all
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initUsersAdmin();
});

async function initUsersAdmin() {
  await loadUsers();
  renderUsersPage();
}

// Load users from API
async function loadUsers() {
  try {
    const response = await axios.get('/api/admin/users', {
      withCredentials: true
    });
    
    usersState.users = response.data.data || [];
    usersState.filteredUsers = [...usersState.users];
    console.log('Loaded users:', usersState.users.length);
  } catch (error) {
    console.error('Failed to load users:', error);
    if (error.response && error.response.status === 401) {
      showToast('ログインが必要です。ログインページにリダイレクトします...', 'error');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);
    } else {
      showToast('ユーザーの読み込みに失敗しました', 'error');
      usersState.users = [];
      usersState.filteredUsers = [];
    }
  }
}

// Render users page
function renderUsersPage() {
  const app = document.getElementById('users-admin-app');
  
  app.innerHTML = `
    <div class="min-h-screen" style="background-color: #1a1a1a;">
      <!-- Header -->
      <div class="border-b" style="background-color: #2d2d2d; border-color: #404040;">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button 
                onclick="window.location.href='/admin'" 
                class="text-gray-400 hover:text-white transition-colors"
                aria-label="管理画面に戻る"
              >
                <i class="fas fa-arrow-left text-xl"></i>
              </button>
              <h1 class="text-2xl font-bold text-white">
                <i class="fas fa-users mr-2" style="color: #e75556;"></i>
                登録者一覧
              </h1>
            </div>
            <div class="text-gray-400 text-sm">
              総登録者数: <span class="text-white font-semibold">${usersState.filteredUsers.length}</span>名
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Search and Sort Controls -->
        <div class="mb-6 flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <input
                type="text"
                id="search-input"
                placeholder="名前、メール、居住地で検索..."
                value="${usersState.searchQuery}"
                oninput="handleSearch(event)"
                class="w-full px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2"
                style="background-color: #2d2d2d; border-color: #404040; color: #ffffff;"
              />
              <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
          
          <!-- Sort Controls -->
          <div class="flex gap-2">
            <select
              id="sort-by"
              onchange="handleSortChange()"
              class="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style="background-color: #2d2d2d; border-color: #404040; color: #ffffff;"
            >
              <option value="id" ${usersState.sortBy === 'id' ? 'selected' : ''}>会員番号</option>
              <option value="name" ${usersState.sortBy === 'name' ? 'selected' : ''}>名前</option>
              <option value="email" ${usersState.sortBy === 'email' ? 'selected' : ''}>メール</option>
              <option value="birthday" ${usersState.sortBy === 'birthday' ? 'selected' : ''}>誕生日</option>
              <option value="location" ${usersState.sortBy === 'location' ? 'selected' : ''}>居住地</option>
              <option value="created_at" ${usersState.sortBy === 'created_at' ? 'selected' : ''}>登録日</option>
            </select>
            
            <button
              onclick="toggleSortOrder()"
              class="px-4 py-2 rounded-lg border hover:bg-gray-700 transition-colors"
              style="background-color: #2d2d2d; border-color: #404040; color: #ffffff;"
              aria-label="並び順を変更"
            >
              <i class="fas fa-sort-${usersState.sortOrder === 'asc' ? 'up' : 'down'}"></i>
            </button>
          </div>
        </div>

        <!-- Birthday Filter -->
        <div class="mb-6 p-4 rounded-lg border" style="background-color: #2d2d2d; border-color: #404040;">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <i class="fas fa-birthday-cake text-primary"></i>
              <h3 class="text-white font-semibold">誕生日で絞り込み</h3>
            </div>
            ${(usersState.birthdayMonth || usersState.birthdayDay) ? `
              <button
                onclick="clearBirthdayFilter()"
                class="px-3 py-1 text-sm rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
              >
                <i class="fas fa-times mr-1"></i>クリア
              </button>
            ` : ''}
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Month Filter -->
            <div class="flex-1">
              <label class="block text-sm text-gray-400 mb-1">月で絞り込み</label>
              <select
                id="birthday-month"
                onchange="handleBirthdayMonthChange()"
                class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style="background-color: #333333; border-color: #404040; color: #ffffff;"
              >
                <option value="">すべての月</option>
                <option value="1" ${usersState.birthdayMonth === '1' ? 'selected' : ''}>1月</option>
                <option value="2" ${usersState.birthdayMonth === '2' ? 'selected' : ''}>2月</option>
                <option value="3" ${usersState.birthdayMonth === '3' ? 'selected' : ''}>3月</option>
                <option value="4" ${usersState.birthdayMonth === '4' ? 'selected' : ''}>4月</option>
                <option value="5" ${usersState.birthdayMonth === '5' ? 'selected' : ''}>5月</option>
                <option value="6" ${usersState.birthdayMonth === '6' ? 'selected' : ''}>6月</option>
                <option value="7" ${usersState.birthdayMonth === '7' ? 'selected' : ''}>7月</option>
                <option value="8" ${usersState.birthdayMonth === '8' ? 'selected' : ''}>8月</option>
                <option value="9" ${usersState.birthdayMonth === '9' ? 'selected' : ''}>9月</option>
                <option value="10" ${usersState.birthdayMonth === '10' ? 'selected' : ''}>10月</option>
                <option value="11" ${usersState.birthdayMonth === '11' ? 'selected' : ''}>11月</option>
                <option value="12" ${usersState.birthdayMonth === '12' ? 'selected' : ''}>12月</option>
              </select>
            </div>
            
            <!-- Day Filter -->
            <div class="flex-1">
              <label class="block text-sm text-gray-400 mb-1">日で絞り込み</label>
              <select
                id="birthday-day"
                onchange="handleBirthdayDayChange()"
                class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style="background-color: #333333; border-color: #404040; color: #ffffff;"
              >
                <option value="">すべての日</option>
                ${Array.from({ length: 31 }, (_, i) => i + 1).map(day => 
                  `<option value="${day}" ${usersState.birthdayDay === String(day) ? 'selected' : ''}>${day}日</option>`
                ).join('')}
              </select>
            </div>

            <!-- Birthday Stats -->
            <div class="flex items-end">
              <div class="px-4 py-2 rounded-lg text-sm" style="background-color: #333333;">
                <div class="text-gray-400">該当者</div>
                <div class="text-white font-bold text-lg">${usersState.filteredUsers.length}名</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="overflow-x-auto rounded-lg border" style="background-color: #2d2d2d; border-color: #404040;">
          <table class="min-w-full divide-y" style="border-color: #404040;">
            <thead style="background-color: #333333;">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  会員番号
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  名前
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  メールアドレス
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  誕生日
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  居住地
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  登録日
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  認証状態
                </th>
              </tr>
            </thead>
            <tbody class="divide-y" style="background-color: #2d2d2d; border-color: #404040;">
              ${renderUserRows()}
            </tbody>
          </table>
        </div>

        ${usersState.filteredUsers.length === 0 ? `
          <div class="text-center py-12 text-gray-400">
            <i class="fas fa-users text-5xl mb-4 opacity-50"></i>
            <p>表示できる登録者がいません</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Render user rows
function renderUserRows() {
  if (usersState.filteredUsers.length === 0) {
    return '';
  }

  return usersState.filteredUsers.map(user => {
    const birthday = user.birthday ? formatDate(user.birthday) : '<span class="text-gray-500">未設定</span>';
    const location = user.location ? escapeHtml(user.location) : '<span class="text-gray-500">未設定</span>';
    const name = user.name ? escapeHtml(user.name) : '<span class="text-gray-500">未設定</span>';
    const createdAt = formatDate(user.created_at);
    const emailVerified = user.email_verified ? 
      '<span class="text-green-400"><i class="fas fa-check-circle"></i> 認証済み</span>' : 
      '<span class="text-gray-500"><i class="fas fa-times-circle"></i> 未認証</span>';

    return `
      <tr class="hover:bg-gray-700 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
          ${user.id}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          ${name}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          ${escapeHtml(user.email)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          ${birthday}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          ${location}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
          ${createdAt}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          ${emailVerified}
        </td>
      </tr>
    `;
  }).join('');
}

// Handle search
function handleSearch(event) {
  usersState.searchQuery = event.target.value.toLowerCase();
  filterAndSortUsers();
  renderUsersPage();
}

// Handle sort change
function handleSortChange() {
  const select = document.getElementById('sort-by');
  usersState.sortBy = select.value;
  filterAndSortUsers();
  renderUsersPage();
}

// Toggle sort order
function toggleSortOrder() {
  usersState.sortOrder = usersState.sortOrder === 'asc' ? 'desc' : 'asc';
  filterAndSortUsers();
  renderUsersPage();
}

// Handle birthday month change
function handleBirthdayMonthChange() {
  const select = document.getElementById('birthday-month');
  usersState.birthdayMonth = select.value;
  filterAndSortUsers();
  renderUsersPage();
}

// Handle birthday day change
function handleBirthdayDayChange() {
  const select = document.getElementById('birthday-day');
  usersState.birthdayDay = select.value;
  filterAndSortUsers();
  renderUsersPage();
}

// Clear birthday filter
function clearBirthdayFilter() {
  usersState.birthdayMonth = '';
  usersState.birthdayDay = '';
  filterAndSortUsers();
  renderUsersPage();
}

// Filter and sort users
function filterAndSortUsers() {
  // Start with all users
  usersState.filteredUsers = [...usersState.users];
  
  // Filter by search query
  if (usersState.searchQuery) {
    usersState.filteredUsers = usersState.filteredUsers.filter(user => {
      const name = (user.name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const location = (user.location || '').toLowerCase();
      const query = usersState.searchQuery;
      
      return name.includes(query) || 
             email.includes(query) || 
             location.includes(query);
    });
  }
  
  // Filter by birthday month and day
  if (usersState.birthdayMonth || usersState.birthdayDay) {
    usersState.filteredUsers = usersState.filteredUsers.filter(user => {
      if (!user.birthday) return false;
      
      const birthday = new Date(user.birthday);
      const month = birthday.getMonth() + 1; // JavaScript months are 0-indexed
      const day = birthday.getDate();
      
      // Check month filter
      if (usersState.birthdayMonth) {
        if (month !== parseInt(usersState.birthdayMonth)) {
          return false;
        }
      }
      
      // Check day filter
      if (usersState.birthdayDay) {
        if (day !== parseInt(usersState.birthdayDay)) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  // Sort
  usersState.filteredUsers.sort((a, b) => {
    let aVal = a[usersState.sortBy] || '';
    let bVal = b[usersState.sortBy] || '';
    
    // Handle numbers (id)
    if (usersState.sortBy === 'id') {
      aVal = parseInt(aVal) || 0;
      bVal = parseInt(bVal) || 0;
    }
    
    // Compare
    if (aVal < bVal) return usersState.sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return usersState.sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

// Format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Escape HTML
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
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
