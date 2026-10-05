import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';

const NAV_ITEMS = [
  { label: '水晶球', href: '#hero' },
  { label: '靈魂卡牌', href: '#cards' },
  { label: '馬雅波符', href: '#mayan' },
  { label: '占卜', href: '#divination' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar({ onAuthClick, onAdminClick }) {
  const { user, logout, isPaid } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong" style={{ borderRadius: 0 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#hero" className="font-[family-name:var(--font-display)] text-mystic-gold text-lg tracking-wider">
            KC Mystic Portal
          </a>

          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(item => (
              <a key={item.href} href={item.href}
                className="text-sm text-gray-300 hover:text-mystic-gold transition-colors duration-300">
                {item.label}
              </a>
            ))}
            {user?.role === 'admin' && (
              <button onClick={onAdminClick} className="text-sm text-mystic-violet hover:text-mystic-gold transition-colors">
                管理
              </button>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                {isPaid && <span className="text-xs text-mystic-gold bg-mystic-gold/10 px-2 py-0.5 rounded-full">已解鎖</span>}
                <span className="text-sm text-gray-400">{user.username}</span>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-mystic-pink transition-colors">登出</button>
              </div>
            ) : (
              <button onClick={onAuthClick}
                className="text-sm px-4 py-1.5 rounded-full border border-mystic-gold/40 text-mystic-gold hover:bg-mystic-gold/10 transition-all">
                登入
              </button>
            )}
          </div>

          <button className="md:hidden text-mystic-gold" onClick={() => setOpen(!open)}>
            {open ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass-strong border-t border-white/5 px-4 pb-4">
          {NAV_ITEMS.map(item => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}
              className="block py-2 text-gray-300 hover:text-mystic-gold transition-colors">
              {item.label}
            </a>
          ))}
          {user?.role === 'admin' && (
            <button onClick={() => { onAdminClick(); setOpen(false); }} className="block py-2 text-mystic-violet">管理後台</button>
          )}
          <div className="pt-2 border-t border-white/5">
            {user ? (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-400">{user.username}</span>
                <button onClick={logout} className="text-sm text-mystic-pink">登出</button>
              </div>
            ) : (
              <button onClick={() => { onAuthClick(); setOpen(false); }}
                className="w-full text-center py-2 text-mystic-gold border border-mystic-gold/40 rounded-full">
                登入 / 註冊
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
