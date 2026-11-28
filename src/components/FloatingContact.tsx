import React, { useState, useEffect } from 'react';
import { MapPin, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export const FloatingContact: React.FC = () => {
  const { companyInfo } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 items-center">
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="w-11 h-11 bg-white border border-[#DEDEDE] shadow-md text-[#1C1C1C] hover:text-[#FF7C00] hover:border-[#FFBD00] rounded-full flex items-center justify-center transition-colors"
            title="Lên đầu trang"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Google Maps Button linked to companyInfo.warehouseMapUrl */}
      <motion.a
        href={companyInfo.warehouseMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-white border border-[#DEDEDE] shadow-md rounded-2xl flex flex-col items-center justify-center relative group hover:border-[#FFBD00] transition-colors"
        title={`Xem bản đồ tới kho: ${companyInfo.warehouseAddress}`}
      >
        <div className="w-7 h-7 flex items-center justify-center">
          <MapPin className="w-6 h-6 text-[#FF7C00]" fill="#FFF2D0" />
        </div>
        <span className="text-[10px] font-black text-[#1C1C1C] mt-0.5">Tới kho</span>
      </motion.a>

      {/* Zalo Button linked to companyInfo.hotlineZalo */}
      <motion.a
        href={`https://zalo.me/${companyInfo.hotlineZalo}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#FFBD00] border border-[#FFBD00] shadow-md rounded-2xl flex flex-col items-center justify-center relative group overflow-hidden"
        title={`Chat Zalo: ${companyInfo.hotlineZalo}`}
      >
        <div className="bg-white text-[#1C1C1C] font-black text-xs px-1.5 py-0.5 rounded-md mb-0.5 shadow-2xs">
          ZALO
        </div>
        <div className="flex space-x-0.5">
          <span className="w-1 h-1 bg-[#1C1C1C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1 h-1 bg-[#1C1C1C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1 h-1 bg-[#1C1C1C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </motion.a>
    </div>
  );
};
