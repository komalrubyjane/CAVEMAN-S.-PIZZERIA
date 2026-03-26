import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ChefHat, 
  MapPin, 
  Phone, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter, 
  Menu as MenuIcon,
  X,
  ArrowRight,
  Star,
  LogOut,
  Edit2,
  Save,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Category = 'Veg' | 'Non-Veg' | 'Beverages';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isAvailable: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Delivered';
  timestamp: number;
}

// --- Mock Data ---
const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Madness',
    description: 'Classic tomato sauce, fresh mozzarella, and basil on a hand-tossed crust.',
    price: 299,
    category: 'Veg',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Pepperoni Feast',
    description: 'Double pepperoni, mozzarella cheese, and our signature tomato sauce.',
    price: 399,
    category: 'Non-Veg',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Farmhouse Fresh',
    description: 'Onions, capsicum, mushrooms, tomatoes, and olives with extra cheese.',
    price: 349,
    category: 'Veg',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Chicken Supreme',
    description: 'Grilled chicken, onions, capsicum, and red paprika.',
    price: 449,
    category: 'Non-Veg',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Classic Coke',
    description: 'Chilled 300ml can.',
    price: 50,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Tandoori Paneer',
    description: 'Spicy tandoori sauce, paneer cubes, capsicum, and red paprika.',
    price: 379,
    category: 'Veg',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
];

// --- Components ---

