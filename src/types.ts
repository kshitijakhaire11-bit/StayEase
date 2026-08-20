export type Screen = 'home' | 'search_results' | 'hotel_details' | 'checkout' | 'admin' | 'login' | 'offers';

export type TransitionDirection = 'push' | 'push_back' | 'slide_up';

export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  rating: number;
  ratingLabel: string;
  reviewsCount: number;
  pricePerNight: number;
  totalPrice: number;
  taxesAndFees: number;
  nights: number;
  guests: string;
  image: string;
  gallery: string[];
  amenities: string[];
  isVerified?: boolean;
  isHighDemand?: boolean;
  address: string;
  description: string;
  roomType: string;
}

export interface SearchParams {
  destination: string;
  dates: string;
  guests: string;
}

export interface BookingDetails {
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: string;
  roomRate: number;
  taxes: number;
  discount: number;
  total: number;
}
