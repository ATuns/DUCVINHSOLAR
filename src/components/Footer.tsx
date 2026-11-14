import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Phone, MapPin, Mail, ShieldCheck, Lock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { companyInfo, setIsAdminModalOpen, isAdmin } = useApp();

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 text-xs border-t border-slate-800">
      {/* Upper Footer: 4 Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand & Full Legal Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sun className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white font-heading tracking-tight">
                Đức Vinh <span className="text-emerald-400">Solar</span>
              </span>
            </div>

            <div className="text-slate-400 leading-relaxed space-y-1.5 text-xs">
              <p className="font-bold text-white uppercase text-xs">
                {companyInfo.legalName}
              </p>
              <p>
                <strong>Mã số thuế:</strong> <span className="font-mono text-emerald-400">{companyInfo.taxCode}</span>
              </p>
              <p>
                <strong>Người đại diện pháp luật:</strong> <span className="text-white font-semibold">{companyInfo.representative}</span>
              </p>
              <p>
                <strong>Tình trạng:</strong> <span className="text-emerald-400 font-medium">{companyInfo.status}</span>
              </p>
            </div>

            {/* Affiliated Units */}
            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-900">
              <span className="font-semibold text-slate-300 block mb-1">
                Các đơn vị liên kết &amp; đại diện:
              </span>
              <ul className="space-y-1">
                {companyInfo.affiliatedUnits.map((u, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => scrollTo('products-section')} className="hover:text-emerald-400 transition-colors text-left">
                  Tấm Pin Năng Lượng Mặt Trời
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('products-section')} className="hover:text-emerald-400 transition-colors text-left">
                  Biến Tần Inverter Hybrid
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('products-section')} className="hover:text-emerald-400 transition-colors text-left">
                  Pin Lưu Trữ Lithium LiFePO4
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('products-section')} className="hover:text-emerald-400 transition-colors text-left">
                  Đèn Đường Năng Lượng Mặt Trời
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Khám Phá &amp; Dịch Vụ
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => scrollTo('projects-section')} className="hover:text-emerald-400 transition-colors text-left">
                  Dự Án Áp Mái Tiêu Biểu
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('company-section')} className="hover:text-emerald-400 transition-colors text-left">
                  Hồ Sơ Doanh Nghiệp
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('contact-section')} className="hover:text-emerald-400 transition-colors text-left">
                  Đăng Ký Khảo Sát Tận Nơi
                </button>
              </li>
              <li>
                <a
                  href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors block"
                >
                  Tư Vấn Kỹ Thuật Zalo
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>{isAdmin ? 'Quản Trị Kho (Admin)' : 'Đăng Nhập Admin'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Tax Addresses */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kho Tổng &amp; Liên Hệ
            </h4>
            <div className="space-y-2.5 text-slate-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block">
                    <strong className="text-slate-200">Kho tổng:</strong> {companyInfo.warehouseAddress}
                  </span>
                  <a
                    href={companyInfo.warehouseMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-emerald-400 font-semibold hover:text-emerald-300 underline"
                  >
                    Xem vị trí Google Maps Kho Tổng &rarr;
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div>
                    <strong>Hotline / Zalo:</strong>{' '}
                    <a href={`tel:${companyInfo.hotlineZalo}`} className="text-emerald-400 font-mono font-bold hover:underline">
                      {companyInfo.hotlineZalo}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Email:</strong> {companyInfo.email}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">Giao hàng hỏa tốc:</span> Nhận hàng tại kho Hóc Môn hoặc bàn giao kỹ thuật tận công trình tại TP.HCM và các tỉnh miền Nam.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright and Badges */}
      <div className="border-t border-slate-900 bg-slate-950 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Đức Vinh Solar – CÔNG TY TNHH DỊCH VỤ VIỄN THÔNG ĐỨC VINH. All Rights Reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-400">
            <span>MST: {companyInfo.taxCode}</span>
            <span>·</span>
            <span>Hotline: {companyInfo.hotlineZalo}</span>
            <span>·</span>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="text-slate-400 hover:text-emerald-400 underline"
            >
              Cổng Quản Trị
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
