export type UserType = 'foodie' | 'vendor' | null;

export interface Spot {
  id: string;
  name: string;
  area: string;
  city: string;
  emoji: string;
  rating: number;
  reviews?: number;
  tags: string[];
  priceRange: string;
  color?: string;
}

export interface FoodList {
  id: string;
  title: string;
  count: number;
  emoji: string;
  saves: number;
  isPublic?: boolean;
  by?: string;
}
