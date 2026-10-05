import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { register, login, resetPassword } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const res = login(form.username, form.password);
      if (res.success) { onClose(); setForm({ username: '', email: '', password: '', confirm: '' }); }
      else setError(res.error);
    } else if (mode === 'register') {
      if (form.password !== form.confirm) { setError('密碼不一致'); return; }
      if (form.password.length < 6) { setError('密碼至少6個字元'); return; }
      const res = register(form.username, form.email, form.password);
      if (res.success) { onClose(); setForm({ username: '', email: '', password: '', confirm: '' }); }
      else setError(res.error);
    } else if (mode === 'reset') {
      if (!form.email) { setError('請輸入信箱'); return; }
      if (form.password.length < 6) { setError('密碼至少6個字元'); return; }
      const res = resetPassword(form.email, form.password);
      if (res.success) { setSuccess('密碼已重設，請重新登入'); setMode('login'); }
      else setError(res.error);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-mystic-gold/50 focus:outline-none transition-colors placeholder:text-gray-600";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div className="relative glass-strong p-6 sm:p-8 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

            <h3 className="font-[family-name:var(--font-display)] text-lg text-mystic-gold mb-6">
              {mode === 'login' ? '登入' : mode === 'register' ? '註冊' : '重設密碼'}
            </h3>

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            {success && <p className="text-green-400 text-sm mb-3">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode !== 'reset' && (
                <input type="text" placeholder="用戶名" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })} className={inputClass} required />
              )}
              {(mode === 'register' || mode === 'reset') && (
                <input type="email" placeholder="電子信箱" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} required />
              )}
              {mode !== 'reset' && (
                <input type="password" placeholder="密碼" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} className={inputClass} required />
              )}
              {mode === 'register' && (
                <input type="password" placeholder="確認密碼" value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })} className={inputClass} required />
              )}
              {mode === 'reset' && (
                <input type="password" placeholder="新密碼" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} className={inputClass} required />
              )}

              <button type="submit"
                className="w-full py-2 rounded-full bg-gradient-to-r from-mystic-gold to-mystic-gold-light text-mystic-bg font-bold text-sm hover:shadow-lg hover:shadow-mystic-gold/20 transition-all">
                {mode === 'login' ? '登入' : mode === 'register' ? '註冊' : '重設密碼'}
              </button>
            </form>

            <div className="mt-4 flex flex-col gap-2">
              {mode === 'login' && (
                <>
                  <button onClick={() => { setMode('register'); setError(''); }}
                    className="text-sm text-gray-400 hover:text-mystic-gold transition-colors">
                    還沒有帳號？註冊
                  </button>
                  <button onClick={() => { setMode('reset'); setError(''); }}
                    className="text-sm text-gray-400 hover:text-mystic-gold transition-colors">
                    忘記密碼？
                  </button>
                </>
              )}
              {mode === 'register' && (
                <button onClick={() => { setMode('login'); setError(''); }}
                  className="text-sm text-gray-400 hover:text-mystic-gold transition-colors">
                  已有帳號？登入
                </button>
              )}
              {mode === 'reset' && (
                <button onClick={() => { setMode('login'); setError(''); }}
                  className="text-sm text-gray-400 hover:text-mystic-gold transition-colors">
                  返回登入
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
