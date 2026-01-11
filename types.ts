export enum View {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  MAP_DISCOVERY = 'MAP_DISCOVERY',
  SEARCH_RESULTS = 'SEARCH_RESULTS',
  RESTAURANT_DETAIL = 'RESTAURANT_DETAIL',
  CHECKOUT = 'CHECKOUT',
  ORDER_SUCCESS = 'ORDER_SUCCESS',
  PROFILE = 'PROFILE',
  MERCHANT_DASHBOARD = 'MERCHANT_DASHBOARD',
  NOT_FOUND = 'NOT_FOUND'
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  popular?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string; // e.g., "1.2 km"
  deliveryTime: string; // e.g., "15-20 min"
  minPrice: number;
  maxPrice: number;
  tags: string[];
  image: string;
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isMerchant?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}