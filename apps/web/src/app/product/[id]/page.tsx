'use client';

import { useEffect, useState, use } from 'react';
import { Product } from '@blinkit/types';
import { fetchProducts } from '@/lib/api';
import { cartStore } from '@/store/cart';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCarousel } from '@/components/ProductCarousel';
import { formatPrice } from '@blinkit/utils';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((products) => {
        setAllProducts(products);
        const found = products.find((p) => p.id === unwrappedParams.id);
        if (found) setProduct(found);
      })
      .finally(() => setLoading(false));
  }, [unwrappedParams.id]);

  const handleAdd = (p: Product) => {
    cartStore.addItem(p);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-[#0C831F]" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-0">
      <Navbar />

      <main className="mx-auto max-w-7xl">
        {/* White background container for product detail */}
        <div className="bg-white border-b border-zinc-200 lg:border-x lg:mt-4 lg:rounded-t-2xl px-4 py-6 sm:p-8">
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* LEFT: Image & Thumbnails */}
            <div className="flex flex-col items-center">
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center overflow-hidden rounded-2xl border border-zinc-100 bg-white">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-contain p-8" />
                ) : (
                  <div className="text-8xl font-black text-zinc-300">
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>
              
              {/* Thumbnails (Mock) */}
              <div className="mt-4 flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border ${
                      i === 1 ? 'border-[#0C831F]' : 'border-zinc-200'
                    } bg-[#F8F8F8]`}
                  >
                    <span className="text-xl font-bold text-zinc-300">{product.name.charAt(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div className="flex flex-col">
              {/* Breadcrumb (Mock) */}
              <div className="mb-4 text-xs font-medium text-zinc-500">
                Home / Groceries / {product.name}
              </div>

              <h1 className="mb-2 text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl">
                {product.name}
              </h1>
              
              <div className="mb-6 mt-1 w-fit rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold text-zinc-600">
                8 MINS DELIVERY
              </div>

              {/* Unit Selector (Mock) */}
              <div className="mb-6">
                <p className="mb-2 text-sm font-semibold text-zinc-800">Select Unit</p>
                <div className="flex gap-3">
                  <button className="flex flex-col items-start justify-center rounded-xl border-2 border-[#0C831F] bg-[#F4FBEB] p-3 text-left">
                    <span className="text-xs font-medium text-zinc-600">1 unit</span>
                    <span className="font-bold text-zinc-900">{formatPrice(product.price)}</span>
                  </button>
                  <button className="flex flex-col items-start justify-center rounded-xl border border-zinc-200 bg-white p-3 text-left opacity-70">
                    <span className="text-xs font-medium text-zinc-600">2 units</span>
                    <span className="font-bold text-zinc-900">{formatPrice(product.price * 2)}</span>
                  </button>
                </div>
              </div>

              {/* Price & Add to Cart (Match Screenshot) */}
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-700 mb-0.5">1 unit</p>
                  <p className="text-lg font-bold text-zinc-900">{formatPrice(product.price)}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">(Inclusive of all taxes)</p>
                </div>
                <button
                  onClick={() => handleAdd(product)}
                  className="flex h-10 items-center justify-center rounded-lg bg-[#0C831F] px-6 text-sm font-bold text-white transition-colors hover:bg-[#0a6e19] active:scale-95"
                >
                  Add to cart
                </button>
              </div>

              {/* Why Shop Section */}
              <div className="mt-8 border-t border-zinc-100 pt-6">
                <h3 className="mb-4 text-sm font-bold text-zinc-900">Why shop from blinkit?</h3>
                <div className="flex flex-col gap-5">
                  
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                      <img src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=90/assets/web/blinkit-promises/10_minute_delivery.png" alt="Superfast Delivery" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-800">Superfast Delivery</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                      <img src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=90/assets/web/blinkit-promises/Best_Prices_Offers.png" alt="Best Prices & Offers" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-800">Best Prices & Offers</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">Cheaper prices than your local supermarket, great cashback offers to top it off.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                      <img src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=50,metadata=none,w=90/assets/web/blinkit-promises/Wide_Assortment.png" alt="Wide Assortment" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-800">Wide Assortment</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">Choose from 5000+ products across food, personal care, household & other categories.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Product Details Section */}
          <div className="mt-12 w-full max-w-md pt-2">
            <h2 className="mb-4 text-[15px] font-bold text-zinc-900">Product Details</h2>
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-zinc-800 mb-1">Unit</h3>
              <p className="text-xs text-zinc-600">1 unit</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-zinc-800 mb-1">Shelf Life</h3>
              <p className="text-xs text-zinc-600">6 months</p>
            </div>
            <button className="mt-4 text-xs font-bold text-[#0C831F]">
              View more details <span className="ml-1 text-[10px]">▼</span>
            </button>
          </div>
        </div>

        {/* Product Carousels */}
        <div className="mt-6 flex flex-col gap-6">
          <ProductCarousel
            title="Similar products"
            products={allProducts.slice(0, 8)}
            onAdd={handleAdd}
          />
          <ProductCarousel
            title="Top products in this category"
            products={allProducts.slice(8, 16)}
            onAdd={handleAdd}
          />
          <ProductCarousel
            title="People also bought"
            products={allProducts.slice(16, 24)}
            onAdd={handleAdd}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
