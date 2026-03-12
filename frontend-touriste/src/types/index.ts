// Types qui respectent exactement le Contrat API

export interface Destination {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: 'NATURE' | 'CULTURE' | 'AVENTURE' | 'PLAGE';
  location: string;
  cover_image: string;
  description?: string;
  images?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'TOURIST' | 'ADMIN';
}

export interface Booking {
  id: string;
  destination_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  nb_persons: number;
  total_price: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  destination?: Destination;
}

export interface Review {
  id: string;
  user_id: string;
  destination_id: string;
  rating: number;
  comment: string;
  user?: { name: string };
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ApiError {
  error: string;
  statusCode: number;
}