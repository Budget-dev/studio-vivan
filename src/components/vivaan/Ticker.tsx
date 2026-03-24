"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faCow, faTruck, faFlask, faStar, faCoins, faPepperHot, faCookieBite, faCertificate } from '@fortawesome/free-solid-svg-icons';

const tickerItems = [
  { ico: faLeaf, txt: 'CODE PURE15 → 15% OFF' },
  { ico: faCow, txt: 'A2 Gir Bilona Ghee' },
  { ico: faTruck, txt: 'Free Delivery ₹999+' },
  { ico: faFlask, txt: '70+ NABL Lab Tests' },
  { ico: faCoins, txt: 'Earn Purity Coins' },
  { ico: faPepperHot, txt: 'Handmade Pickles' },
  { ico: faCookieBite, txt: 'Artisanal Sweets' },
  { ico: faCertificate, txt: 'Gujarat Farm Direct' },
  { ico: faStar, txt: '4.9★ · 12,000+ Reviews' },
];

export const Ticker: React.FC = () => {
  return (
    <div className="bg-[#0D3520] py-2.5 flex items-center text-xs font-extrabold text-white tracking-wider overflow-hidden relative z-50">
      <div className="flex items-center ticker-animation whitespace-nowrap will-change-transform">
        {[...Array(2)].map((_, idx) => (
          <React.Fragment key={idx}>
            {tickerItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3.5 px-7">
                <FontAwesomeIcon icon={item.ico} className="text-white/60" />
                <strong>{item.txt}</strong>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};