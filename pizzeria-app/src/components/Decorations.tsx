import { motion } from 'framer-motion';

// Floating food decorations scattered around sections
export function FloatingDecorations() {
  const items = [
    { emoji: '🌶️', top: '10%', left: '3%', delay: 0, size: 'text-3xl' },
    { emoji: '🍅', top: '20%', right: '5%', delay: 0.5, size: 'text-2xl' },
    { emoji: '🧄', top: '45%', left: '2%', delay: 1, size: 'text-2xl' },
    { emoji: '🌿', top: '60%', right: '3%', delay: 1.5, size: 'text-3xl' },
    { emoji: '🧅', top: '75%', left: '4%', delay: 2, size: 'text-2xl' },
    { emoji: '🫑', top: '85%', right: '4%', delay: 0.8, size: 'text-2xl' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.size} opacity-40`}
          style={{ top: item.top, left: item.left, right: item.right }}
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// Marquee banner with scrolling text
export function MarqueeBanner() {
  const text = '🍕 CAVEMAN\'S PIZZERIA • BEST PIZZA IN SAINIKPURI • FRESH HANDMADE DOUGH • WOOD-FIRED OVEN • FREE DELIVERY • ';
  return (
    <div className="bg-[#E85D3A] py-3 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="text-white font-bold text-sm tracking-widest mx-4">{text}{text}</span>
      </div>
    </div>
  );
}
