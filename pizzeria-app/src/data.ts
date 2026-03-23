import { MenuItem } from './types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1', name: 'Margherita Madness',
    description: 'Classic tomato sauce, fresh mozzarella, and basil on a hand-tossed crust.',
    price: 299, category: 'Veg',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: '2', name: 'Pepperoni Feast',
    description: 'Double pepperoni, mozzarella cheese, and our signature tomato sauce.',
    price: 399, category: 'Non-Veg',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: '3', name: 'Farmhouse Fresh',
    description: 'Onions, capsicum, mushrooms, tomatoes, and olives with extra cheese.',
    price: 349, category: 'Veg',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: '4', name: 'Chicken Supreme',
    description: 'Grilled chicken, onions, capsicum, and red paprika.',
    price: 449, category: 'Non-Veg',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: '5', name: 'Classic Coke',
    description: 'Chilled 300ml can of refreshing cola.',
    price: 50, category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
  {
    id: '6', name: 'Tandoori Paneer',
    description: 'Spicy tandoori sauce, paneer cubes, capsicum, and red paprika.',
    price: 379, category: 'Veg',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
  },
];
