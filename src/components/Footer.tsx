import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Sun, Phone, MapPin, Mail, ShieldCheck, Lock, Heart } from 'lucide-react';
import { EXPO_EASE } from './MotionPrimitives';

export const Footer: React.FC = () => {
  const { companyInfo, setIsAdminModalOpen, isAdmin } = useApp();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.6, ease: EXPO_EASE }}
      className="mx-auto max-w-7xl w-[calc(100%-1.25rem)] sm:w-[calc(100%-2.5rem)] lg:w-[calc(100%-3rem)] mb-8 mt-6 rounded-3xl sm:rounded-[2.25rem] glass-bubble-dark text-slate-200 text-xs overflow-hidden"
    >
      {/* Upper Footer: 4 Columns */}
      <div className="px-4 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-7 sm:gap-8 lg:gap-10">
          {/* Column 1: Brand & Full Legal Identity */}
          <div className="lg:col-span-5 space-y-4 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/30 border border-white/40 shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white font-heading tracking-tight">
                Đức Vinh <span className="text-emerald-300">Solar</span>
              </span>
            </div>

            <div className="text-emerald-100/85 leading-relaxed space-y-1.5 text-xs break-words">
              <p className="font-bold text-white uppercase text-xs break-words">
                {companyInfo.legalName}
              </p>
              <p>
                <strong>Mã số thuế:</strong> <span className="font-mono text-emerald-300">{companyInfo.taxCode}</span>
              </p>
              <p>
                <strong>Người đại diện pháp luật:</strong> <span className="text-white font-semibold">{companyInfo.representative}</span>
              </p>
              <p>
                <strong>Tình trạng:</strong> <span className="text-emerald-300 font-medium">{companyInfo.status}</span>
              </p>
            </div>

            {/* Affiliated Units */}
            <div className="pt-3 text-[11px] text-emerald-100/80 border-t border-white/15">
              <span className="font-semibold text-white block mb-1.5">
                Các đơn vị liên kết &amp; đại diện:
              </span>
              <ul className="space-y-1">
                {companyInfo.affiliatedUnits.map((u, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-emerald-100 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                    <span className="break-words min-w-0">{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-2 text-emerald-100/80">
              <li>
                <button onClick={() => scrollTo('products-section')} className="hover:text-emerald-300 transition-colors text-left">
                  Tấm Pin Năng Lượng Mặt Trời
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('products-section')} className="hover:text-emerald-300 transition-colors text-left">
                  Biến Tần Inverter Hybrid
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('products-section')} className="hover:text-emerald-300 transition-colors text-left">
                  Pin Lưu Trữ Lithium LiFePO4
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('products-section')} className="hover:text-emerald-300 transition-colors text-left">
                  Đèn Đường Năng Lượng Mặt Trời
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation Links */}
          <div className="lg:col-span-2 space-y-3 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Khám Phá &amp; Dịch Vụ
            </h4>
            <ul className="space-y-2 text-emerald-100/80">
              <li>
                <button onClick={() => scrollTo('projects-section')} className="hover:text-emerald-300 transition-colors text-left">
                  Dự Án Áp Mái Tiêu Biểu
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('company-section')} className="hover:text-emerald-300 transition-colors text-left">
                  Hồ Sơ Doanh Nghiệp
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('contact-section')} className="hover:text-emerald-300 transition-colors text-left">
                  Đăng Ký Khảo Sát Tận Nơi
                </button>
              </li>
              <li>
                <a
                  href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors block"
                >
                  Tư Vấn Kỹ Thuật Zalo
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Tax Addresses */}
          <div className="lg:col-span-3 space-y-3 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kho Tổng &amp; Liên Hệ
            </h4>
            <div className="space-y-2.5 text-emerald-100/85 text-xs">
              <div className="flex items-start gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="block break-words">
                    <strong className="text-white">Kho tổng:</strong> {companyInfo.warehouseAddress}
                  </span>
                  <a
                    href={companyInfo.warehouseMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-emerald-300 font-semibold hover:text-emerald-200 underline break-words"
                  >
                    Xem vị trí Google Maps Kho Tổng &rarr;
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 min-w-0">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 min-w-0">
                  <div>
                    <strong>Hotline / Zalo:</strong>{' '}
                    <a href={`tel:${companyInfo.hotlineZalo}`} className="text-emerald-300 font-mono font-bold hover:underline">
                      {companyInfo.hotlineZalo}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 min-w-0">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="break-all min-w-0">
                  <strong>Email:</strong> {companyInfo.email}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-[11px] text-emerald-100 break-words">
                <span className="text-emerald-300 font-semibold">Giao hàng hỏa tốc:</span> Nhận hàng tại kho Hóc Môn hoặc bàn giao kỹ thuật tận công trình tại TP.HCM và các tỉnh miền Nam.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright and Badges */}
      <div className="border-t border-white/15 bg-black/20 py-4 px-4 sm:px-8 lg:px-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-emerald-200/80 text-[11px] text-center sm:text-left">
          <div className="break-words">
            &copy; {new Date().getFullYear()} Đức Vinh Solar – CÔNG TY TNHH DỊCH VỤ VIỄN THÔNG ĐỨC VINH. All Rights Reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-emerald-100/90 shrink-0">
            <span>MST: {companyInfo.taxCode}</span>
            <span>·</span>
            <span>Hotline: {companyInfo.hotlineZalo}</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
