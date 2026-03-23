import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, LogOut, Plus, Trash2, Pencil, X } from 'lucide-react';
import type { MenuItem, CartItem, Order, Category } from '../types';

export function AdminView({ menu, orders, updateMenuItem, deleteMenuItem, addMenuItem, updateOrderStatus, onExit }: any) {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [isAdding, setIsAdding] = useState(false);

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); if (password === 'admin123') setIsAuthenticated(true); else alert('Wrong password!'); };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-xl border border-[#E85D3A]/10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#E85D3A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ChefHat className="text-white w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#2D2016]">Admin Login</h2>
            <p className="text-[#8B7355]">Enter password to access dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Password (try 'admin123')" className="w-full bg-[#FDF6EC] border border-[#E85D3A]/20 rounded-xl px-4 py-3 text-[#2D2016] focus:outline-none focus:border-[#E85D3A]" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="w-full bg-[#E85D3A] text-white py-3 rounded-xl font-bold hover:bg-[#D04E2E] transition-colors">Login</button>
            <button type="button" onClick={onExit} className="w-full text-[#8B7355] hover:text-[#2D2016] text-sm">Back to Website</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const startEdit = (item: MenuItem) => { setIsEditing(item.id); setEditForm(item); };
  const saveEdit = () => { if (isEditing) { updateMenuItem(isEditing, editForm); setIsEditing(null); } };
  const handleAdd = (e: React.FormEvent) => { e.preventDefault(); addMenuItem(editForm); setIsAdding(false); setEditForm({}); };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2D2016]">Admin Dashboard</h1>
          <p className="text-[#8B7355]">Manage orders and menu items</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-1 rounded-xl flex gap-1 shadow-sm">
            {(['orders', 'menu'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg font-medium transition-all capitalize ${activeTab === tab ? 'bg-[#E85D3A] text-white shadow' : 'text-[#8B7355] hover:text-[#2D2016]'}`}>{tab}</button>
            ))}
          </div>
          <button onClick={onExit} className="flex items-center gap-2 text-[#8B7355] hover:text-[#E85D3A]"><LogOut className="w-5 h-5" /> Exit</button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#E85D3A]/20"><p className="text-[#8B7355]">No orders yet</p></div>
          ) : orders.map((order: Order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-[#E85D3A]/10 shadow-sm overflow-hidden">
              <div className="p-5 flex flex-col md:flex-row justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#2D2016]">Order #{order.id}</h3>
                    <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className={`px-3 py-1 rounded-full text-xs font-bold uppercase cursor-pointer border-none outline-none ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      <option value="Pending">Pending</option><option value="Preparing">Preparing</option><option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <p className="text-[#8B7355] text-sm mb-3">{new Date(order.timestamp).toLocaleString()}</p>
                  {order.items.map((item: CartItem) => (
                    <div key={item.id} className="flex justify-between text-sm py-1"><span className="text-[#2D2016]">{item.quantity}x {item.name}</span><span className="text-[#8B7355]">₹{item.price * item.quantity}</span></div>
                  ))}
                  <div className="pt-3 border-t border-[#E85D3A]/10 mt-3 flex justify-between"><span className="text-[#8B7355]">Total</span><span className="text-lg font-bold text-[#E85D3A]">₹{order.total}</span></div>
                </div>
                <div className="md:w-56 bg-[#FDF6EC] p-4 rounded-xl text-sm">
                  <h4 className="font-bold text-[#2D2016] mb-2">Customer</h4>
                  <p className="text-[#8B7355]">{order.customerName}</p>
                  <p className="text-[#8B7355]">{order.phone}</p>
                  <p className="text-[#8B7355]">{order.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => { setIsAdding(true); setEditForm({ category: 'Veg', isAvailable: true }); }} className="bg-[#E85D3A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#D04E2E] flex items-center gap-2"><Plus className="w-5 h-5" /> Add New Item</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {menu.map((item: MenuItem) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E85D3A]/10 overflow-hidden group shadow-sm">
                <div className="relative h-44">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => startEdit(item)} className="p-2 bg-white rounded-full hover:bg-[#E85D3A] hover:text-white transition-colors"><Pencil className="w-5 h-5" /></button>
                    <button onClick={() => deleteMenuItem(item.id)} className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-1"><h3 className="font-bold text-[#2D2016]">{item.name}</h3><span className="text-[#E85D3A] font-bold">₹{item.price}</span></div>
                  <p className="text-[#8B7355] text-sm line-clamp-2">{item.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.isAvailable ? 'Available' : 'Out of Stock'}</span>
                    <span className="text-xs text-[#8B7355] uppercase">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {(isEditing || isAdding) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-5 border-b border-[#E85D3A]/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#2D2016]">{isAdding ? 'Add New Item' : 'Edit Item'}</h3>
                <button onClick={() => { setIsEditing(null); setIsAdding(false); }}><X className="w-6 h-6 text-[#8B7355]" /></button>
              </div>
              <form onSubmit={isAdding ? handleAdd : (e) => { e.preventDefault(); saveEdit(); }} className="p-5 space-y-3">
                <div><label className="text-sm font-medium text-[#8B7355]">Name</label><input required className="w-full bg-[#FDF6EC] border border-[#E85D3A]/20 rounded-xl px-4 py-2 text-[#2D2016] mt-1" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
                <div><label className="text-sm font-medium text-[#8B7355]">Description</label><textarea required className="w-full bg-[#FDF6EC] border border-[#E85D3A]/20 rounded-xl px-4 py-2 text-[#2D2016] h-20 mt-1" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium text-[#8B7355]">Price (₹)</label><input type="number" required className="w-full bg-[#FDF6EC] border border-[#E85D3A]/20 rounded-xl px-4 py-2 text-[#2D2016] mt-1" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} /></div>
                  <div><label className="text-sm font-medium text-[#8B7355]">Category</label><select className="w-full bg-[#FDF6EC] border border-[#E85D3A]/20 rounded-xl px-4 py-2 text-[#2D2016] mt-1" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value as Category})}><option value="Veg">Veg</option><option value="Non-Veg">Non-Veg</option><option value="Beverages">Beverages</option></select></div>
                </div>
                <div><label className="text-sm font-medium text-[#8B7355]">Image URL</label><input type="url" required className="w-full bg-[#FDF6EC] border border-[#E85D3A]/20 rounded-xl px-4 py-2 text-[#2D2016] mt-1" value={editForm.image || ''} onChange={e => setEditForm({...editForm, image: e.target.value})} /></div>
                <label className="flex items-center gap-2 text-[#2D2016]"><input type="checkbox" checked={editForm.isAvailable} onChange={e => setEditForm({...editForm, isAvailable: e.target.checked})} className="w-5 h-5 accent-[#E85D3A]" /> Available</label>
                <button type="submit" className="w-full bg-[#E85D3A] text-white py-3 rounded-xl font-bold hover:bg-[#D04E2E] transition-colors mt-2">{isAdding ? 'Add Item' : 'Save Changes'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
