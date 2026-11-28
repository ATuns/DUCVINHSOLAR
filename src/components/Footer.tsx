import React from 'react';
import { motion } from 'motion/react';
import { Sun, Phone, MapPin, ShieldCheck, Truck, Award, Clock, Mail, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { companyInfo, navigateToPage } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-2">
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-[#FEFBF3] via-[#FAF5EA] to-white border border-[#DEDEDE] shadow-xs text-[#363636] rounded-[32px] overflow-hidden"
      >
        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
            {/* Company Info */}
            <div className="lg:col-span-5">
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="bg-[#FFBD00] p-2 rounded-xl">
                  <Sun className="h-6 w-6 text-[#1C1C1C]" />
                </div>
                <span className="text-xl font-black text-[#1C1C1C] tracking-tight uppercase">
                  ĐỨC VINH <span className="text-[#FF7C00]">SOLAR</span>
                </span>
              </div>
              <p className="text-xs font-extrabold text-[#1C1C1C] mb-1.5 uppercase">
                {companyInfo.legalName}
              </p>
              <p className="text-xs text-[#747474] mb-4 leading-relaxed max-w-md">
                Mã số thuế: <strong className="text-[#1C1C1C] font-mono">{companyInfo.taxCode}</strong> · Đại diện pháp luật:{' '}
                <strong className="text-[#1C1C1C]">{companyInfo.representative}</strong>
                <br />
                Chuyên phân phối sỉ &amp; lẻ tấm pin năng lượng mặt trời, biến tần (Inverter), pin lưu trữ Lithium và phụ kiện lắp đặt chính hãng.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-white border border-[#DEDEDE] text-[#1C1C1C]">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#FF7C00]" /> Hàng chính hãng 100%
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-white border border-[#DEDEDE] text-[#1C1C1C]">
                  <Award className="w-3.5 h-3.5 mr-1 text-[#FFBD00]" /> Đầy đủ CO / CQ
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-black text-[#1C1C1C] uppercase tracking-widest mb-4">
                DANH MỤC TRANG
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    onClick={() => navigateToPage('products')}
                    className="text-[#363636] hover:text-[#FF7C00] transition-colors font-semibold"
                  >
                    Sản phẩm điện mặt trời
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToPage('projects')}
                    className="text-[#363636] hover:text-[#FF7C00] transition-colors font-semibold"
                  >
                    Dự án tiêu biểu
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToPage('blog')}
                    className="text-[#363636] hover:text-[#FF7C00] transition-colors font-semibold"
                  >
                    Blog &amp; kiến thức Solar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToPage('company')}
                    className="text-[#363636] hover:text-[#FF7C00] transition-colors font-semibold"
                  >
                    Hồ sơ pháp lý công ty
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateToPage('contact')}
                    className="text-[#363636] hover:text-[#FF7C00] transition-colors font-semibold"
                  >
                    Liên hệ &amp; báo giá sỉ
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info from Admin companyInfo */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-black text-[#1C1C1C] uppercase tracking-widest mb-4">
                THÔNG TIN LIÊN HỆ
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start space-x-2.5">
                  <MapPin className="h-4 w-4 text-[#FF7C00] shrink-0 mt-0.5" />
                  <span className="text-[#363636] text-xs leading-relaxed">
                    <strong className="text-[#1C1C1C]">Văn phòng:</strong> {companyInfo.officeAddress}
                  </span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <MapPin className="h-4 w-4 text-[#FFBD00] shrink-0 mt-0.5" />
                  <div className="text-[#363636] text-xs leading-relaxed">
                    <strong className="text-[#1C1C1C]">Kho tổng:</strong> {companyInfo.warehouseAddress}{' '}
                    <a
                      href={companyInfo.warehouseMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-[#FF7C00] font-bold hover:underline ml-1"
                    >
                      <span>(Xem bản đồ)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Phone className="h-4 w-4 text-[#FF7C00] shrink-0" />
                  <span className="text-[#363636] text-xs">
                    Hotline / Zalo:{' '}
                    <a
                      href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1C1C1C] font-black font-mono hover:text-[#FF7C00] transition-colors"
                    >
                      {companyInfo.hotlineZalo}
                    </a>
                  </span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Mail className="h-4 w-4 text-[#FF7C00] shrink-0" />
                  <span className="text-[#363636] text-xs">
                    Email:{' '}
                    <a
                      href={`mailto:${companyInfo.email}`}
                      className="text-[#1C1C1C] font-bold hover:text-[#FF7C00] transition-colors"
                    >
                      {companyInfo.email}
                    </a>
                  </span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Clock className="h-4 w-4 text-[#FF7C00] shrink-0" />
                  <span className="text-[#363636] text-xs">{companyInfo.workingHours}</span>
                </li>
              </ul>

              <div className="mt-4 p-3.5 bg-white border border-[#DEDEDE] rounded-2xl flex items-center space-x-3">
                <Truck className="h-5 w-5 text-[#FF7C00] shrink-0" />
                <p className="text-xs text-[#363636]">
                  <strong className="text-[#1C1C1C]">Giao hàng nhanh toàn quốc:</strong> Hỗ trợ bốc xếp tại kho tổng Hóc Môn &amp; vận chuyển tận nơi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-8 py-4 border-t border-[#DEDEDE] flex flex-col sm:flex-row justify-between items-center text-xs text-[#747474]">
          <p>
            &copy; {new Date().getFullYear()} {companyInfo.legalName}. Bảo lưu mọi quyền.
          </p>
          <p className="mt-1 sm:mt-0 font-bold text-[#1C1C1C]">
            MST: {companyInfo.taxCode} — www.solarducvinh.com
          </p>
        </div>
      </motion.footer>
    </div>
  );
};
