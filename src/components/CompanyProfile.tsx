import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, ShieldCheck, UserCheck, FileCheck, MapPin, Phone, Mail, Clock, Award } from 'lucide-react';

export const CompanyProfile: React.FC = () => {
  const { companyInfo } = useApp();

  return (
    <section id="company-section" className="py-8 sm:py-14 bg-transparent">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="glass-bubble rounded-3xl sm:rounded-[2rem] p-5 sm:p-8 mb-6 sm:mb-8 max-w-4xl overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-3 max-w-full">
            <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Pháp Lý &amp; Thông Tin Doanh Nghiệp</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading break-words">
            Giới Thiệu Về Đức Vinh Solar
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed break-words">
            Đơn vị hoạt động hợp pháp, đầy đủ tư cách pháp nhân và mã số thuế minh bạch. Cam kết chất lượng chuẩn mực trong từng dự án điện mặt trời và thiết bị tiết kiệm điện năng.
          </p>
        </div>

        {/* Corporate Legal Card & Representative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Main Legal Card */}
          <div className="lg:col-span-7 glass-bubble rounded-3xl sm:rounded-[2rem] p-5 sm:p-8 overflow-hidden min-w-0">
            <div className="flex flex-wrap items-start justify-between pb-5 sm:pb-6 border-b border-white/60 gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Pháp nhân chính thức
                </span>
                <h3 className="text-base sm:text-xl font-bold text-slate-900 font-heading mt-1 break-words">
                  {companyInfo.legalName}
                </h3>
                <div className="text-xs text-slate-500 mt-1 break-words">
                  Tên thương mại: <strong className="text-slate-800">{companyInfo.tradeName}</strong>
                </div>
              </div>

              {/* Status Badge */}
              <div className="px-3 py-1 rounded-full bg-emerald-100/80 backdrop-blur-md text-emerald-800 text-xs font-bold border border-emerald-300/80 shadow-xs flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span>{companyInfo.status}</span>
              </div>
            </div>

            {/* Grid of Legal Information */}
            <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-white/60">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Mã số thuế:
                </span>
                <span className="sm:col-span-2 font-mono font-bold text-slate-900 text-sm break-words">
                  {companyInfo.taxCode}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-white/60">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Người đại diện:
                </span>
                <span className="sm:col-span-2 font-bold text-emerald-800 uppercase text-sm break-words">
                  {companyInfo.representative}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-white/60">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  Địa chỉ đăng ký thuế:
                </span>
                <span className="sm:col-span-2 text-slate-800 leading-relaxed font-medium break-words">
                  {companyInfo.taxAddress}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-white/60">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Địa chỉ hoạt động:
                </span>
                <span className="sm:col-span-2 text-slate-800 leading-relaxed font-medium break-words">
                  {companyInfo.officeAddress}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-white/60">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  Địa chỉ Kho tổng:
                </span>
                <div className="sm:col-span-2 space-y-1 min-w-0">
                  <div className="text-slate-900 leading-relaxed font-bold break-words">
                    {companyInfo.warehouseAddress}
                  </div>
                  <a
                    href={companyInfo.warehouseMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline break-words"
                  >
                    <span>Mở vị trí Kho tổng trên Google Maps &rarr;</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2 border-b border-white/60">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  Hotline &amp; Zalo chính:
                </span>
                <a
                  href={`tel:${companyInfo.hotlineZalo}`}
                  className="sm:col-span-2 font-mono font-bold text-emerald-700 hover:underline text-sm"
                >
                  {companyInfo.hotlineZalo}
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 py-2">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  Thời gian làm việc:
                </span>
                <span className="sm:col-span-2 text-slate-800 font-medium break-words">
                  {companyInfo.workingHours}
                </span>
              </div>
            </div>
          </div>

          {/* Affiliated Units & Legal Ecosystem */}
          <div className="lg:col-span-5 space-y-6 min-w-0">
            {/* Associated units card */}
            <div className="glass-bubble-dark text-white rounded-3xl sm:rounded-[2rem] p-5 sm:p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-semibold text-emerald-300 mb-3 max-w-full">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="truncate">HỆ THỐNG PHÁP NHÂN ĐỒNG HÀNH</span>
              </div>

              <h4 className="text-base font-bold text-white font-heading">
                Đơn Vị Đại Diện &amp; Trực Thuộc
              </h4>
              <p className="text-xs text-emerald-100/90 mt-1 mb-5 leading-relaxed break-words">
                Ngoài ra, người đại diện <strong>{companyInfo.representative}</strong> còn đồng thời đại diện cho các doanh nghiệp và đơn vị thành viên:
              </p>

              <div className="space-y-3">
                {companyInfo.affiliatedUnits.map((unit, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/12 border border-white/25 backdrop-blur-md flex items-start gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] min-w-0"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white uppercase tracking-wide break-words">
                        {unit}
                      </div>
                      <div className="text-[11px] text-emerald-200 mt-0.5 break-words">
                        Đại diện pháp luật: {companyInfo.representative}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-200">
                <span>Xuất hóa đơn VAT tài chính</span>
                <span className="font-semibold text-white">100% Đúng Quy Định</span>
              </div>
            </div>

            {/* Quality Commitment Card */}
            <div className="glass-bubble rounded-3xl sm:rounded-[2rem] p-5 sm:p-6 overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cam Kết Chất Lượng Đức Vinh Solar</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span className="break-words">Thiết bị pin và biến tần mới 100%, bảo hành chính hãng từ 5 đến 30 năm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span className="break-words">Đội ngũ kỹ thuật hỗ trợ khắc phục sự cố tại công trình trong vòng 24 giờ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span className="break-words">Hỗ trợ trọn đời về giám sát sản lượng điện qua ứng dụng di động.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
