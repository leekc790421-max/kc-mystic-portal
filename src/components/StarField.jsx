import { useMemo } from 'react';

export default function StarField({ count = 100 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      dur: Math.random() * 4 + 2,
      del: Math.random() * 5,
      opacity: Math.random() * 0.7 + 0.3,
    })), [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full twinkle-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.size > 2 ? '#f0d060' : '#fff',
            '--dur': `${s.dur}s`,
            '--del': `${s.del}s`,
            opacity: s.opacity,
            boxShadow: s.size > 2 ? '0 0 6px rgba(240,208,96,0.5)' : 'none',
          }}
        />
      ))}
      <div className="absolute inset-0 nebula-bg" style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(123,47,247,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(79,195,247,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(212,175,55,0.04) 0%, transparent 50%)',
      }} />
    </div>
  );
}
