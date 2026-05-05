'use client';

import { useEffect, useState, useCallback } from 'react';
import { RecommendationResponse } from '@blinkit/types';

interface RecommendationModalProps {
  isOpen: boolean;
  data: RecommendationResponse | null;
  loading: boolean;
  error: string | null;
  triggerProduct: string | null;
  onClose: () => void;
  onAddToCart?: (productName: string) => void;
}

const MODAL_KEYFRAMES = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(40px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)  scale(1); }
}
.modal-slide-up  { animation: modalSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
.modal-fade-item { animation: fadeInUp     0.3s ease-out    both; }
`;

export function RecommendationModal({
  isOpen,
  data,
  loading,
  error,
  triggerProduct,
  onClose,
  onAddToCart,
}: RecommendationModalProps) {
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  // Escape key + body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setClosing(false);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) handleClose();
    },
    [handleClose],
  );

  const handleAddItem = useCallback(
    (name: string) => {
      setJustAdded(name);
      onAddToCart?.(name);
      setTimeout(() => setJustAdded(null), 600);
    },
    [onAddToCart],
  );

  if (!isOpen && !closing) return null;

  const hasData = data && data.recommendations.length > 0;

  return (
    <>
      {/* Inject keyframes once — no styled-jsx needed */}
      <style dangerouslySetInnerHTML={{ __html: MODAL_KEYFRAMES }} />

      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            closing
              ? 'bg-black/0 backdrop-blur-none'
              : 'bg-black/40 backdrop-blur-sm'
          }`}
          onClick={handleBackdropClick}
        />

        {/* Modal Sheet */}
        <div
          className={`relative w-full max-w-md rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl mx-2 transition-all duration-200 ${
            closing ? 'opacity-0 translate-y-4' : 'modal-slide-up'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Frequently Bought Together"
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                Frequently Bought Together
              </h2>
              {triggerProduct && (
                <p className="text-xs text-zinc-500 mt-0.5">
                  Often bought with{' '}
                  <span className="font-semibold text-zinc-700">
                    {triggerProduct}
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-all hover:bg-zinc-200 hover:text-zinc-600 active:scale-90"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── Content ── */}
          <div className="px-5 pb-2 max-h-[60vh] overflow-y-auto scrollbar-hide">
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center gap-3 py-10">
                <div className="relative h-10 w-10">
                  <div className="absolute inset-0 rounded-full border-2 border-zinc-200" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#0C831F] animate-spin" />
                </div>
                <p className="text-sm text-zinc-500">Finding pairings...</p>
              </div>
            )}

            {/* Error — silent */}
            {error && !loading && null}

            {/* Match Banner */}
            {!loading && !error && hasData && (
              <div className="mb-4 rounded-xl bg-gradient-to-r from-[#0C831F]/5 to-[#F8CB46]/10 border border-[#0C831F]/10 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#0C831F] px-2.5 py-0.5 text-[10px] font-bold text-white">
                      MATCH
                    </span>
                    <span className="text-xs text-zinc-600">
                      Top pairings for{' '}
                      <span className="font-semibold text-zinc-800">
                        {triggerProduct}
                      </span>
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0C831F]">
                    {data.recommendations.length} items
                  </span>
                </div>
              </div>
            )}

            {/* Recommendation Cards */}
            {!loading && !error && hasData && (
              <div className="flex flex-col gap-2">
                {data.recommendations.map((rec, index) => {
                  const scorePct = Math.round(rec.score * 100);
                  const isAdded = justAdded === rec.name;

                  return (
                    <div
                      key={rec.name}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-300 modal-fade-item ${
                        isAdded
                          ? 'border-[#0C831F]/30 bg-[#0C831F]/5 scale-[1.01]'
                          : 'border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm'
                      }`}
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {/* Rank badge */}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                          index === 0
                            ? 'bg-[#0C831F] text-white shadow-sm'
                            : index === 1
                            ? 'bg-[#0C831F]/80 text-white'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-800 truncate">
                          {rec.name}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#0C831F] to-[#F8CB46] transition-all duration-700 ease-out"
                              style={{ width: `${scorePct}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-[#0C831F] shrink-0">
                            {scorePct}%
                          </span>
                        </div>
                      </div>

                      {/* ADD button */}
                      <button
                        onClick={() => handleAddItem(rec.name)}
                        disabled={isAdded}
                        className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition-all active:scale-90 ${
                          isAdded
                            ? 'bg-[#0C831F]/10 text-[#0C831F] cursor-default'
                            : 'bg-[#0C831F] text-white hover:bg-[#0a6e19] shadow-sm'
                        }`}
                      >
                        {isAdded ? '✓ Added' : 'ADD'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Attribution */}
            {!loading && !error && hasData && (
              <p className="mt-5 text-center text-[10px] text-zinc-400">
                Based on analysis of 1,000 orders using Market Basket Analysis
              </p>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-5 py-3 border-t border-zinc-100">
            <button
              onClick={handleClose}
              className="w-full rounded-lg border border-zinc-200 py-2.5 text-sm font-medium text-zinc-500 transition-all hover:bg-zinc-50 hover:text-zinc-700 active:scale-[0.98]"
            >
              No thanks, continue shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
