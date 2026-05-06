export function Hero() {
  return (
    <section className="mx-auto mt-4 max-w-7xl px-4 sm:mt-6 animate-fade-in-up">
      {/* Main Large Banner */}
      <div className="relative overflow-hidden rounded-2xl h-[220px] sm:h-[280px] flex items-center mb-4 bg-[#216738]">
        <img src="/images/banners/hero_banner.png" alt="Groceries" className="absolute inset-0 w-full h-full object-cover object-right opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#216738] via-[#216738]/80 to-transparent w-2/3" />
        
        <div className="relative z-10 flex w-full flex-col items-start px-6 py-6 sm:px-12 sm:py-8 max-w-[600px] text-white">
          <h1 className="mb-2 text-[28px] font-black tracking-tight sm:text-[42px] leading-[1.1]">
            Stock up on daily essentials
          </h1>
          <p className="mb-6 text-[15px] sm:text-[20px] leading-snug text-zinc-100 font-medium">
            Get farm-fresh goodness & a range of exotic fruits, vegetables, eggs & more
          </p>
          <button className="rounded-lg bg-white px-5 py-2.5 font-bold text-zinc-900 transition-colors hover:bg-zinc-100">
            Shop Now
          </button>
        </div>
      </div>

      {/* Three small banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Banner 1: Pharmacy */}
        <div className="relative overflow-hidden rounded-2xl h-[160px] flex items-center bg-[#07A4A5]">
          <img src="/images/banners/pharmacy_banner.png" alt="Pharmacy" className="absolute inset-0 w-full h-full object-cover object-right mix-blend-overlay opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07A4A5] via-[#07A4A5] to-transparent w-3/4" />
          <div className="relative z-10 p-5 text-white">
            <h3 className="mb-1 text-[20px] font-black leading-tight">Pharmacy at<br/>your doorstep!</h3>
            <p className="mb-4 text-[13px] opacity-90">Cough syrups, pain<br/>relief sprays & more</p>
            <button className="rounded-md bg-white px-3 py-1.5 text-[12px] font-bold text-[#07A4A5]">Order Now</button>
          </div>
        </div>
        
        {/* Banner 2: Pet Care */}
        <div className="relative overflow-hidden rounded-2xl h-[160px] flex items-center bg-[#F4B733]">
          <img src="/images/banners/pet_banner.png" alt="Pet Care" className="absolute inset-0 w-full h-full object-cover object-right mix-blend-overlay opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4B733] via-[#F4B733] to-transparent w-3/4" />
          <div className="relative z-10 p-5 text-[#3E2312]">
            <h3 className="mb-1 text-[20px] font-black leading-tight">Pet care supplies<br/>at your door</h3>
            <p className="mb-4 text-[13px] text-[#5A351D] font-medium">Food, treats, toys & more</p>
            <button className="rounded-md bg-[#3E2312] px-3 py-1.5 text-[12px] font-bold text-white">Order Now</button>
          </div>
        </div>

        {/* Banner 3: Baby Care */}
        <div className="relative overflow-hidden rounded-2xl h-[160px] flex items-center bg-[#C6D2E0]">
          <img src="/images/banners/baby_banner.png" alt="Baby Care" className="absolute inset-0 w-full h-full object-cover object-right mix-blend-overlay opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#C6D2E0] via-[#C6D2E0] to-transparent w-3/4" />
          <div className="relative z-10 p-5 text-[#2E3640]">
            <h3 className="mb-1 text-[20px] font-black leading-tight">No time for<br/>a diaper run?</h3>
            <p className="mb-4 text-[13px] text-[#4A5461] font-medium">Get baby care essentials</p>
            <button className="rounded-md bg-[#2E3640] px-3 py-1.5 text-[12px] font-bold text-white">Order Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
