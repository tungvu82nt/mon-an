import { Restaurant, MenuItem } from './types';

export const CATEGORIES = [
  { id: 'pho', name: 'Phở & Bún', icon: '🍜' },
  { id: 'rice', name: 'Cơm Tấm', icon: '🍛' },
  { id: 'snack', name: 'Ăn Vặt', icon: '🍟' },
  { id: 'drink', name: 'Trà Sữa', icon: '🧋' },
  { id: 'healthy', name: 'Healthy', icon: '🥗' },
  { id: 'banhmi', name: 'Bánh Mì', icon: '🥖' },
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Phở Thìn Lò Đúc',
    rating: 4.8,
    reviewCount: 1240,
    distance: '1.2 km',
    deliveryTime: '15-20 min',
    minPrice: 45000,
    maxPrice: 85000,
    tags: ['Phở', 'Truyền thống'],
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=800',
    isFavorite: true
  },
  {
    id: '2',
    name: 'Cơm Tấm Cali',
    rating: 4.5,
    reviewCount: 856,
    distance: '0.8 km',
    deliveryTime: '25-35 min',
    minPrice: 50000,
    maxPrice: 120000,
    tags: ['Cơm', 'Gia đình'],
    image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Highlands Coffee',
    rating: 4.7,
    reviewCount: 3021,
    distance: '0.5 km',
    deliveryTime: '10-15 min',
    minPrice: 29000,
    maxPrice: 65000,
    tags: ['Coffee', 'Drinks'],
    image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Pizza 4P\'s',
    rating: 4.9,
    reviewCount: 5200,
    distance: '3.5 km',
    deliveryTime: '40-50 min',
    minPrice: 150000,
    maxPrice: 500000,
    tags: ['Pizza', 'Italian', 'Premium'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  }
];

export const MOCK_MENU: MenuItem[] = [
  {
    id: 'm1',
    name: 'Phở Tái Lăn',
    price: 65000,
    description: 'Thịt bò xào lăn tỏi thơm lừng, nước dùng đậm đà béo ngậy.',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=400',
    category: 'Phở',
    popular: true
  },
  {
    id: 'm2',
    name: 'Phở Nạm Gầu',
    price: 70000,
    description: 'Nạm mềm, gầu giòn, bánh phở tươi làm trong ngày.',
    image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=400',
    category: 'Phở'
  },
  {
    id: 'm3',
    name: 'Quẩy Giòn',
    price: 5000,
    description: 'Quẩy nóng giòn tan ăn kèm phở.',
    image: 'https://images.unsplash.com/photo-1626805872624-c102b48873ba?auto=format&fit=crop&q=80&w=400',
    category: 'Món kèm'
  }
];