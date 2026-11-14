import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, ShieldCheck, UserCheck, FileCheck, MapPin, Phone, Mail, Clock, Award } from 'lucide-react';

export const CompanyProfile: React.FC = () => {
  const { companyInfo } = useApp();

  return (
    <section id="company-section" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Pháp Lý &amp; Thông Tin Doanh Nghiệp</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading">
            Giới Thiệu Về Đức Vinh Solar
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Đơn vị hoạt động hợp pháp, đầy đủ tư cách pháp nhân và mã số thuế minh bạch. Cam kết chất lượng chuẩn mực trong từng dự án điện mặt trời và thiết bị tiết kiệm điện năng.
          </p>
        </div>

        {/* Corporate Legal Card & Representative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Legal Card */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-start justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Pháp nhân chính thức
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading mt-1">
                  {companyInfo.legalName}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Tên thương mại: <strong className="text-slate-800">{companyInfo.tradeName}</strong>
                </div>
              </div>

              {/* Status Badge */}
              <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>{companyInfo.status}</span>
              </div>
            </div>

            {/* Grid of Legal Information */}
            <div className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-200/70">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Mã số thuế:
                </span>
                <span className="sm:col-span-2 font-mono font-bold text-slate-900 text-sm">
                  {companyInfo.taxCode}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-200/70">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Người đại diện:
                </span>
                <span className="sm:col-span-2 font-bold text-emerald-800 uppercase text-sm">
                  {companyInfo.representative}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-200/70">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  Địa chỉ đăng ký thuế:
                </span>
                <span className="sm:col-span-2 text-slate-800 leading-relaxed font-medium">
                  {companyInfo.taxAddress}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-200/70">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Địa chỉ hoạt động:
                </span>
                <span className="sm:col-span-2 text-slate-800 leading-relaxed font-medium">
                  {companyInfo.officeAddress}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-200/70">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  Địa chỉ Kho tổng:
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <div className="text-slate-900 leading-relaxed font-bold">
                    {companyInfo.warehouseAddress}
                  </div>
                  <a
                    href={companyInfo.warehouseMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    <span>Mở vị trí Kho tổng trên Google Maps &rarr;</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-slate-200/70">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  Thời gian làm việc:
                </span>
                <span className="sm:col-span-2 text-slate-800 font-medium">
                  {companyInfo.workingHours}
                </span>
              </div>
            </div>
          </div>

          {/* Affiliated Units & Legal Ecosystem */}
          <div className="lg:col-span-5 space-y-6">
            {/* Associated units card */}
            <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>HỆ THỐNG PHÁP NHÂN ĐỒNG HÀNH</span>
              </div>

              <h4 className="text-base font-bold text-white font-heading">
                Đơn Vị Đại Diện &amp; Trực Thuộc
              </h4>
              <p className="text-xs text-emerald-200/80 mt-1 mb-5 leading-relaxed">
                Ngoài ra, người đại diện <strong>{companyInfo.representative}</strong> còn đồng thời đại diện cho các doanh nghiệp và đơn vị thành viên:
              </p>

              <div className="space-y-3">
                {companyInfo.affiliatedUnits.map((unit, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wide">
                        {unit}
                      </div>
                      <div className="text-[11px] text-emerald-300 mt-0.5">
                        Đại diện pháp luật: {companyInfo.representative}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-300">
                <span>Xuất hóa đơn VAT tài chính</span>
                <span className="font-semibold text-white">100% Đúng Quy Định</span>
              </div>
            </div>

            {/* Quality Commitment Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Cam Kết Chất Lượng Đức Vinh Solar</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Thiết bị pin và biến tần mới 100%, bảo hành chính hãng từ 5 đến 30 năm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Đội ngũ kỹ thuật hỗ trợ khắc phục sự cố tại công trình trong vòng 24 giờ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Hỗ trợ trọn đời về giám sát sản lượng điện qua ứng dụng di động.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
