import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Zap, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { ScrollReveal, EXPO_EASE } from './MotionPrimitives';

export const Hero: React.FC = () => {
  const { companyInfo, selectCatalogFilter, navigateToPage } = useApp();

  const scrollToProducts = () => {
    selectCatalogFilter('all', 'all', true);
  };

  const scrollToProjects = () => {
    navigateToPage('projects');
  };

  return (
    <section className="py-5 sm:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <ScrollReveal y={28} scale={0.985} amount={0.08}>
          <div className="relative overflow-hidden bg-gradient-to-r from-[#FEFBF3] via-[#FAF5EA] to-white border border-[#DEDEDE] shadow-[0_8px_24px_-10px_rgba(28,28,28,0.06)] rounded-[2rem] sm:rounded-[2.5rem] text-[#1C1C1C] p-5 sm:p-9 lg:p-12">
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
                {/* Left Column: Headline and Content */}
                <ScrollReveal
                  y={18}
                  delay={0.08}
                  className="lg:col-span-7 flex flex-col items-start min-w-0"
                >
                  <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-bold text-[#747474] mb-3 sm:mb-4 tracking-wide px-3.5 py-1.5 rounded-full bg-white border border-[#DEDEDE]">
                    <span className="text-[#1C1C1C]">ĐỨC VINH SOLAR</span>
                    <span aria-hidden="true" className="text-[#B3B3B3]">
                      ·
                    </span>
                    <span className="text-[#FF7C00]">MST: {companyInfo.taxCode}</span>
                    <span aria-hidden="true" className="text-[#B3B3B3]">
                      ·
                    </span>
                    <span>ĐÔNG THẠNH, HÓC MÔN, TP.HCM</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight text-[#1C1C1C] uppercase mb-4 sm:mb-6 break-words text-balance">
                    GIẢI PHÁP ĐIỆN NĂNG LƯỢNG MẶT TRỜI &amp;{' '}
                    <span className="text-[#FF7C00]">LƯU TRỮ CHUYÊN NGHIỆP</span>
                  </h2>

                  <p className="text-sm sm:text-base lg:text-lg text-[#747474] leading-relaxed mb-6 sm:mb-8 max-w-2xl font-normal break-words">
                    Đức Vinh Solar chuyên phân phối chính hãng tấm pin mặt trời công suất lớn, biến
                    tần Hybrid thông minh và hệ thống pin lưu trữ ESS giúp tối ưu hóa chi phí tiền
                    điện cho hộ gia đình, biệt thự và nhà máy sản xuất.
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <button
                      onClick={scrollToProducts}
                      className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold rounded-full bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white flex items-center justify-center gap-2 group transition-colors shadow-2xs"
                    >
                      <span>Xem chi tiết sản phẩm</span>
                      <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={scrollToProjects}
                      className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-semibold text-[#1C1C1C] rounded-full bg-white border border-[#DEDEDE] hover:bg-[#FFF2D0] hover:border-[#FFBD00] flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Dự án tiêu biểu</span>
                    </button>
                  </div>

                  {/* Quick trust metrics */}
                  <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#DEDEDE] flex flex-wrap items-center gap-2.5 text-xs text-[#363636]">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#DEDEDE]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF7C00] shrink-0" />
                      <span>Không giá ảo – tư vấn đúng công suất</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#DEDEDE]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF7C00] shrink-0" />
                      <span>Hỗ trợ pháp lý &amp; thủ tục đấu nối EVN</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#DEDEDE]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF7C00] shrink-0" />
                      <span>Kho sẵn tại Hóc Môn – giao hỏa tốc</span>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Right Column: Visual Showcase Card */}
                <ScrollReveal y={22} delay={0.16} className="lg:col-span-5 min-w-0">
                  <div className="bg-white border border-[#DEDEDE] shadow-sm rounded-3xl sm:rounded-[2rem] p-4 sm:p-6 relative overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#DEDEDE]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#FFBD00] flex items-center justify-center text-[#1C1C1C] shrink-0">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-[#1C1C1C] uppercase break-words">
                            HỆ SINH THÁI NĂNG LƯỢNG TOÀN DIỆN
                          </h3>
                          <p className="text-[11px] sm:text-xs text-[#747474]">
                            Cam kết hiệu năng &amp; độ bền vượt trội
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="px-3 py-1 rounded-full bg-[#FFF2D0] border border-[#FFBD00] text-[11px] font-mono text-[#1C1C1C] font-bold uppercase">
                          TIER 1 SOLAR
                        </span>
                      </div>
                    </div>

                    {/* Highlighting core capabilities */}
                    <div className="mt-4 sm:mt-5 space-y-3">
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8F8F8] border border-[#DEDEDE] flex items-start gap-3">
                        <div className="p-2 rounded-full bg-[#FFBD00] text-[#1C1C1C] shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wide break-words">
                            TẤM PIN HIỆU SUẤT ĐỈNH 22.5% - 23.0%
                          </h4>
                          <p className="text-xs text-[#747474] mt-0.5 leading-relaxed break-words">
                            Công nghệ N-Type TOPCon &amp; HPBC mới nhất từ Longi, Jinko, Canadian
                            Solar, bảo hành hiệu suất 25–30 năm.
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8F8F8] border border-[#DEDEDE] flex items-start gap-3">
                        <div className="p-2 rounded-full bg-[#FFBD00] text-[#1C1C1C] shrink-0 mt-0.5">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wide break-words">
                            INVERTER HYBRID &amp; LƯU TRỮ LIFEPO4
                          </h4>
                          <p className="text-xs text-[#747474] mt-0.5 leading-relaxed break-words">
                            Chuyển mạch UPS siêu tốc &lt; 4ms, an toàn chống cháy nổ, tự chủ điện
                            năng 24/7 không phụ thuộc lưới điện.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom quick contact hotline in hero */}
                    <div className="mt-4 sm:mt-5 pt-3.5 border-t border-[#DEDEDE] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[#747474]">Tư vấn kỹ sư trực tiếp:</span>
                      <a
                        href={`tel:${companyInfo.hotlineZalo}`}
                        className="px-3 py-1 rounded-full bg-[#FEFBF3] border border-[#DEDEDE] font-mono font-bold text-[#FF7C00] hover:text-[#1C1C1C] text-xs sm:text-sm tracking-wide transition-colors"
                      >
                        {companyInfo.hotlineZalo}
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* 4-column KPI strip below hero split */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#DEDEDE] grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: 0.05, ease: EXPO_EASE }}
                  whileHover={{ y: -4 }}
                  className="p-4 sm:p-5 rounded-3xl bg-white border border-[#DEDEDE] shadow-2xs min-w-0 overflow-hidden"
                >
                  <div className="text-lg sm:text-2xl xl:text-3xl font-extrabold text-[#FF7C00] font-mono-nums break-words">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#1C1C1C] mt-1 break-words">
                    Chính hãng Tier 1
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#747474] mt-0.5 break-words">
                    Đầy đủ CO, CQ, hóa đơn VAT
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: 0.11, ease: EXPO_EASE }}
                  whileHover={{ y: -4 }}
                  className="p-4 sm:p-5 rounded-3xl bg-white border border-[#DEDEDE] shadow-2xs min-w-0 overflow-hidden"
                >
                  <div className="text-lg sm:text-2xl xl:text-3xl font-extrabold text-[#1C1C1C] font-mono-nums break-words">
                    25 - 30 NĂM
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#1C1C1C] mt-1 break-words">
                    Bảo hành tuyến tính
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#747474] mt-0.5 break-words">
                    Cam kết công suất phát &ge; 88%
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: 0.17, ease: EXPO_EASE }}
                  whileHover={{ y: -4 }}
                  className="p-4 sm:p-5 rounded-3xl bg-white border border-[#DEDEDE] shadow-2xs min-w-0 overflow-hidden"
                >
                  <div className="text-lg sm:text-2xl xl:text-3xl font-extrabold text-[#FF7C00] font-mono-nums break-words">
                    10% - 25%
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#1C1C1C] mt-1 break-words">
                    Tiết kiệm điện thực tế
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#747474] mt-0.5 break-words">
                    Đo kiểm bằng đồng hồ công tơ
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: 0.23, ease: EXPO_EASE }}
                  whileHover={{ y: -4 }}
                  className="p-4 sm:p-5 rounded-3xl bg-white border border-[#DEDEDE] shadow-2xs min-w-0 overflow-hidden"
                >
                  <div className="text-base sm:text-2xl xl:text-3xl font-extrabold text-[#1C1C1C] font-mono-nums break-words">
                    0938.288.876
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[#FF7C00] mt-1 break-words">
                    Zalo hỗ trợ 24/7
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#747474] mt-0.5 break-words">
                    Khảo sát &amp; báo giá tận nơi
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
