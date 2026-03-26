import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChefHat, MapPin, Phone, Clock, Menu as MenuIcon, X } from 'lucide-react';
import { INITIAL_MENU } from './data';
import { FloatingDecorations, MarqueeBanner } from './components/Decorations';
import { CustomerView } from './components/CustomerView';
import { CartDrawer } from './components/CartDrawer';
import { AdminView } from './components/AdminView';
import type { MenuItem, CartItem, Order } from './types';

export default function App() {
  const [view, setView] = useState<'customer' | 'admin' | 'confirmation' | 'track'>('customer');
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const savedMenu = localStorage.getItem('caveman_menu');
    const savedOrders = localStorage.getItem('caveman_orders');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => { localStorage.setItem('caveman_menu', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('caveman_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: string, delta: number) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const placeOrder = (d: { name: string; phone: string; address: string; delivery_type: 'home' | 'pickup' }) => {
    const newOrder: Order = { id: Math.random().toString(36).substr(2, 9).toUpperCase(), customerName: d.name, phone: d.phone, address: d.address, delivery_type: d.delivery_type, items: [...cart], total: cartTotal, status: 'Pending' as const, timestamp: Date.now() };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]); setIsCartOpen(false);
    setPlacedOrder(newOrder);
    setView('confirmation');
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find(o => o.id === trackOrderId.toUpperCase());
    if (order) setTrackedOrder(order);
    else alert('Order not found!');
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => setMenu(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  const deleteMenuItem = (id: string) => setMenu(prev => prev.filter(item => item.id !== id));
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => setMenu(prev => [...prev, { ...item, id: Math.random().toString(36).substr(2, 9) }]);
  const updateOrderStatus = (id: string, status: Order['status']) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-[#2D2016] font-sans relative">
      <FloatingDecorations />

      {/* ===== NAVBAR ===== */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('customer')}>
            <motion.div whileHover={{ rotate: -12 }} className="w-12 h-12 bg-[#E85D3A] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E85D3A]/20 -rotate-6">
              <ChefHat className="text-white w-7 h-7" />
            </motion.div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#2D2016]">CAVEMAN'S<span className="text-[#E85D3A]">.</span></span>
              <p className="text-[10px] text-[#8B7355] font-medium -mt-1 tracking-widest">PIZZERIA</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-[#8B7355]">
            {[{ label: 'Home', action: () => setView('customer') },
              { label: 'Menu', action: () => { setView('customer'); setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
              { label: 'Track Order', action: () => { setView('track'); setTrackedOrder(null); setTrackOrderId(''); } },
              { label: 'Contact', action: () => { setView('customer'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
            ].map(item => (
              <button key={item.label} onClick={item.action} className="hover:text-[#E85D3A] transition-colors relative group">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E85D3A] group-hover:w-full transition-all duration-300 rounded-full" />
            </button>
          ))}
          {/* Admin link in desktop nav */}
          <button onClick={() => setView('admin')}
            className="hover:text-[#E85D3A] transition-colors relative group font-bold">
            Admin
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-[#2D2016] hover:bg-[#E85D3A]/10 rounded-xl transition-colors">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#E85D3A]/10 hover:bg-[#E85D3A]/20 rounded-xl transition-colors">
              <ShoppingBag className="w-5 h-5 text-[#E85D3A]" />
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-[#E85D3A] text-white text-xs font-bold flex items-center justify-center rounded-full shadow-md">
                  {cartCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }} className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-b border-[#E85D3A]/10">
          <div className="flex flex-col px-4 py-4 space-y-4">
            {view !== 'admin' && [
              { label: 'Home', action: () => { setView('customer'); setIsMobileMenuOpen(false); } },
              { label: 'Menu', action: () => { setView('customer'); setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 100); setIsMobileMenuOpen(false); } },
              { label: 'Track Order', action: () => { setView('track'); setTrackedOrder(null); setTrackOrderId(''); setIsMobileMenuOpen(false); } },
              { label: 'Contact', action: () => { setView('customer'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); setIsMobileMenuOpen(false); } },
            ].map(item => (
              <button key={item.label} onClick={item.action} className="text-left font-bold text-lg text-[#2D2016] hover:text-[#E85D3A]">{item.label}</button>
            ))}
            <button onClick={() => { setView('admin'); setIsMobileMenuOpen(false); }} className="text-left font-bold text-lg text-[#E85D3A]">
              Admin Login
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Marquee */}
      {view === 'customer' && <div className="pt-[72px]"><MarqueeBanner /></div>}
      {view === 'admin' && <div className="pt-[72px]" />}

      {/* Main */}
      <main className={view === 'confirmation' || view === 'track' ? 'pt-24 min-h-[80vh] container mx-auto px-4 pb-16' : ''}>
        {view === 'customer' && <CustomerView menu={menu} addToCart={addToCart} />}
        {view === 'admin' && <AdminView menu={menu} orders={orders} updateMenuItem={updateMenuItem} deleteMenuItem={deleteMenuItem} addMenuItem={addMenuItem} updateOrderStatus={updateOrderStatus} onExit={() => setView('customer')} />}
        {view === 'confirmation' && placedOrder && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#E85D3A]/20 transform transition-all mt-10">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-4xl">🎉</span></div>
              <h1 className="text-3xl font-extrabold text-[#2D2016]">Order Confirmed!</h1>
              <p className="text-[#8B7355] mt-2">Thank you for craving our pizzas.</p>
            </div>
            <div className="bg-[#FDF6EC] p-6 rounded-2xl border border-[#E85D3A]/10 space-y-4">
              <div className="flex justify-between items-center border-b border-[#E85D3A]/10 pb-4">
                <span className="text-[#8B7355] font-semibold">Order ID</span>
                <span className="text-[#E85D3A] font-extrabold text-xl">#{placedOrder.id}</span>
              </div>
              <div>
                <span className="text-[#8B7355] font-semibold block mb-2">Delivery Details</span>
                {placedOrder.delivery_type === 'home' ? (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                    <p className="flex items-center gap-2 font-bold text-[#E85D3A] mb-1"><span>📍</span> Home Delivery</p>
                    <p className="text-[#2D2016] leading-tight text-sm font-medium">{placedOrder.address}</p>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
                    <p className="flex items-center gap-2 font-bold text-blue-600 mb-1"><span>🏪</span> Pickup from shop</p>
                    <p className="text-blue-700/80 leading-tight text-sm">Your order will be prepared and awaits you at our counter.</p>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setView('customer')} className="w-full mt-8 bg-[#E85D3A] text-white py-4 rounded-xl font-bold hover:bg-[#D04E2E] transition-colors shadow-lg">Back to Home</button>
          </div>
        )}
        {view === 'track' && (
          <div className="max-w-2xl mx-auto space-y-8 mt-10">
            <div className="text-center">
              <h1 className="text-4xl font-black text-[#2D2016] mb-2 text-center uppercase tracking-tight">Track Your <span className="text-[#E85D3A]">Order</span></h1>
              <p className="text-[#8B7355] text-lg">Enter your order ID below to check its status.</p>
            </div>
            <form onSubmit={handleTrackSubmit} className="flex gap-2">
              <input type="text" placeholder="e.g. A1B2C3D4E" required className="flex-1 bg-white border-2 border-[#E85D3A]/20 rounded-xl px-5 py-4 text-lg text-[#2D2016] uppercase focus:outline-none focus:border-[#E85D3A] shadow-sm font-bold" value={trackOrderId} onChange={e => setTrackOrderId(e.target.value)} />
              <button type="submit" className="bg-[#E85D3A] hover:bg-[#D04E2E] px-8 py-4 rounded-xl text-white font-bold transition-all shadow-lg hidden md:block">Track Order</button>
            </form>

            <AnimatePresence>
              {trackedOrder && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-[#E85D3A]/10 mt-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E85D3A]/10 pb-6">
                    <div>
                      <h3 className="text-[#8B7355] font-semibold text-sm uppercase tracking-wider">Order Status for</h3>
                      <p className="text-2xl font-black text-[#E85D3A]">#{trackedOrder.id}</p>
                    </div>
                    <div className="bg-[#FDF6EC] px-6 py-3 rounded-full text-center font-bold text-[#E85D3A] border border-[#E85D3A]/20 shadow-inner">
                      {trackedOrder.status === 'Pending' && '⏳ Order Received'}
                      {trackedOrder.status === 'Preparing' && '👨‍🍳 Preparing in Kitchen'}
                      {trackedOrder.status === 'Delivered' && '✅ Completed'}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-[#2D2016] flex items-center gap-2"><MapPin className="text-[#E85D3A] w-5 h-5"/> Delivery Updates</h4>
                    {trackedOrder.delivery_type === 'home' ? (
                      <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                        <p className="font-semibold text-orange-800 mb-1">Your order will be delivered to:</p>
                        <p className="text-orange-900/80 text-sm font-medium">{trackedOrder.address}</p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                        <p className="font-semibold text-blue-800 mb-1">Pickup Information</p>
                        <p className="text-blue-900/80 text-sm font-medium">Your order will be ready for pickup at the shop.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer cart={cart} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} updateQuantity={updateQuantity} removeFromCart={removeFromCart} cartTotal={cartTotal} placeOrder={placeOrder} />

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#2D2016] py-14 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E85D3A] via-[#F4A340] to-[#E85D3A]" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#E85D3A] rounded-xl flex items-center justify-center -rotate-6"><ChefHat className="text-white w-6 h-6" /></div>
                <span className="text-xl font-black text-white">CAVEMAN'S<span className="text-[#E85D3A]">.</span></span>
              </div>
              <p className="text-white/50 max-w-sm leading-relaxed">Serving the best wood-fired pizzas in Sainikpuri since 2020. Fresh ingredients, authentic recipes, and a passion for pizza.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/50">
                <li><button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#E85D3A] transition-colors">Menu</button></li>
                <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#E85D3A] transition-colors">About Us</button></li>
                <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#E85D3A] transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-white/50 text-sm">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#E85D3A]" /> Sainikpuri, Hyderabad</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#E85D3A]" /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#E85D3A]" /> 11 AM - 11 PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">© 2024 Caveman's Pizzeria. All rights reserved.</p>
            <div className="flex gap-4">
              <svg className="w-5 h-5 text-white/40 hover:text-[#E85D3A] cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <svg className="w-5 h-5 text-white/40 hover:text-[#E85D3A] cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <svg className="w-5 h-5 text-white/40 hover:text-[#E85D3A] cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
