import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Minus, Trash2, X } from 'lucide-react';
import type { CartItem } from '../types';

interface CartDrawerProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  cartTotal: number;
  placeOrder: (details: { name: string; phone: string; address: string }) => void;
}

export function CartDrawer({ cart, isOpen, onClose, updateQuantity, removeFromCart, cartTotal, placeOrder }: CartDrawerProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { placeOrder(formData); setIsSubmitting(false); setFormData({ name: '', phone: '', address: '' }); }, 1000);
  };

  const whatsappText = `Hi Caveman's Pizzeria,%0AI want to place an order:%0ATotal: ₹${cartTotal}%0AName: ${formData.name || 'Guest'}%0APhone: ${formData.phone || 'N/A'}%0AAddress: ${formData.address || 'Pickup'}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FDF6EC] border-l-2 border-[#E85D3A]/20 z-[70] shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-[#E85D3A]/10 flex items-center justify-between bg-white">
              <h2 className="text-2xl font-extrabold text-[#2D2016] flex items-center gap-2">
                <ShoppingBag className="text-[#E85D3A]" /> Your Cart
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-[#E85D3A]/10 rounded-full transition-colors"><X className="w-6 h-6 text-[#2D2016]" /></button>
            </div>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#8B7355] space-y-4">
                  <ShoppingBag className="w-20 h-20 opacity-20" />
                  <p className="text-lg">Your cart is empty</p>
                  <button onClick={onClose} className="px-6 py-2 border-2 border-[#E85D3A] text-[#E85D3A] rounded-full font-semibold hover:bg-[#E85D3A] hover:text-white transition-all">Browse Menu</button>
                </div>
              ) : cart.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="flex gap-3 bg-white p-3 rounded-2xl shadow-sm border border-[#E85D3A]/10">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#2D2016] text-sm">{item.name}</h4>
                    <p className="text-[#E85D3A] font-bold">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full bg-[#FDF6EC] flex items-center justify-center hover:bg-[#E85D3A] hover:text-white transition-colors text-[#2D2016]"><Minus className="w-3 h-3" /></button>
                      <span className="font-bold text-[#2D2016] w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full bg-[#FDF6EC] flex items-center justify-center hover:bg-[#E85D3A] hover:text-white transition-colors text-[#2D2016]"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-[#8B7355] hover:text-red-500 self-start"><Trash2 className="w-4 h-4" /></button>
                </motion.div>
              ))}
            </div>
            {/* Checkout */}
            {cart.length > 0 && (
              <div className="p-5 bg-white border-t border-[#E85D3A]/10 space-y-3">
                <div className="flex justify-between items-center text-xl font-extrabold text-[#2D2016]">
                  <span>Total</span><span className="text-[#E85D3A]">₹{cartTotal}</span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-2">
                  <input type="text" placeholder="Your Name" required className="w-full bg-[#FDF6EC] border border-[#E85D3A]/20 rounded-xl px-4 py-2.5 text-[#2D2016] focus:outline-none focus:border-[#E85D3A] text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input type="tel" placeholder="Phone Number" required className="w-full bg-[#FDF6EC] border border-[#E85D3A]/20 rounded-xl px-4 py-2.5 text-[#2D2016] focus:outline-none focus:border-[#E85D3A] text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <textarea placeholder="Delivery Address" required className="w-full bg-[#FDF6EC] border border-[#E85D3A]/20 rounded-xl px-4 py-2.5 text-[#2D2016] focus:outline-none focus:border-[#E85D3A] h-16 resize-none text-sm" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a href={`https://wa.me/919876543210?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center transition-colors text-sm">WhatsApp</a>
                    <button type="submit" disabled={isSubmitting} className="bg-[#E85D3A] hover:bg-[#D04E2E] text-white font-bold py-3 rounded-xl transition-colors text-sm disabled:opacity-50">{isSubmitting ? 'Placing...' : 'Order Now'}</button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
