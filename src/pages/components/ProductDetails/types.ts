export type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    rating: number | null;
    category_id: string;
    image: string;
    images?: string[];
    stock?: number;
    reviews?: Review[];
    shipping_info?: string;
  };
  
  export type Review = {
    id: string;
    user_id: string;
    product_id: string;
    rating: number;
    comment: string;
    created_at: string;
    user_name?: string;
  };
  
  export type TabType = 'description' | 'reviews' | 'shipping';
  