import React from 'react';

const tickerItems = [
  { ico: '🌿', txt: 'CODE PURE15 → 15% OFF' },
  { ico: '🐄', txt: 'A2 Gir Bilona Ghee' },
  { ico: '🚚', txt: 'Free Delivery ₹999+' },
  { ico: '🧈', txt: 'Farm-Direct · Gujarat' },
  { ico: '🔬', txt: '70+ NABL Lab Tests' },
  { ico: '🪙', txt: 'Earn Purity Coins' },
  { ico: '🎁', txt: 'Combo Packs · Save 19%' },
  { ico: '🌾', txt: 'Bilona Method · Ancient' },
  { ico: '⭐', txt: '4.9★ · 12,000+ Reviews' },
];

export const Ticker: React.FC = () => {
  return (
    <div className="bg-[#0D3520] py-2.5 flex items-center text-xs font-extrabold text-white tracking-wider overflow-hidden relative z-50">
      <div className="flex items-center ticker-animation whitespace-nowrap will-change-transform">
        {[...Array(2)].map((_, idx) => (
          <React.Fragment key={idx}>
            {tickerItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3.5 px-7">
                <span>{item.ico}</span>
                <strong>{item.txt}</strong>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
