export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  stock: number;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Order {
  id: number;
  userId?: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}
