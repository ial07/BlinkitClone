'use client';

import { useEffect, useState, useCallback, useRef, useMemo, lazy, Suspense } from 'react';

const RecommendationModal = lazy(() =>
  import('@/components/RecommendationModal').then((m) => ({ default: m.RecommendationModal }))
);
import { Product, RecommendationResponse } from '@blinkit/types';
import { fetchProducts, fetchRecommendations } from '@/lib/api';
import { cartStore } from '@/store/cart';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CategorySection } from '@/components/CategorySection';
import { ProductCarousel } from '@/components/ProductCarousel';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Recommendation state
  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTriggerProduct, setModalTriggerProduct] =
    useState<string | null>(null);

  const cooldownTimerRef = useRef(0);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = useCallback(async (product: Product) => {
    cartStore.addItem(product);

    const thisProductName = product.name;

    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(async () => {
      setRecLoading(true);
      setRecError(null);
      setRecommendation(null);

      try {
        const data = await fetchRecommendations(thisProductName);
        setRecommendation(data);

        const hasHighConfidence =
          data.recommendations.length > 0 &&
          data.recommendations.some((r) => r.score >= 0.5);

        const now = Date.now();
        const cooldownElapsed = now - cooldownTimerRef.current >= 30_000;

        if (hasHighConfidence && cooldownElapsed) {
          setModalTriggerProduct(thisProductName);
          setIsModalOpen(true);
          cooldownTimerRef.current = now;
        }
      } catch {
        setRecError(null);
        setRecommendation(null);
      } finally {
        setRecLoading(false);
      }
    }, 600);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleAddRecommendation = useCallback(
    (productName: string) => {
      const product = products.find((p) => p.name === productName);
      if (product) cartStore.addItem(product);
    },
    [products],
  );

  useEffect(() => {
    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    };
  }, []);

  const dairyGroup     = useMemo(() => products.slice(0, 10), [products]);
  const snackGroup     = useMemo(() => products.slice(10, 20), [products]);
  const beverageGroup  = useMemo(() => products.slice(20, 30), [products]);

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-0">
      <Suspense fallback={null}>
        <RecommendationModal
          isOpen={isModalOpen}
          data={recommendation}
          loading={recLoading}
          error={recError}
          triggerProduct={modalTriggerProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddRecommendation}
        />
      </Suspense>

      <Navbar />
      <Hero />
      <CategorySection />

      <main className="pb-10">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-[#0C831F]" />
          </div>
        )}

        {error && !loading && (
          <div className="mx-4 mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load products: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-2">
            <ProductCarousel
              title="Dairy, Bread & Eggs"
              products={dairyGroup}
              onAdd={handleAdd}
            />
            <ProductCarousel
              title="Snacks & Munchies"
              products={snackGroup}
              onAdd={handleAdd}
            />
            <ProductCarousel
              title="Spices & Beverages"
              products={beverageGroup}
              onAdd={handleAdd}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
