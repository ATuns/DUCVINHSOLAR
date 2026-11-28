import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  FileCheck,
  MapPin,
  Phone,
  Clock,
  Award
} from 'lucide-react';
import { ScrollReveal } from './MotionPrimitives';

export const CompanyProfile: React.FC = () => {
  const { companyInfo } = useApp();

  return (
    <section id="company-section" className="py-8 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Heading Bar */}
        <ScrollReveal y={22}>
          <div className="bg-gradient-to-r from-[#FEFBF3] via-[#FAF5EA] to-white border border-[#DEDEDE] shadow-[0_8px_24px_-10px_rgba(28,28,28,0.06)] rounded-[2rem] sm:rounded-[2.25rem] p-5 sm:p-8 mb-6 sm:mb-8 max-w-4xl overflow-hidden">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7C00] tracking-wider uppercase mb-2.5 px-3 py-1 rounded-full bg-white border border-[#DEDEDE]">
              <Building2 className="w-4 h-4 text-[#FF7C00] shrink-0" />
              <span className="truncate">PHÁP LÝ &amp; THÔNG TIN DOANH NGHIỆP</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1C1C] font-heading uppercase break-words">
              GIỚI THIỆU VỀ ĐỨC VINH SOLAR
            </h2>
            <p className="text-xs sm:text-sm text-[#747474] mt-2 leading-relaxed break-words">
              Đơn vị hoạt động hợp pháp, đầy đủ tư cách pháp nhân và mã số thuế minh bạch. Cam kết
              chất lượng chuẩn mực trong từng dự án điện mặt trời và thiết bị tiết kiệm điện năng.
            </p>
          </div>
        </ScrollReveal>

        {/* Corporate Legal Card & Representative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Main Legal Card */}
          <ScrollReveal
            y={24}
            delay={0.06}
            className="lg:col-span-7 bg-white border border-[#DEDEDE] shadow-xs rounded-[2rem] sm:rounded-[2.25rem] p-5 sm:p-8 overflow-hidden min-w-0"
          >
            <div className="flex flex-wrap items-start justify-between pb-5 sm:pb-6 border-b border-[#DEDEDE] gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF7C00]">
                  PHÁP NHÂN CHÍNH THỨC
                </span>
                <h3 className="text-base sm:text-xl font-bold text-[#1C1C1C] font-heading mt-1 break-words">
                  {companyInfo.legalName}
                </h3>
                <div className="text-xs text-[#747474] mt-1 break-words">
                  Tên thương mại:{' '}
                  <strong className="text-[#1C1C1C]">{companyInfo.tradeName}</strong>
                </div>
              </div>

              {/* Status indicator */}
              <div className="px-3.5 py-1.5 rounded-full bg-[#FFF2D0] border border-[#FFBD00] text-[#1C1C1C] text-xs font-bold flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#FF7C00]" />
                <span>{companyInfo.status}</span>
              </div>
            </div>

            {/* Grid of Legal Information */}
            <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-[#DEDEDE]">
                <span className="font-semibold text-[#747474] flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#FF7C00] shrink-0" />
                  Mã số thuế:
                </span>
                <span className="sm:col-span-2 font-mono font-bold text-[#FF7C00] text-sm break-words">
                  {companyInfo.taxCode}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-[#DEDEDE]">
                <span className="font-semibold text-[#747474] flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#FF7C00] shrink-0" />
                  Người đại diện:
                </span>
                <span className="sm:col-span-2 font-bold text-[#1C1C1C] uppercase text-sm break-words">
                  {companyInfo.representative}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-[#DEDEDE]">
                <span className="font-semibold text-[#747474] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#FF7C00] shrink-0" />
                  Địa chỉ đăng ký thuế:
                </span>
                <span className="sm:col-span-2 text-[#1C1C1C] leading-relaxed font-medium break-words">
                  {companyInfo.taxAddress}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-[#DEDEDE]">
                <span className="font-semibold text-[#747474] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#FF7C00] shrink-0" />
                  Địa chỉ hoạt động:
                </span>
                <span className="sm:col-span-2 text-[#1C1C1C] leading-relaxed font-medium break-words">
                  {companyInfo.officeAddress}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-[#DEDEDE]">
                <span className="font-semibold text-[#747474] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#FF7C00] shrink-0" />
                  Địa chỉ kho tổng:
                </span>
                <div className="sm:col-span-2 space-y-1 min-w-0">
                  <div className="text-[#1C1C1C] leading-relaxed font-bold break-words">
                    {companyInfo.warehouseAddress}
                  </div>
                  <a
                    href={companyInfo.warehouseMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF7C00] hover:text-[#1C1C1C] underline break-words"
                  >
                    <span>Mở vị trí kho tổng trên Google Maps &rarr;</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-[#DEDEDE]">
                <span className="font-semibold text-[#747474] flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#FF7C00] shrink-0" />
                  Hotline &amp; Zalo chính:
                </span>
                <a
                  href={`tel:${companyInfo.hotlineZalo}`}
                  className="sm:col-span-2 font-mono font-bold text-[#FF7C00] hover:underline text-sm"
                >
                  {companyInfo.hotlineZalo}
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2">
                <span className="font-semibold text-[#747474] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FF7C00] shrink-0" />
                  Thời gian làm việc:
                </span>
                <span className="sm:col-span-2 text-[#1C1C1C] font-medium break-words">
                  {companyInfo.workingHours}
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Affiliated Units & Legal Ecosystem */}
          <div className="lg:col-span-5 space-y-6 min-w-0">
            {/* Associated units card */}
            <ScrollReveal y={24} delay={0.12}>
              <div className="bg-gradient-to-br from-[#FEFBF3] via-[#FAF5EA] to-white border border-[#DEDEDE] shadow-xs text-[#1C1C1C] rounded-[2rem] sm:rounded-[2.25rem] p-5 sm:p-7 relative overflow-hidden">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7C00] mb-3 max-w-full px-3 py-1 rounded-full bg-white border border-[#DEDEDE]">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#FF7C00]" />
                  <span className="truncate">HỆ THỐNG PHÁP NHÂN ĐỒNG HÀNH</span>
                </div>

                <h4 className="text-base font-bold text-[#1C1C1C] font-heading uppercase">
                  ĐƠN VỊ ĐẠI DIỆN &amp; TRỰC THUỘC
                </h4>
                <p className="text-xs text-[#747474] mt-1 mb-5 leading-relaxed break-words">
                  Ngoài ra, người đại diện{' '}
                  <strong className="text-[#1C1C1C]">{companyInfo.representative}</strong> còn đồng
                  thời đại diện cho các doanh nghiệp và đơn vị thành viên:
                </p>

                <div className="space-y-3">
                  {companyInfo.affiliatedUnits.map((unit, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-[#DEDEDE] flex items-start gap-3 min-w-0"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#FFBD00] text-[#1C1C1C] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wide break-words">
                          {unit}
                        </div>
                        <div className="text-[11px] text-[#747474] mt-0.5 break-words">
                          Đại diện pháp luật: {companyInfo.representative}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[#DEDEDE] flex flex-wrap items-center justify-between gap-2 text-xs text-[#747474]">
                  <span>Xuất hóa đơn VAT tài chính</span>
                  <span className="font-bold text-[#FF7C00] uppercase">100% ĐÚNG QUY ĐỊNH</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Quality Commitment Card */}
            <ScrollReveal y={22} delay={0.16}>
              <div className="bg-white border border-[#DEDEDE] shadow-xs rounded-[2rem] sm:rounded-[2.25rem] p-5 sm:p-6 overflow-hidden">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1C1C1C] uppercase mb-3">
                  <Award className="w-4 h-4 text-[#FFBD00] shrink-0" />
                  <span>CAM KẾT CHẤT LƯỢNG ĐỨC VINH SOLAR</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#747474]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7C00] font-bold shrink-0">✓</span>
                    <span className="break-words">
                      Thiết bị pin và biến tần mới 100%, bảo hành chính hãng từ 5 đến 30 năm.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7C00] font-bold shrink-0">✓</span>
                    <span className="break-words">
                      Đội ngũ kỹ thuật hỗ trợ khắc phục sự cố tại công trình trong vòng 24 giờ.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF7C00] font-bold shrink-0">✓</span>
                    <span className="break-words">
                      Hỗ trợ trọn đời về giám sát sản lượng điện qua ứng dụng di động.
                    </span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
