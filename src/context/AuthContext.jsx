import { createContext, useContext, useState, useEffect } from 'react';
import { ORDER_STATUS, PAYMENT_CHANNELS } from '../utils/payment';
import { analyzeReceipt } from '../utils/gemini';

const AuthContext = createContext(null);
const ADMIN_USER = 'kclee1654';
const USERS_KEY = 'kc_mp_users';
const SESSION_KEY = 'kc_mp_session';
const PAID_KEY = 'kc_mp_paid';
const ORDERS_KEY = 'kc_mp_orders';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch { return {}; }
}

function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

function getOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch { return []; }
}

function saveOrders(orders) { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try { setUser(JSON.parse(session)); } catch {}
    }
    setIsPaid(localStorage.getItem(PAID_KEY) === 'true' || new URLSearchParams(window.location.search).get('paid') === 'true');
    if (new URLSearchParams(window.location.search).get('paid') === 'true') {
      localStorage.setItem(PAID_KEY, 'true');
    }
    setOrders(getOrders());
    setLoading(false);
  }, []);

  const register = (username, email, password) => {
    const users = getUsers();
    if (users[username]) return { success: false, error: '用戶名已存在' };
    // Check if email already registered (one account per email)
    if (Object.values(users).some(u => u.email === email)) {
      return { success: false, error: '此信箱已註冊' };
    }
    users[username] = { email, password: btoa(password), role: username === ADMIN_USER ? 'admin' : 'user', createdAt: Date.now() };
    saveUsers(users);
    const userData = { username, email, role: username === ADMIN_USER ? 'admin' : 'user' };
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    return { success: true };
  };

  const login = (username, password) => {
    const users = getUsers();
    const u = users[username];
    if (!u) return { success: false, error: '用戶不存在' };
    if (u.password !== btoa(password)) return { success: false, error: '密碼錯誤' };
    const userData = { username, email: u.email, role: u.role };
    setUser(userData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setOrders(getOrders());
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const resetPassword = (email, newPassword) => {
    const users = getUsers();
    const entry = Object.entries(users).find(([, v]) => v.email === email);
    if (!entry) return { success: false, error: '找不到此信箱' };
    entry[1].password = btoa(newPassword);
    saveUsers(users);
    return { success: true };
  };

  const getAllUsers = () => {
    if (user?.role !== 'admin') return [];
    return Object.entries(getUsers()).map(([name, data]) => ({
      username: name, email: data.email, role: data.role, createdAt: data.createdAt
    }));
  };

  const markPaid = () => { setIsPaid(true); localStorage.setItem(PAID_KEY, 'true'); };

  // Order management with Gemini AI review
  const createOrder = async (channel, amountTWD, amountUSD, receiptData) => {
    if (!user) return { success: false, error: '請先登入' };
    
    const order = {
      id: `ORD-${Date.now()}`,
      username: user.username,
      email: user.email,
      channel,
      amountTWD,
      amountUSD,
      receipt: receiptData, // base64 image
      status: ORDER_STATUS.AI_REVIEWING,
      createdAt: Date.now(),
      reviewedAt: null,
      reviewedBy: null,
      aiScore: null,
      aiNotes: null,
      aiDetails: null,
    };

    // Save order first with AI_REVIEWING status
    const allOrders = getOrders();
    allOrders.push(order);
    saveOrders(allOrders);
    setOrders([...allOrders]);

    // Call Gemini API for real AI review
    try {
      const channelInfo = PAYMENT_CHANNELS[channel];
      const aiReview = await analyzeReceipt(
        receiptData, 
        amountTWD, 
        amountUSD, 
        channelInfo?.name || channel
      );
      
      order.aiScore = aiReview.score;
      order.aiNotes = aiReview.notes;
      order.aiDetails = aiReview.details;
      order.status = aiReview.confident ? ORDER_STATUS.APPROVED : ORDER_STATUS.PENDING;

      // Update order in storage
      const updatedOrders = getOrders();
      const idx = updatedOrders.findIndex(o => o.id === order.id);
      if (idx !== -1) {
        updatedOrders[idx] = order;
        saveOrders(updatedOrders);
        setOrders(updatedOrders);
      }

      // If AI approved with high confidence, auto-unlock
      if (order.status === ORDER_STATUS.APPROVED) {
        markPaid();
      }

      return { success: true, orderId: order.id, status: order.status };
    } catch (error) {
      console.error('AI review failed:', error);
      // If AI fails, mark as pending for manual review
      order.status = ORDER_STATUS.PENDING;
      order.aiNotes = 'AI 審核失敗，轉為人工審核';
      
      const updatedOrders = getOrders();
      const idx = updatedOrders.findIndex(o => o.id === order.id);
      if (idx !== -1) {
        updatedOrders[idx] = order;
        saveOrders(updatedOrders);
        setOrders(updatedOrders);
      }

      return { success: true, orderId: order.id, status: ORDER_STATUS.PENDING };
    }
  };

  const getUserOrders = () => {
    if (!user) return [];
    return getOrders().filter(o => o.username === user.username).sort((a, b) => b.createdAt - a.createdAt);
  };

  const getAllOrders = () => {
    if (user?.role !== 'admin') return [];
    return getOrders().sort((a, b) => b.createdAt - a.createdAt);
  };

  const approveOrder = (orderId) => {
    if (user?.role !== 'admin') return { success: false, error: '無權限' };
    const allOrders = getOrders();
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return { success: false, error: '訂單不存在' };
    
    order.status = ORDER_STATUS.APPROVED;
    order.reviewedAt = Date.now();
    order.reviewedBy = user.username;
    saveOrders(allOrders);
    setOrders(allOrders);

    // Auto-unlock for this user
    if (order.username === user.username) {
      markPaid();
    }

    return { success: true };
  };

  const rejectOrder = (orderId, reason) => {
    if (user?.role !== 'admin') return { success: false, error: '無權限' };
    const allOrders = getOrders();
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return { success: false, error: '訂單不存在' };
    
    order.status = ORDER_STATUS.REJECTED;
    order.reviewedAt = Date.now();
    order.reviewedBy = user.username;
    order.rejectReason = reason;
    saveOrders(allOrders);
    setOrders(allOrders);

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ 
      user, isPaid, loading, orders,
      register, login, logout, resetPassword, getAllUsers, markPaid,
      createOrder, getUserOrders, getAllOrders, approveOrder, rejectOrder
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
