export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-zinc-200 bg-white pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="mb-4 text-2xl font-black tracking-tighter text-[#F8CB46]">
              blinkit{' '}
              <span className="ml-1 text-xs font-bold text-zinc-800">clone</span>
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              Your daily needs delivered in minutes. Built with Next.js, NestJS,
              and Tailwind CSS.
            </p>
            {/* App download badges */}
            <div className="flex gap-3">
              <div className="flex h-10 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 transition-all hover:bg-zinc-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="leading-tight">
                  <div className="text-[8px] text-zinc-400">Download on</div>
                  <div className="text-[10px] font-bold text-white">
                    App Store
                  </div>
                </div>
              </div>
              <div className="flex h-10 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 transition-all hover:bg-zinc-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M5.49 3.15c-.3.3-.43.72-.43 1.16v15.38c0 .44.13.86.43 1.16l.01.01 9.04-8.84v-.02L5.49 3.15zM17.79 15.4l-3.26-3.26 3.26-3.26.01.01c.7-.7.97-1.68.79-2.57-.18-.89-.78-1.6-1.5-2.06l-.01-.01-9.26 9.26 9.26 9.26c.72-.46 1.32-1.17 1.5-2.06.18-.89-.09-1.87-.79-2.57z" />
                </svg>
                <div className="leading-tight">
                  <div className="text-[8px] text-zinc-400">Get it on</div>
                  <div className="text-[10px] font-bold text-white">
                    Google Play
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-zinc-900">
              Useful Links
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-500">
              {['About', 'Careers', 'Blog', 'Press', 'Help'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="transition-colors hover:text-zinc-800"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-zinc-900">
              Categories
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-500">
              {[
                'Vegetables & Fruits',
                'Dairy & Breakfast',
                'Munchies',
                'Cold Drinks',
                'Personal Care',
              ].map((cat) => (
                <li key={cat}>
                  <a
                    href="#"
                    className="transition-colors hover:text-zinc-800"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us + About */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <h4 className="mb-4 text-sm font-bold text-zinc-900">Follow us</h4>
            <div className="mb-6 flex gap-3">
              {[
                { label: 'fb', bg: 'bg-blue-50', color: 'text-blue-600' },
                { label: '𝕏', bg: 'bg-zinc-50', color: 'text-zinc-800' },
                { label: 'in', bg: 'bg-sky-50', color: 'text-sky-700' },
                { label: 'yt', bg: 'bg-red-50', color: 'text-red-600' },
              ].map((soc) => (
                <div
                  key={soc.label}
                  className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full ${soc.bg} text-xs font-bold transition-all hover:scale-110 ${soc.color}`}
                >
                  {soc.label}
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Blinkit Clone is an MVP demonstration project for a Frequently
              Bought Together recommendation system using Market Basket
              Analysis.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-100 pt-6 text-center text-xs text-zinc-400">
          <p>© {currentYear} Blinkit Clone MVP. All rights reserved.</p>
          <p className="mt-1">Built with ❤️ for demonstration purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
