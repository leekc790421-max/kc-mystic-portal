import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel({ isOpen, onClose }) {
  const { user, getAllUsers } = useAuth();
  const [tab, setTab] = useState('users');

  if (user?.role !== 'admin') return null;

  const users = getAllUsers();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div className="relative glass-strong p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

            <h3 className="font-[family-name:var(--font-display)] text-lg text-mystic-gold mb-6">管理後台</h3>

            <div className="flex gap-2 mb-6">
              {['users', 'orders', 'settings'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${tab === t ? 'bg-mystic-gold/20 text-mystic-gold border border-mystic-gold/40' : 'text-gray-400 border border-white/10 hover:border-white/20'}`}>
                  {t === 'users' ? '用戶管理' : t === 'orders' ? '訂單' : '設定'}
                </button>
              ))}
            </div>

            {tab === 'users' && (
              <div>
                <p className="text-sm text-gray-400 mb-3">共 {users.length} 位用戶</p>
                <div className="space-y-2">
                  {users.map((u, i) => (
                    <div key={i} className="glass p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-200">{u.username}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-mystic-violet/20 text-mystic-violet' : 'bg-white/5 text-gray-400'}`}>
                          {u.role}
                        </span>
                        {u.createdAt && (
                          <span className="text-xs text-gray-600">
                            {new Date(u.createdAt).toLocaleDateString('zh-TW')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div>
                <p className="text-sm text-gray-400 mb-3">訂單管理</p>
                <div className="glass p-4 text-center">
                  <p className="text-sm text-gray-500">暫無訂單資料</p>
                  <p className="text-xs text-gray-600 mt-1">串接金流後將顯示訂單記錄</p>
                </div>
              </div>
            )}

            {tab === 'settings' && (
              <div className="space-y-4">
                <div className="glass p-4">
                  <p className="text-sm text-gray-300 mb-2">商品定價</p>
                  <p className="text-lg text-mystic-gold">NT$1,888</p>
                </div>
                <div className="glass p-4">
                  <p className="text-sm text-gray-300 mb-2">收款帳戶</p>
                  <p className="text-xs text-gray-400">臺灣銀行松山分行 004-064004306448</p>
                  <p className="text-xs text-gray-400">樂天銀行 8120101535981</p>
                </div>
                <div className="glass p-4">
                  <p className="text-sm text-gray-300 mb-2">系統狀態</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-gray-400">系統運行正常</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
