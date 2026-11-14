import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, MessageCircle, FileText, ChevronUp } from 'lucide-react';

export const FloatingContact: React.FC = () => {
  const { companyInfo } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
          title="Lên đầu trang"
          aria-label="Lên đầu trang"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating Central Warehouse Map Button */}
      <a
        href={companyInfo.warehouseMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700 shadow-lg transition-all hover:scale-105 text-xs"
        title="Mở bản đồ Google Maps Kho Tổng"
      >
        <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center">
          Map
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-emerald-300 font-semibold leading-none">Bản đồ Kho tổng</span>
          <span className="text-[11px] font-bold tracking-tight leading-tight">137 Thới Tam Thôn 9</span>
        </div>
      </a>

      {/* Floating Zalo Button with distinctive Vietnamese Zalo branding and phone */}
      <a
        href={`https://zalo.me/${companyInfo.hotlineZalo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/30 transition-all hover:scale-105"
        title={`Chat Zalo: ${companyInfo.hotlineZalo}`}
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>

        {/* Zalo icon representation */}
        <div className="w-6 h-6 rounded-full bg-white text-emerald-700 font-extrabold text-[11px] flex items-center justify-center tracking-tighter">
          Zalo
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-emerald-100 font-medium leading-none">Tư vấn trực tuyến</span>
          <span className="text-xs font-extrabold font-mono tracking-tight leading-tight">{companyInfo.hotlineZalo}</span>
        </div>
      </a>
    </div>
  );
};
