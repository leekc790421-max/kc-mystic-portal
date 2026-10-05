import { useState } from 'react';
import { FaLine, FaWhatsapp, FaFacebookF, FaCopy, FaCheck } from 'react-icons/fa';
import { SiX } from 'react-icons/si';

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const text = 'KC Mystic Portal | 西洋×馬雅雙系統命盤 - 上升摩羯16.61°的務實神秘學';

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { name: 'LINE', icon: FaLine, color: '#00C300', href: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}` },
    { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}` },
    { name: 'Facebook', icon: FaFacebookF, color: '#1877F2', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'X', icon: SiX, color: '#fff', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
  ];

  return (
    <footer className="relative border-t border-white/5 pt-12 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-mystic-gold text-lg mb-3">KC Mystic Portal</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              西洋占星 × 馬雅曆法雙系統命盤解讀。1979沙鹿子時，上升摩羯16.61°的務實神秘學。
            </p>
          </div>

          <div>
            <h4 className="text-sm text-gray-300 mb-3">快速連結</h4>
            <div className="space-y-2">
              <a href="#hero" className="block text-sm text-gray-400 hover:text-mystic-gold transition-colors">水晶球命盤</a>
              <a href="#cards" className="block text-sm text-gray-400 hover:text-mystic-gold transition-colors">靈魂卡牌</a>
              <a href="#mayan" className="block text-sm text-gray-400 hover:text-mystic-gold transition-colors">馬雅波符</a>
              <a href="#faq" className="block text-sm text-gray-400 hover:text-mystic-gold transition-colors">常見問題</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-gray-300 mb-3">分享此網站</h4>
            <div className="flex gap-2 mb-4">
              {shareLinks.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: `${s.color}20`, color: s.color }}>
                  <s.icon size={16} />
                </a>
              ))}
              <button onClick={handleCopy}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 text-gray-400 hover:text-mystic-gold transition-all hover:scale-110">
                {copied ? <FaCheck size={14} /> : <FaCopy size={14} />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              聯絡信箱：kc.mystic.portal@gmail.com
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2026 KC Mystic Portal. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#hero" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">隱私政策</a>
            <a href="#hero" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">服務條款</a>
            <a href="#faq" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">退款政策</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
