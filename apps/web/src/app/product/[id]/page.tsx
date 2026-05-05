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
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl border border-zinc-100 bg-[#F8F8F8]">
                <div className="text-8xl font-black text-zinc-300">
                  {product.name.charAt(0)}
                </div>
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

              <div className="mt-auto flex items-end gap-4 rounded-xl border border-zinc-100 bg-[#F8F8F8] p-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-zinc-500">Price</p>
                  <p className="text-xl font-bold text-zinc-900">{formatPrice(product.price)}</p>
                  <p className="text-[10px] text-zinc-400">(Inclusive of all taxes)</p>
                </div>
                <button
                  onClick={() => handleAdd(product)}
                  className="flex h-12 items-center justify-center rounded-xl bg-[#0C831F] px-8 font-bold text-white transition-colors hover:bg-[#0a6e19] active:scale-95"
                >
                  ADD TO CART
                </button>
              </div>

              {/* Why Shop Section */}
              <div className="mt-8 border-t border-zinc-100 pt-6">
                <h3 className="mb-4 font-bold text-zinc-900">Why shop from blinkit clone?</h3>
                <div className="flex flex-col gap-4">
                  
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                      ⏱️
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-800">Superfast Delivery</p>
                      <p className="text-xs text-zinc-500">Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-500">
                      🏷️
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-800">Best Prices & Offers</p>
                      <p className="text-xs text-zinc-500">Cheaper prices than your local supermarket, great cashback offers to top it off.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                      📦
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-800">Wide Assortment</p>
                      <p className="text-xs text-zinc-500">Choose from 5000+ products across food, personal care, household & other categories.</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
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
