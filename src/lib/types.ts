// Τύποι δεδομένων — καθρεφτίζουν το schema του 001_initial_schema.sql

export type ProductStatus = 'draft' | 'active';
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';

export interface Category {
  id: string;
  name: string;
  slug: string;
  position: number;
  parent_id: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  price_cents: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
  sku: string | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt: string;
  position: number;
}

export interface ProductWithRelations extends Product {
  category: Category;
  product_variants: ProductVariant[];
  product_images: ProductImage[];
}

export interface Order {
  id: string;
  stripe_session_id: string;
  email: string;
  customer_name: string;
  shipping_address: Record<string, string | null>;
  amount_cents: number;
  currency: string;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string | null;
  product_name: string;
  size: string;
  color: string;
  unit_price_cents: number;
  quantity: number;
}

// Γραμμή καλαθιού (client-side, Zustand)
export interface CartLine {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  size: string;
  color: string;
  priceCents: number;
  imagePath: string | null;
  quantity: number;
  maxStock: number;
}
