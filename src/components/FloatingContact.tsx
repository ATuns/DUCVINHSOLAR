import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ChevronUp, MapPin } from 'lucide-react';
import { EXPO_EASE } from './MotionPrimitives';

export const FloatingContact: React.FC = () => {
  const { companyInfo } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.32, ease: EXPO_EASE }}
      className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto"
    >
      {/* Scroll to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 12, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.85 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.24, ease: EXPO_EASE }}
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full glass-pill text-slate-700 flex items-center justify-center hover:bg-white/95 transition-colors"
            title="Lên đầu trang"
            aria-label="Lên đầu trang"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Central Warehouse Map Button */}
      <motion.a
        href={companyInfo.warehouseMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2, ease: EXPO_EASE }}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full glass-bubble-dark text-white transition-colors text-xs"
        title="Mở bản đồ Google Maps Tới Kho"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xs shrink-0">
          <MapPin className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
        <span className="text-xs font-extrabold tracking-tight leading-none pr-0.5">Tới Kho</span>
      </motion.a>

      {/* Floating Zalo Button with distinctive Vietnamese Zalo branding and phone */}
      <motion.a
        href={`https://zalo.me/${companyInfo.hotlineZalo}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2, ease: EXPO_EASE }}
        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600/85 hover:bg-emerald-600 backdrop-blur-xl border border-white/50 text-white shadow-[0_12px_28px_rgba(5,150,105,0.38),inset_0_1.5px_2px_rgba(255,255,255,0.65)] transition-colors"
        title={`Chat Zalo: ${companyInfo.hotlineZalo}`}
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>

        {/* Zalo icon representation */}
        <div className="w-6 h-6 rounded-full bg-white text-emerald-700 font-extrabold text-[11px] flex items-center justify-center tracking-tighter shadow-xs">
          Zalo
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-emerald-100 font-medium leading-none">Tư vấn trực tuyến</span>
          <span className="text-xs font-extrabold font-mono tracking-tight leading-tight">{companyInfo.hotlineZalo}</span>
        </div>
      </motion.a>
    </motion.div>
  );
};
