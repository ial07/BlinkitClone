export function Hero() {
  return (
    <section className="mx-auto mt-4 max-w-7xl px-4 sm:mt-6 animate-fade-in-up">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl min-h-[180px] sm:min-h-[260px] flex items-center">
        {/* Background gradient — Blinkit-inspired warm green/yellow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E6F2E8] via-[#F4F6F9] to-[#FFF8E1]" />

        {/* Decorative blobs */}
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F8CB46]/30 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-[#0C831F]/10 blur-3xl" />
        <div className="absolute right-1/3 top-1/3 h-32 w-32 rounded-full bg-blue-100/40 blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex w-full items-center justify-between px-5 py-6 sm:px-12 sm:py-8">
          <div className="max-w-lg">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#0C831F]/10 px-3 py-1 text-[10px] sm:text-xs font-bold text-[#0C831F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0C831F] animate-pulse-dot" />
              Now delivering in 8 minutes
            </div>
            <h1 className="mb-3 text-[26px] font-black tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              Your daily needs,{" "}
              <span className="text-[#0C831F]">super fast</span>
            </h1>
            <p className="text-sm font-medium text-zinc-600 sm:text-lg">
              Get fresh groceries, snacks & more delivered to your doorstep in
              minutes.
            </p>
          </div>

          {/* Decorative icon — visible on larger screens */}
          <div className="hidden lg:flex h-28 w-28 items-center justify-center rounded-3xl bg-white/70 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0C831F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="text-[10px] font-bold text-zinc-500">
                8 MINS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
