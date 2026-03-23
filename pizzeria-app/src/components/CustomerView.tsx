import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Clock, ShoppingBag } from 'lucide-react';
import type { MenuItem, Category } from '../types';

// Animated section wrapper
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
}

export function CustomerView({ menu, addToCart }: { menu: MenuItem[]; addToCart: (item: MenuItem) => void }) {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L'>('M');
  const filteredMenu = activeCategory === 'All' ? menu : menu.filter(item => item.category === activeCategory);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden doodle-bg">
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#E85D3A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#F4A340]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
              <motion.span initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="inline-block bg-[#E85D3A]/10 text-[#E85D3A] px-5 py-2 rounded-full text-sm font-bold mb-6">
                🔥 Now Open in Sainikpuri
              </motion.span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#2D2016] mb-6 leading-[1.1]">
                Best Pizza<br/>
                in <span className="text-[#E85D3A] relative inline-block">
                  Sainikpuri
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none"><path d="M2 8c40-6 80-6 196 0" stroke="#E85D3A" strokeWidth="3" strokeLinecap="round" opacity="0.4"/></svg>
                </span>
              </h1>
              <p className="text-lg text-[#8B7355] mb-8 max-w-lg leading-relaxed">
                Hand-tossed dough, premium ingredients, and a wood-fired passion. Experience the taste of authenticity with every single bite.
              </p>

              {/* Size selector */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[#2D2016] font-bold">Choose Size:</span>
                {(['S', 'M', 'L'] as const).map(size => (
                  <motion.button key={size} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full font-extrabold text-lg transition-all duration-300 ${selectedSize === size ? 'bg-[#E85D3A] text-white shadow-lg shadow-[#E85D3A]/30 scale-110' : 'bg-white text-[#2D2016] border-2 border-[#E85D3A]/20 hover:border-[#E85D3A]'}`}>
                    {size}
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#E85D3A] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#E85D3A]/30 hover:bg-[#D04E2E] transition-colors flex items-center gap-2">
                  Order Now <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-[#E85D3A] text-[#E85D3A] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#E85D3A]/5 transition-colors">
                  View Menu
                </motion.button>
              </div>
            </motion.div>

            {/* Right - Pizza image */}
            <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#E85D3A]/5 rounded-full blur-3xl scale-75" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="relative drop-shadow-2xl">
                <img src="https://pngimg.com/d/pizza_PNG44077.png" alt="Tasty Veggie Pizza" className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] object-contain scale-110" />
              </motion.div>
              {/* Floating labels */}
              {[
                { label: '🧀 Mozzarella', top: '-5%', left: '5%', delay: 0.5 },
                { label: '🍅 Tomato', top: '10%', right: '-5%', delay: 0.8 },
                { label: '🌿 Basil', bottom: '15%', left: '-10%', delay: 1.1 },
                { label: '🫒 Olives', bottom: '-5%', right: '5%', delay: 1.4 },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: item.delay, type: 'spring' }}
                  className="absolute bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg text-xs md:text-sm font-bold text-[#2D2016] border border-[#E85D3A]/10 whitespace-nowrap z-20"
                  style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}>
                  {item.label}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== DELIVERY TRACKING ===== */}
      <AnimatedSection>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-2xl md:text-3xl font-extrabold text-[#2D2016] mb-3">Track Your Order</h2>
            <p className="text-center text-[#8B7355] mb-12">Real-time delivery tracking for your peace of mind</p>
            <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto relative">
              {/* Horizontal line (desktop) */}
              <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-1 bg-[#E85D3A]/10 rounded-full z-0">
                <motion.div initial={{ width: 0 }} whileInView={{ width: '66%' }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.5 }} className="h-full bg-[#E85D3A] rounded-full" />
              </div>
              
              {/* Vertical line (mobile) */}
              <div className="md:hidden absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-[#E85D3A]/10 rounded-full z-0">
                <motion.div initial={{ height: 0 }} whileInView={{ height: '66%' }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.5 }} className="w-full bg-[#E85D3A] rounded-full" />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between w-full h-[400px] md:h-auto pb-4 md:pb-0 relative z-10">
                {[
                  { icon: '🛒', label: 'Order Placed', active: true },
                  { icon: '👨‍🍳', label: 'Preparing', active: true },
                  { icon: '🛵', label: 'On the Way', active: true },
                  { icon: '📍', label: 'Delivered', active: false },
                ].map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                    className="flex flex-col items-center z-10">
                    <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl mb-2 transition-all ${step.active ? 'bg-[#E85D3A] shadow-lg shadow-[#E85D3A]/30' : 'bg-[#FDF6EC] border-2 border-[#E85D3A]/20'}`}>
                      {step.icon}
                      {step.active && <div className="absolute inset-0 rounded-full border-2 border-[#E85D3A] animate-ping opacity-20" />}
                    </div>
                    <span className={`text-xs md:text-sm font-bold bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm ${step.active ? 'text-[#E85D3A]' : 'text-[#8B7355]'}`}>{step.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Scooter animation */}
            <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.8 }}
              className="text-center mt-8 text-5xl">🏍️💨</motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== MENU SECTION ===== */}
      <section id="menu" className="py-20 doodle-bg relative">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-[#E85D3A] font-bold text-sm uppercase tracking-widest">Explore Our</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D2016] mt-2">Delicious Menu</h2>
              <div className="w-20 h-1.5 bg-[#E85D3A] mx-auto rounded-full mt-4" />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['All', 'Veg', 'Non-Veg', 'Beverages'].map((cat) => (
                <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat as Category | 'All')}
                  className={`px-7 py-3 rounded-full font-bold text-sm transition-all duration-300 ${activeCategory === cat ? 'bg-[#E85D3A] text-white shadow-lg shadow-[#E85D3A]/30' : 'bg-white text-[#8B7355] hover:text-[#2D2016] border border-[#E85D3A]/10 hover:border-[#E85D3A]/30'}`}>
                  {cat === 'Veg' && '🥬 '}{cat === 'Non-Veg' && '🍗 '}{cat === 'Beverages' && '🥤 '}{cat === 'All' && '🍕 '}{cat}
                </motion.button>
              ))}
            </div>

            {/* Menu grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredMenu.map((item, index) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="pizza-card bg-white rounded-3xl overflow-hidden border border-[#E85D3A]/10 shadow-sm">
                    <div className="relative h-56 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${item.category === 'Veg' ? 'bg-green-100/90 text-green-700' : item.category === 'Non-Veg' ? 'bg-red-100/90 text-red-700' : 'bg-blue-100/90 text-blue-700'}`}>
                          {item.category === 'Veg' ? '🟢' : item.category === 'Non-Veg' ? '🔴' : '🔵'} {item.category}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-extrabold text-[#2D2016]">{item.name}</h3>
                        <span className="text-xl font-black text-[#E85D3A]">₹{item.price}</span>
                      </div>
                      <p className="text-[#8B7355] text-sm mb-5 line-clamp-2">{item.description}</p>
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => addToCart(item)} disabled={!item.isAvailable}
                        className="w-full bg-[#E85D3A] text-white py-3 rounded-2xl font-bold hover:bg-[#D04E2E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#E85D3A]/20">
                        <ShoppingBag className="w-4 h-4" /> {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="py-20 bg-[#2D2016] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2000&q=30" alt="" className="w-full h-full object-cover" />
        </div>
        <AnimatedSection>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <motion.div whileInView={{ rotate: [0, 3, -3, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-6 -left-6 w-24 h-24 bg-[#E85D3A]/20 rounded-full blur-xl" />
                <motion.div whileInView={{ rotate: [0, -3, 3, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#F4A340]/20 rounded-full blur-xl" />
                <div className="grid grid-cols-2 gap-4">
                  <motion.img whileInView={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=500&q=80" alt="Chef" className="rounded-2xl shadow-2xl border-4 border-white/10 w-full h-60 object-cover" />
                  <motion.img whileInView={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80" alt="Pizza" className="rounded-2xl shadow-2xl border-4 border-white/10 mt-8 w-full h-60 object-cover" />
                </div>
              </div>
              <div>
                <span className="text-[#E85D3A] font-bold text-sm uppercase tracking-widest">Our Story</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 mb-6">
                  Your Favorite Place for <span className="text-[#E85D3A]">Family</span>
                </h2>
                <p className="text-white/70 text-lg mb-6 leading-relaxed">At Caveman's Pizzeria, we believe in keeping it simple and authentic. Our dough is made fresh daily, our sauces are crafted from vine-ripened tomatoes.</p>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">Located in the heart of Sainikpuri, we've been serving the community with passion and pride since 2020.</p>
                <div className="grid grid-cols-3 gap-4">
                  {[{ num: '100%', label: 'Fresh' }, { num: '500+', label: 'Customers' }, { num: '4.8★', label: 'Rating' }].map((stat) => (
                    <div key={stat.label} className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 text-center">
                      <h4 className="text-2xl font-black text-[#E85D3A]">{stat.num}</h4>
                      <p className="text-white/50 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="py-20 doodle-bg">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-[#E85D3A] font-bold text-sm uppercase tracking-widest">Find Us</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D2016] mt-2">Visit Us Today</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                {[
                  { icon: <MapPin className="text-[#E85D3A]" />, title: 'Location', desc: '123 Sainikpuri Main Road,\nSecunderabad, Hyderabad 500094' },
                  { icon: <Phone className="text-[#E85D3A]" />, title: 'Phone', desc: '+91 98765 43210' },
                  { icon: <Clock className="text-[#E85D3A]" />, title: 'Opening Hours', desc: 'Mon-Sun: 11:00 AM - 11:00 PM' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm border border-[#E85D3A]/10 hover:shadow-md hover:border-[#E85D3A]/20 transition-all">
                    <div className="w-12 h-12 bg-[#E85D3A]/10 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
                    <div><h4 className="text-[#2D2016] font-bold text-lg">{item.title}</h4><p className="text-[#8B7355] whitespace-pre-line">{item.desc}</p></div>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="h-80 lg:h-full bg-white rounded-3xl overflow-hidden border border-[#E85D3A]/10 shadow-sm relative min-h-[320px]">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '320px' }} 
                  loading="lazy" 
                  allowFullScreen 
                  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Sainikpuri,%20Secunderabad,%20Hyderabad&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                </iframe>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ===== WHATSAPP BUTTON ===== */}
      <motion.a initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring' }}
        href="https://wa.me/919876543210?text=Hi,%20I%20want%20to%20order%20from%20Caveman's%20Pizzeria" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-lg shadow-green-500/30 hover:scale-110 transition-transform">
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </motion.a>
    </>
  );
}
