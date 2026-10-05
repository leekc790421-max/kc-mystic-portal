import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const ADMIN_USER = 'kclee1654';
const USERS_KEY = 'kc_mp_users';
const SESSION_KEY = 'kc_mp_session';
const PAID_KEY = 'kc_mp_paid';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch { return {}; }
}

function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try { setUser(JSON.parse(session)); } catch {}
    }
    setIsPaid(localStorage.getItem(PAID_KEY) === 'true' || new URLSearchParams(window.location.search).get('paid') === 'true');
    if (new URLSearchParams(window.location.search).get('paid') === 'true') {
      localStorage.setItem(PAID_KEY, 'true');
    }
    setLoading(false);
  }, []);

  const register = (username, email, password) => {
    const users = getUsers();
    if (users[username]) return { success: false, error: '用戶名已存在' };
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

  return (
    <AuthContext.Provider value={{ user, isPaid, loading, register, login, logout, resetPassword, getAllUsers, markPaid }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
