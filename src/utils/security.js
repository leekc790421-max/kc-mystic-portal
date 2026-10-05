// Security utilities for rate limiting and abuse prevention

const RATE_LIMIT_KEY = 'kc_mp_rate_limit';
const MAX_REQUESTS = 5;
const WINDOW_MS = 60000; // 1 minute

export function checkRateLimit(action = 'default') {
  const now = Date.now();
  const key = `${RATE_LIMIT_KEY}_${action}`;
  
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const recent = data.filter(ts => now - ts < WINDOW_MS);
    
    if (recent.length >= MAX_REQUESTS) {
      return { allowed: false, retryAfter: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000) };
    }
    
    recent.push(now);
    localStorage.setItem(key, JSON.stringify(recent));
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function resetRateLimit(action = 'default') {
  const key = `${RATE_LIMIT_KEY}_${action}`;
  localStorage.removeItem(key);
}

// Validate file upload
export function validateReceipt(file) {
  if (!file) return { valid: false, error: '請選擇檔案' };
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: '僅支援 JPG、PNG 格式' };
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: '檔案大小不能超過 5MB' };
  }
  
  return { valid: true };
}

// Sanitize user input
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Generate unique order ID
export function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Check if user is banned (for future use)
export function isUserBanned(username) {
  const banned = JSON.parse(localStorage.getItem('kc_mp_banned') || '[]');
  return banned.includes(username);
}

// Ban user (admin function)
export function banUser(username) {
  const banned = JSON.parse(localStorage.getItem('kc_mp_banned') || '[]');
  if (!banned.includes(username)) {
    banned.push(username);
    localStorage.setItem('kc_mp_banned', JSON.stringify(banned));
  }
}

// Unban user (admin function)
export function unbanUser(username) {
  const banned = JSON.parse(localStorage.getItem('kc_mp_banned') || '[]');
  const index = banned.indexOf(username);
  if (index > -1) {
    banned.splice(index, 1);
    localStorage.setItem('kc_mp_banned', JSON.stringify(banned));
  }
}
