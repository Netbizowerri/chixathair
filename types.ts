
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  // Images stored as Base64 data URLs (compressed < 200KB each) — BASE64_FIRESTORE
  images: string[];
  // Video stored as external URL (Vimeo, YouTube, etc.) — EXTERNAL_URL
  video?: string;
  stock: number;
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  items: CartItem[];
  totalAmount: number;
  shippingInfo: {
    destination: string;
    shippingRate: number;
    shippingLabel: string;
    address: string;
    phone: string;
  };
  paymentReference: string;
  paymentMethod: 'paystack' | string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Paid';
  createdAt: string;
}

export type Category = string;
