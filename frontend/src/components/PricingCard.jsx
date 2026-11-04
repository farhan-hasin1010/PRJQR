import React, { useState, useEffect } from 'react';

export default function PricingCard({ openRazorpay, openLemonSqueezy }) {
  // Base price in USD (must match your Lemon Squeezy product)
  const USD_PRICE = 4.99;
  
  // Real-time exchange rate (fallback to 96.3 if offline)
  const [exchangeRate, setExchangeRate] = useState(96.3);
  const [paymentMethod, setPaymentMethod] = useState('global'); // 'global' (Lemon Squeezy) | 'upi' (Razorpay)

  // Optional: fetch real-time conversion rate on mount
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data?.rates?.INR) {
          setExchangeRate(data.rates.INR);
        }
      })
      .catch(() => console.log('Using fallback exchange rate'));
  }, []);

    const inrEquivalent = (USD_PRICE * exchangeRate).toFixed(2);

    const handleCheckout = () => {
        if (paymentMethod === 'global') {
            openLemonSqueezy();
        } else {
            // Calculate rounded INR equivalent (e.g. 4.99 * ~96.3 ≈ 480)
            const calculatedAmount = Math.round(USD_PRICE * exchangeRate);
            openRazorpay(true, calculatedAmount);
        }
    };

  const features = [
    { title: 'Unlimited static QR codes', tip: 'Static codes never expire and have no scan limits' },
    { title: 'Unlimited dynamic QR codes', tip: 'Create and update destination URLs anytime' },
    { title: 'Unlimited scans and downloads', tip: 'No monthly scan throttling or download caps' },
    { title: 'Advanced scan analytics', tip: 'Track total scans, device types, and locations' },
  ];

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden font-sans">
      {/* 1. Header Banner */}
      <div className="bg-[#1e88e5] text-white text-center py-2.5 font-bold text-sm tracking-wide">
        Regular Pro
      </div>

      <div className="p-6 sm:p-8 flex flex-col items-center">
        {/* 2. Main Price (USD) */}
        <div className="text-center mt-1">
          <div className="text-5xl font-black text-slate-900 tracking-tight">
            US${USD_PRICE}
          </div>
          <div className="text-slate-500 font-medium text-sm mt-1">Month</div>
        </div>

        {/* 3. Converted Equivalent Pill (Matches Reference) */}
        <div className="mt-4 px-7 py-1.5 border border-slate-700 text-slate-800 text-xs font-bold rounded-full select-none">
          INR {inrEquivalent}
        </div>

        {/* 4. Payment Gateway Toggle */}
        <div className="flex items-center justify-center gap-3 mt-5 text-xs font-semibold text-slate-600">
          <span className={paymentMethod === 'global' ? 'text-slate-900 font-bold' : 'text-slate-400'}>
            Global Card / Apple Pay
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={paymentMethod === 'upi'}
            onClick={() => setPaymentMethod(paymentMethod === 'global' ? 'upi' : 'global')}
            className="w-12 h-6 flex items-center rounded-full p-1 bg-[#0284c7] transition-colors"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                paymentMethod === 'upi' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>

          <span className={paymentMethod === 'upi' ? 'text-slate-900 font-bold' : 'text-slate-400'}>
            UPI (₹ India)
          </span>
        </div>

        {/* 5. Unified Buy Now Button */}
        <button
          onClick={handleCheckout}
          className="w-full mt-6 py-3.5 px-6 rounded-xl bg-[#00a86b] hover:bg-[#008f5b] active:scale-[0.98] text-white font-bold text-base transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          Buy now
        </button>

        {/* 6. Subtext */}
        <p className="text-[12px] text-slate-500 text-center leading-relaxed mt-4 px-2">
          For solo creators, small teams, and startups. Modest number of dynamic QR codes with unlimited scans and core analytics.
        </p>

        {/* 7. Checklist with Clean Dividers */}
        <div className="w-full mt-6 pt-2 border-t border-slate-100 flex flex-col">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-center gap-2.5">
                <svg
                  className="w-5 h-5 text-[#00a86b] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-xs sm:text-[13px] font-medium text-slate-700">
                  {item.title}
                </span>
              </div>

              {/* Tooltip Icon */}
              <div className="relative group cursor-pointer ml-2">
                <span className="w-4 h-4 rounded-full border border-slate-400 text-slate-500 text-[10px] font-bold flex items-center justify-center">
                  ?
                </span>
                <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-20">
                  {item.tip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}