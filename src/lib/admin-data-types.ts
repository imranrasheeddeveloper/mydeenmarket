// ============================================
// ADMIN DATA TYPES - Client-safe type exports
// ============================================

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  lastOrderAt?: string | null;
}