const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
  const variants = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-900/20',
    secondary: 'bg-stone-800 text-stone-100 hover:bg-stone-700',
    outline: 'border-2 border-orange-600 text-orange-500 hover:bg-orange-600/10',
    ghost: 'text-stone-400 hover:text-white hover:bg-stone-800',
  };

  return (
    <button 
      className={cn(
        'px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", className)}>
    {children}
  </span>
);

// --- Main Application ---

export default function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Load data from local storage on mount
  useEffect(() => {
    const savedMenu = localStorage.getItem('caveman_menu');
    const savedOrders = localStorage.getItem('caveman_orders');
    if (savedMenu) setMenu(JSON.parse(savedMenu));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save data to local storage on change
  useEffect(() => {
    localStorage.setItem('caveman_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('caveman_orders', JSON.stringify(orders));
  }, [orders]);

  // Scroll listener for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Logic
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout Logic
  const placeOrder = (customerDetails: { name: string, phone: string, address: string }) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      ...customerDetails,
      items: [...cart],
      total: cartTotal,
      status: 'Pending',
      timestamp: Date.now(),
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    alert('Order placed successfully! We will contact you shortly.');
  };

  // Admin Logic
  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenu(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteMenuItem = (id: string) => {
    setMenu(prev => prev.filter(item => item.id !== id));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setMenu(prev => [...prev, newItem]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-orange-500/30">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-stone-950/90 backdrop-blur-md border-stone-800 py-3" : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView('customer')}
          >
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center transform -rotate-6">
              <ChefHat className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              CAVEMAN'S<span className="text-orange-500">.</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-stone-300">
            <button onClick={() => setView('customer')} className="hover:text-orange-500 transition-colors">Home</button>
            <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-500 transition-colors">Menu</button>
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-500 transition-colors">About</button>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-500 transition-colors">Contact</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView(view === 'admin' ? 'customer' : 'admin')}
              className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-orange-500 transition-colors hidden sm:block"
            >
              {view === 'admin' ? 'Exit Admin' : 'Admin'}
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-stone-800 rounded-full transition-colors"
            >
              <ShoppingBag className="w-6 h-6 text-stone-100" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs font-bold flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {view === 'customer' ? (
          <CustomerView 
            menu={menu} 
            addToCart={addToCart} 
            cart={cart}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            cartTotal={cartTotal}
            placeOrder={placeOrder}
          />
        ) : (
          <AdminView 
            menu={menu} 
            orders={orders} 
            updateMenuItem={updateMenuItem}
            deleteMenuItem={deleteMenuItem}
            addMenuItem={addMenuItem}
            updateOrderStatus={updateOrderStatus}
            onExit={() => setView('customer')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center transform -rotate-6">
                  <ChefHat className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tighter text-white">
                  CAVEMAN'S<span className="text-orange-500">.</span>
                </span>
              </div>
              <p className="text-stone-400 max-w-sm">
                Serving the best wood-fired pizzas in Sainikpuri since 2020. Fresh ingredients, authentic recipes, and a passion for pizza.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-stone-400">
                <li><button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-500">Menu</button></li>
                <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-500">About Us</button></li>
                <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-orange-500">Contact</button></li>
                <li><button onClick={() => setView('admin')} className="hover:text-orange-500">Admin Login</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-stone-400">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500" /> Sainikpuri, Hyderabad</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange-500" /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /> 11:00 AM - 11:00 PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-sm">© 2024 Caveman's Pizzeria. All rights reserved.</p>
            <div className="flex gap-4">
              <Instagram className="w-5 h-5 text-stone-400 hover:text-orange-500 cursor-pointer" />
              <Facebook className="w-5 h-5 text-stone-400 hover:text-orange-500 cursor-pointer" />
              <Twitter className="w-5 h-5 text-stone-400 hover:text-orange-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Customer View Components ---

function CustomerView({ 
  menu, 
  addToCart, 
  cart, 
  isCartOpen, 
  setIsCartOpen, 
  updateQuantity, 
  removeFromCart, 
  cartTotal, 
  placeOrder 
}: any) {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  const filteredMenu = activeCategory === 'All' 
    ? menu 
    : menu.filter((item: MenuItem) => item.category === activeCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2000&q=80" 
            alt="Pizza Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-orange-500/20 text-orange-400 mb-6 inline-block">Now Open in Sainikpuri</Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-tight">
              BEST PIZZA IN <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">SAINIKPURI</span>
            </h1>
            <p className="text-xl text-stone-400 mb-10 max-w-2xl mx-auto">
              Hand-tossed dough, premium ingredients, and a wood-fired passion. Experience the taste of authenticity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
                Order Now <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
                View Menu
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Offers Banner */}
      <div className="bg-orange-600 py-4 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white font-bold text-lg animate-pulse">
            🍕 SPECIAL OFFER: Buy 1 Get 1 Free on all Medium Pizzas! Today Only! 🍕
          </p>
        </div>
      </div>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-stone-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">OUR MENU</h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full" />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['All', 'Veg', 'Non-Veg', 'Beverages'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={cn(
                  "px-6 py-2 rounded-full font-medium transition-all",
                  activeCategory === cat 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-900/50"
                    : "bg-stone-900 text-stone-400 hover:bg-stone-800"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredMenu.map((item: MenuItem) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item.id}
                  className="group bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 hover:border-orange-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-900/10"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={cn(
                        "backdrop-blur-md",
                        item.category === 'Veg' ? "bg-green-500/20 text-green-400" : 
                        item.category === 'Non-Veg' ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                      )}>
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{item.name}</h3>
                      <span className="text-xl font-bold text-orange-500">₹{item.price}</span>
                    </div>
                    <p className="text-stone-400 text-sm mb-6 line-clamp-2">{item.description}</p>
                    <Button 
                      className="w-full"
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                    >
                      {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-stone-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-orange-600/20 rounded-full blur-3xl" />
              <img 
                src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1000&q=80" 
                alt="Chef making pizza" 
                className="relative rounded-2xl shadow-2xl border border-stone-700"
              />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white mb-6">FRESH HANDMADE <span className="text-orange-500">PIZZAS</span></h2>
              <p className="text-stone-400 text-lg mb-6 leading-relaxed">
                At Caveman's Pizzeria, we believe in keeping it simple and authentic. Our dough is made fresh daily, 
                our sauces are crafted from vine-ripened tomatoes, and our toppings are sourced from local farms.
              </p>
              <p className="text-stone-400 text-lg mb-8 leading-relaxed">
                Located in the heart of Sainikpuri, we've been serving the community with passion and pride. 
                Whether you're dining in, taking out, or ordering delivery, we promise a slice of happiness in every bite.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-stone-950 p-6 rounded-xl border border-stone-800">
                  <h4 className="text-3xl font-black text-orange-500 mb-2">100%</h4>
                  <p className="text-stone-400">Fresh Ingredients</p>
                </div>
                <div className="bg-stone-950 p-6 rounded-xl border border-stone-800">
                  <h4 className="text-3xl font-black text-orange-500 mb-2">500+</h4>
                  <p className="text-stone-400">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-stone-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-black text-white mb-8">VISIT US</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Location</h4>
                    <p className="text-stone-400">123 Sainikpuri Main Road,<br/>Secunderabad, Hyderabad 500094</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Phone</h4>
                    <p className="text-stone-400">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Opening Hours</h4>
                    <p className="text-stone-400">Mon-Sun: 11:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-96 bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 relative">
              {/* Placeholder for Map - In a real app, use Google Maps iframe */}
              <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                  <p className="text-stone-400">Google Maps Integration</p>
                  <p className="text-stone-600 text-sm">Sainikpuri, Hyderabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-stone-900 border-l border-stone-800 z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <ShoppingBag className="text-orange-500" /> Your Cart
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-800 rounded-full">
                  <X className="w-6 h-6 text-stone-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-500 space-y-4">
                    <ShoppingBag className="w-16 h-16 opacity-20" />
                    <p>Your cart is empty</p>
                    <Button variant="outline" onClick={() => setIsCartOpen(false)}>Browse Menu</Button>
                  </div>
                ) : (
                  cart.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{item.name}</h4>
                        <p className="text-orange-500 font-bold">₹{item.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center hover:bg-stone-700 text-stone-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-white font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center hover:bg-stone-700 text-stone-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-500 hover:text-red-500 self-start"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-stone-950 border-t border-stone-800 space-y-4">
                  <div className="flex justify-between items-center text-xl font-bold text-white">
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <CheckoutForm onSubmit={placeOrder} total={cartTotal} />
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919876543210?text=Hi,%20I%20want%20to%20order%20from%20Caveman's%20Pizzeria"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-900/30 hover:scale-110 transition-transform"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}

function CheckoutForm({ onSubmit, total }: { onSubmit: (data: any) => void, total: number }) {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  const whatsappLink = useMemo(() => {
    const text = `Hi Caveman's Pizzeria,%0A%0AI want to place an order:%0A%0A*Total: ₹${total}*%0A%0AName: ${formData.name || 'Guest'}%0APhone: ${formData.phone || 'N/A'}%0AAddress: ${formData.address || 'Pickup'}`;
    return `https://wa.me/919876543210?text=${text}`;
  }, [formData, total]);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input 
        type="text" 
        placeholder="Your Name" 
        required
        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-600"
        value={formData.name}
        onChange={e => setFormData({...formData, name: e.target.value})}
      />
      <input 
        type="tel" 
        placeholder="Phone Number" 
        required
        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-600"
        value={formData.phone}
        onChange={e => setFormData({...formData, phone: e.target.value})}
      />
      <textarea 
        placeholder="Delivery Address (or 'Pickup')" 
        required
        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-600 h-24 resize-none"
        value={formData.address}
        onChange={e => setFormData({...formData, address: e.target.value})}
      />
      
      <div className="grid grid-cols-2 gap-3 pt-2">
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
        >
          <span>WhatsApp</span>
        </a>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Placing...' : 'Order Now'}
        </Button>
      </div>
      <p className="text-xs text-stone-500 text-center mt-2">
        You will be redirected to WhatsApp to confirm.
      </p>
    </form>
  );
}

// --- Admin View Components ---

function AdminView({ menu, orders, updateMenuItem, deleteMenuItem, addMenuItem, updateOrderStatus, onExit }: any) {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Simple password protection (demo only - not secure for production)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Wrong password!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <p className="text-stone-400">Enter password to access dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Password (try 'admin123')" 
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-3 text-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button className="w-full">Login</Button>
            <button type="button" onClick={onExit} className="w-full text-stone-500 hover:text-white text-sm">
              Back to Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
          <p className="text-stone-400">Manage orders and menu items</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-stone-900 p-1 rounded-lg flex gap-1">
            <button 
              onClick={() => setActiveTab('orders')}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-all",
                activeTab === 'orders' ? "bg-orange-600 text-white" : "text-stone-400 hover:text-white"
              )}
            >
              Orders
            </button>
            <button 
              onClick={() => setActiveTab('menu')}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-all",
                activeTab === 'menu' ? "bg-orange-600 text-white" : "text-stone-400 hover:text-white"
              )}
            >
              Menu
            </button>
          </div>
          <button onClick={onExit} className="flex items-center gap-2 text-stone-400 hover:text-white">
            <LogOut className="w-5 h-5" /> Exit
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-stone-900 rounded-2xl border border-stone-800 border-dashed">
              <p className="text-stone-500">No orders yet</p>
            </div>
          ) : (
            orders.map((order: Order) => (
              <div key={order.id} className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">Order #{order.id}</h3>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold uppercase border-none outline-none cursor-pointer",
                          order.status === 'Pending' ? "bg-yellow-500/20 text-yellow-500" :
                          order.status === 'Preparing' ? "bg-blue-500/20 text-blue-500" :
                          "bg-green-500/20 text-green-500"
                        )}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                    <p className="text-stone-400 text-sm mb-4">{new Date(order.timestamp).toLocaleString()}</p>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map((item: CartItem) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-stone-300">{item.quantity}x {item.name}</span>
                          <span className="text-stone-400">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-stone-800 flex justify-between items-center">
                      <span className="text-stone-400">Total</span>
                      <span className="text-xl font-bold text-orange-500">₹{order.total}</span>
                    </div>
                  </div>
                  
                  <div className="md:w-64 bg-stone-950 p-4 rounded-lg h-fit">
                    <h4 className="font-bold text-white mb-2">Customer Details</h4>
                    <p className="text-stone-400 text-sm mb-1"><span className="text-stone-500">Name:</span> {order.customerName}</p>
                    <p className="text-stone-400 text-sm mb-1"><span className="text-stone-500">Phone:</span> {order.phone}</p>
                    <p className="text-stone-400 text-sm"><span className="text-stone-500">Address:</span> {order.address}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <MenuManager 
          menu={menu} 
          updateMenuItem={updateMenuItem} 
          deleteMenuItem={deleteMenuItem}
          addMenuItem={addMenuItem}
        />
      )}
    </div>
  );
}

function MenuManager({ menu, updateMenuItem, deleteMenuItem, addMenuItem }: any) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [isAdding, setIsAdding] = useState(false);

  const startEdit = (item: MenuItem) => {
    setIsEditing(item.id);
    setEditForm(item);
  };

  const saveEdit = () => {
    if (isEditing) {
      updateMenuItem(isEditing, editForm);
      setIsEditing(null);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addMenuItem(editForm);
    setIsAdding(false);
    setEditForm({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setIsAdding(true); setEditForm({ category: 'Veg', isAvailable: true }); }}>
          <Plus className="w-5 h-5" /> Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item: MenuItem) => (
          <div key={item.id} className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden group">
            <div className="relative h-48">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => startEdit(item)} className="p-2 bg-white rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => deleteMenuItem(item.id)} className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">{item.name}</h3>
                <span className="text-orange-500 font-bold">₹{item.price}</span>
              </div>
              <p className="text-stone-400 text-sm line-clamp-2">{item.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className={cn(
                  "text-xs px-2 py-1 rounded",
                  item.isAvailable ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                )}>
                  {item.isAvailable ? 'Available' : 'Out of Stock'}
                </span>
                <span className="text-xs text-stone-500 uppercase">{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {(isEditing || isAdding) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-2xl border border-stone-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{isAdding ? 'Add New Item' : 'Edit Item'}</h3>
              <button onClick={() => { setIsEditing(null); setIsAdding(false); }} className="text-stone-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={isAdding ? handleAdd : (e) => { e.preventDefault(); saveEdit(); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-400 mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 text-white"
                  value={editForm.name || ''}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-400 mb-1">Description</label>
                <textarea 
                  required
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 text-white h-24"
                  value={editForm.description || ''}
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 text-white"
                    value={editForm.price || ''}
                    onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-400 mb-1">Category</label>
                  <select 
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 text-white"
                    value={editForm.category}
                    onChange={e => setEditForm({...editForm, category: e.target.value as Category})}
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-400 mb-1">Image URL</label>
                <input 
                  type="url" 
                  required
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 text-white"
                  value={editForm.image || ''}
                  onChange={e => setEditForm({...editForm, image: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="available"
                  checked={editForm.isAvailable}
                  onChange={e => setEditForm({...editForm, isAvailable: e.target.checked})}
                  className="w-5 h-5 rounded border-stone-700 bg-stone-800 text-orange-600 focus:ring-orange-600"
                />
                <label htmlFor="available" className="text-stone-300">Item is available</label>
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full">
                  {isAdding ? 'Add Item' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}