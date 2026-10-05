import { useState } from 'react';
import { motion } from 'framer-motion';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      const leads = JSON.parse(localStorage.getItem('kc_mp_leads') || '[]');
      leads.push({ email, date: Date.now() });
      localStorage.setItem('kc_mp_leads', JSON.stringify(leads));
      setSubmitted(true);
    }
  };

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="glass-strong p-6 sm:p-10 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 opacity-20" style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(123,47,247,0.3), transparent 70%)',
          }} />

          <div className="relative z-10">
            <span className="text-4xl block mb-4">🌟</span>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-mystic-gold mb-2">
              免費領取你的星際指南
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              輸入信箱，立即收到「上升摩羯生存指南」電子版，以及最新占星與馬雅能量預報。
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm focus:border-mystic-gold/50 focus:outline-none placeholder:text-gray-600"
                  required
                />
                <button type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-mystic-violet to-mystic-pink text-white text-sm font-bold hover:shadow-lg hover:shadow-mystic-violet/20 transition-all whitespace-nowrap">
                  免費領取
                </button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <p className="text-mystic-gold">✦ 已發送！請查收你的信箱 ✦</p>
              </motion.div>
            )}

            <p className="text-xs text-gray-600 mt-4">不發垃圾郵件，隨時退訂</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
