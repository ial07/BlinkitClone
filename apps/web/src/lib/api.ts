import { Product, RecommendationResponse } from '@blinkit/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function fetchProducts(): Promise<Product[]> {
  return fetchJson<Product[]>(`${API_BASE}/products`);
}

export function fetchRecommendations(
  item: string,
): Promise<RecommendationResponse> {
  return fetchJson<RecommendationResponse>(
    `${API_BASE}/recommendations?item=${encodeURIComponent(item)}`,
  );
}
