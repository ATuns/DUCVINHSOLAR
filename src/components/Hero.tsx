import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { companyInfo } = useApp();

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    const el = document.getElementById('projects-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden glass-bubble-dark rounded-[2.25rem] text-white p-7 sm:p-12 lg:p-14">
          {/* Decorative ambient solar bubble glows */}
          <div className="absolute -top-20 right-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-10 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Headline and Content */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-300 mb-4 tracking-wide">
                  <span>ĐỨC VINH SOLAR</span>
                  <span aria-hidden="true" className="text-emerald-400">·</span>
                  <span>MST: {companyInfo.taxCode}</span>
                  <span aria-hidden="true" className="text-emerald-400">·</span>
                  <span>ĐÔNG THẠNH, HÓC MÔN, TP.HCM</span>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight text-white mb-6 text-balance">
                  Giải Pháp Điện Năng Lượng Mặt Trời &amp;{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300">
                    Lưu Trữ Chuyên Nghiệp
                  </span>
                </h2>

                <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-8 max-w-2xl font-normal">
                  Đức Vinh Solar chuyên phân phối chính hãng tấm pin mặt trời công suất lớn, biến tần Hybrid thông minh và hệ thống pin lưu trữ ESS giúp tối ưu hóa chi phí tiền điện cho hộ gia đình, biệt thự và nhà máy sản xuất.
                </p>

                {/* Action buttons in Bubble style */}
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={scrollToProducts}
                    className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 rounded-full shadow-[0_8px_24px_rgba(16,185,129,0.35),inset_0_1px_2px_rgba(255,255,255,0.8)] transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
                  >
                    <span>Xem Chi Tiết Sản Phẩm</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={scrollToProjects}
                    className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/35 rounded-full backdrop-blur-xl shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>Dự Án Tiêu Biểu</span>
                  </button>
                </div>

                {/* Quick trust metrics */}
                <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-emerald-200">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Không giá ảo – Tư vấn đúng công suất</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Hỗ trợ pháp lý &amp; thủ tục đấu nối EVN</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Kho sẵn tại Hóc Môn – Giao hỏa tốc</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Showcase Frosted Bubble Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/12 rounded-[1.85rem] border border-white/30 p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1.5px_2px_rgba(255,255,255,0.4)] backdrop-blur-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 border-b border-white/15">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-400/25 border border-emerald-300/40 flex items-center justify-center text-emerald-300">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Hệ Sinh Thái Năng Lượng Toàn Diện</h3>
                        <p className="text-xs text-emerald-200/80">Cam kết hiệu năng &amp; độ bền vượt trội</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-emerald-300 font-semibold">Tier 1 Solar</span>
                    </div>
                  </div>

                  {/* Highlighting core capabilities */}
                  <div className="mt-5 space-y-3.5">
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-start gap-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                      <div className="p-2 rounded-full bg-emerald-400/25 text-emerald-300 shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-wide">
                          Tấm Pin Hiệu Suất Đỉnh 22.5% - 23.0%
                        </h4>
                        <p className="text-xs text-emerald-50/90 mt-0.5 leading-relaxed">
                          Công nghệ N-Type TOPCon &amp; HPBC mới nhất từ Longi, Jinko, Canadian Solar, bảo hành hiệu suất 25–30 năm.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-start gap-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                      <div className="p-2 rounded-full bg-teal-400/25 text-teal-200 shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-teal-200 uppercase tracking-wide">
                          Inverter Hybrid &amp; Lưu Trữ LiFePO4
                        </h4>
                        <p className="text-xs text-emerald-50/90 mt-0.5 leading-relaxed">
                          Chuyển mạch UPS siêu tốc &lt; 4ms, an toàn chống cháy nổ, tự chủ điện năng 24/7 không phụ thuộc lưới điện.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom quick contact hotline in hero */}
                  <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
                    <span className="text-emerald-200/90">Tư vấn kỹ sư trực tiếp:</span>
                    <a
                      href={`tel:${companyInfo.hotlineZalo}`}
                      className="font-mono font-bold text-emerald-300 hover:text-white text-sm tracking-wide"
                    >
                      {companyInfo.hotlineZalo}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-column KPI strip below hero split */}
            <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-4 rounded-2xl bg-white/8 border border-white/15 backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono-nums">
                  100%
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                  Chính Hãng Tier 1
                </div>
                <div className="text-xs text-emerald-200/75 mt-0.5">
                  Đầy đủ CO, CQ, hóa đơn VAT
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/8 border border-white/15 backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono-nums">
                  25 - 30 Năm
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                  Bảo Hành Tuyến Tính
                </div>
                <div className="text-xs text-emerald-200/75 mt-0.5">
                  Cam kết công suất phát &ge; 88%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/8 border border-white/15 backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono-nums">
                  10% - 25%
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                  Tiết Kiệm Điện Thực Tế
                </div>
                <div className="text-xs text-emerald-200/75 mt-0.5">
                  Đo kiểm bằng đồng hồ công tơ
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/8 border border-white/15 backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono-nums">
                  0938.288.876
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                  Zalo Hỗ Trợ 24/7
                </div>
                <div className="text-xs text-emerald-200/75 mt-0.5">
                  Khảo sát &amp; báo giá tận nơi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
