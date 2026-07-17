import { Spot, FoodList } from '../types';

export const FEATURED_SPOTS: Spot[] = [
  {
    id: '1',
    name: 'Tunday Kababi',
    area: 'Aminabad',
    city: 'Lucknow',
    emoji: '🍢',
    rating: 4.9,
    reviews: 2340,
    tags: ['Kebabs', 'Mughlai'],
    priceRange: '₹50–₹200',
    color: '#FF6B35',
  },
  {
    id: '2',
    name: "Raheem's Nihari",
    area: 'Chowk',
    city: 'Lucknow',
    emoji: '🥘',
    rating: 4.8,
    reviews: 1890,
    tags: ['Nihari', 'Breakfast'],
    priceRange: '₹80–₹300',
    color: '#C0392B',
  },
  {
    id: '3',
    name: 'Shukla Chaat',
    area: 'Hazratganj',
    city: 'Lucknow',
    emoji: '🥗',
    rating: 4.7,
    reviews: 980,
    tags: ['Chaat', 'Street food'],
    priceRange: '₹20–₹80',
    color: '#27AE60',
  },
];

export const NEARBY_SPOTS: Spot[] = [
  { id: '4', name: 'Moti Mahal', area: 'Hazratganj', city: 'Lucknow', emoji: '🍛', rating: 4.5, tags: ['Biryani'], priceRange: '₹150–₹500' },
  { id: '5', name: 'Royal Café', area: 'MG Road', city: 'Lucknow', emoji: '☕', rating: 4.3, tags: ['Café', 'Snacks'], priceRange: '₹60–₹200' },
  { id: '6', name: 'Idris Biryani', area: 'Nakhas', city: 'Lucknow', emoji: '🍚', rating: 4.6, tags: ['Biryani', 'Mughlai'], priceRange: '₹100–₹350' },
  { id: '7', name: 'Prakash Kulfi', area: 'Aminabad', city: 'Lucknow', emoji: '🍦', rating: 4.8, tags: ['Desserts'], priceRange: '₹30–₹80' },
];

export const MY_LISTS: FoodList[] = [
  { id: '1', title: 'Best Kebabs in Town', count: 8, emoji: '🍢', saves: 234, isPublic: true },
  { id: '2', title: 'Late Night Eats', count: 5, emoji: '🌙', saves: 89, isPublic: true },
  { id: '3', title: 'Budget Bites < ₹100', count: 12, emoji: '💰', saves: 412, isPublic: true },
];

export const TRENDING_LISTS: FoodList[] = [
  { id: '4', title: 'Chowk Hidden Gems', count: 15, emoji: '🗺️', saves: 1203, by: 'Community' },
  { id: '5', title: 'Breakfast Trail', count: 9, emoji: '🌅', saves: 876, by: 'Community' },
  { id: '6', title: 'Street Food Complete Guide', count: 22, emoji: '📖', saves: 2100, by: 'Community' },
];

export const CATEGORIES = ['All 🍽️', 'Kebabs 🍢', 'Biryani 🍛', 'Chaat 🥗', 'Sweets 🍮', 'Café ☕', 'Juice 🥤'];

export const ADD_CATEGORIES = ['Kebabs 🍢', 'Biryani 🍛', 'Chaat 🥗', 'Sweets 🍮', 'Café ☕', 'Juice 🥤', 'Rolls 🌯', 'Other 🍽️'];

export const PRICE_RANGES = ['Under ₹50', '₹50–₹150', '₹150–₹300', '₹300+'];

export const POPULAR_SEARCHES = ['Best Biryani', 'Street Chaat', 'Late night food', 'Budget eats under ₹100', 'Mughlai near me'];

export const TRENDING_AREAS = ['Aminabad 🛒', 'Hazratganj 🌟', 'Chowk 🏛️', 'Gomti Nagar 🏙️', 'Alambagh 🚌', 'Aliganj 🌿'];
