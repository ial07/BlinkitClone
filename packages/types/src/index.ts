export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export interface Order {
  id: string;
  items: string[];
}

export interface Recommendation {
  name: string;
  score: number;
}

export interface RecommendationResponse {
  item: string;
  recommendations: Recommendation[];
}
