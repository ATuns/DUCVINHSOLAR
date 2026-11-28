import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  CheckCircle,
  ExternalLink,
  Building2,
  UserCheck,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScrollReveal } from './MotionPrimitives';

// Build an embeddable Google Maps iframe URL from warehouseMapUrl or warehouseAddress
const buildGoogleMapsEmbedUrl = (mapUrl?: string, warehouseAddress?: string): string => {
  const rawUrl = (mapUrl || '').trim();
  const rawAddr = (warehouseAddress || '').trim();

  // Extract coordinates like 10°53'08.1"N 106°36'15.1"E or @10.8855743,106.6035469 or !3d10.885573!4d106.604192
  const latLng3dMatch = rawUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (latLng3dMatch) {
    return `https://maps.google.com/maps?q=${latLng3dMatch[1]},${latLng3dMatch[2]}&hl=vi&z=17&output=embed`;
  }

  const atLatLngMatch = rawUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atLatLngMatch) {
    return `https://maps.google.com/maps?q=${atLatLngMatch[1]},${atLatLngMatch[2]}&hl=vi&z=17&output=embed`;
  }

  const dmsMatch = (rawAddr + ' ' + decodeURIComponent(rawUrl)).match(
    /(\d+°\d+'[\d.]+"[NS])\s*(\d+°\d+'[\d.]+"[EW])/i
  );
  if (dmsMatch) {
    const query = encodeURIComponent(`${dmsMatch[1]} ${dmsMatch[2]}`);
    return `https://maps.google.com/maps?q=${query}&hl=vi&z=17&output=embed`;
  }

  if (rawAddr) {
    const cleanAddr = rawAddr.replace(/\([^)]*\)/g, '').trim() || rawAddr;
    return `https://maps.google.com/maps?q=${encodeURIComponent(cleanAddr)}&hl=vi&z=16&output=embed`;
  }

  return 'https://maps.google.com/maps?q=10.885573,106.604192&hl=vi&z=17&output=embed';
};

export const ContactSection: React.FC = () => {
  const { companyInfo, submitInquiry, isAdmin, openAdminTab } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    subject: 'Báo giá thiết bị (tấm pin, Inverter, pin lưu trữ)',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mapEmbedUrl = useMemo(
    () => buildGoogleMapsEmbedUrl(companyInfo.warehouseMapUrl, companyInfo.warehouseAddress),
    [companyInfo.warehouseMapUrl, companyInfo.warehouseAddress]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry(
      formData.name,
      formData.phone,
      formData.address,
      formData.message,
      formData.subject
    );
    setIsSubmitted(true);
  };

  return (
    <section id="contact-section" className="py-8 sm:py-14 bg-white transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Heading Bar */}
        <ScrollReveal y={22}>
          <div className="bg-gradient-to-r from-[#FEFBF3] via-[#FAF5EA] to-white border border-[#DEDEDE] shadow-[0_8px_24px_-10px_rgba(28,28,28,0.06)] rounded-[2rem] sm:rounded-[2.25rem] p-5 sm:p-8 mb-6 sm:mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4 overflow-hidden">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7C00] tracking-wider uppercase mb-2.5 px-3 py-1 rounded-full bg-white border border-[#DEDEDE]">
                <Phone className="w-4 h-4 text-[#FF7C00] shrink-0" />
                <span>KÊNH KẾT NỐI TRỰC TIẾP 24/7</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1C1C] font-heading uppercase break-words">
                LIÊN HỆ TƯ VẤN &amp; BÁO GIÁ
              </h2>
              <p className="text-xs sm:text-sm text-[#747474] mt-2 max-w-2xl leading-relaxed break-words">
                Liên hệ trực tiếp với đội ngũ kỹ sư của <strong className="text-[#1C1C1C]">{companyInfo.tradeName}</strong> để được tư vấn cấu hình điện mặt trời chuẩn công suất, nhận báo giá sỉ/lẻ tại kho tổng hoặc đặt lịch khảo sát tận nơi.
              </p>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => openAdminTab('company')}
                className="px-4 py-2.5 bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white text-xs font-bold rounded-full shrink-0 transition-colors shadow-2xs"
              >
                Cập nhật thông tin công ty &amp; kênh liên hệ
              </button>
            )}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column (7 cols): Dynamic Company Contact Channels + Embedded Google Maps */}
          <div className="lg:col-span-7 space-y-6 min-w-0">
            {/* Hotline, Email, Working Hours & Addresses Card */}
            <ScrollReveal y={22} delay={0.05}>
              <div className="bg-white border border-[#DEDEDE] shadow-xs rounded-[2rem] sm:rounded-[2.25rem] p-5 sm:p-7 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DEDEDE]">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7C00]">
                      THÔNG TIN LIÊN HỆ CHÍNH THỨC
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#1C1C1C] mt-0.5 break-words">
                      {companyInfo.legalName}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FFF2D0] border border-[#FFBD00] text-[#1C1C1C] text-xs font-bold font-mono shrink-0">
                    MST: {companyInfo.taxCode}
                  </span>
                </div>

                {/* Primary Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hotline / Zalo */}
                  <a
                    href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-[#FEFBF3] border border-[#FFBD00] hover:bg-[#FFF2D0] transition-colors flex items-start gap-3.5 group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#FFBD00] text-[#1C1C1C] flex items-center justify-center shrink-0 shadow-2xs">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#747474] flex items-center justify-between gap-1">
                        <span>Hotline &amp; Zalo 24/7</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#FF7C00] shrink-0" />
                      </div>
                      <div className="text-lg sm:text-xl font-extrabold text-[#1C1C1C] group-hover:text-[#FF7C00] font-mono mt-0.5 transition-colors">
                        {companyInfo.hotlineZalo}
                      </div>
                      <div className="text-[11px] text-[#747474] mt-0.5 truncate">
                         Đại diện: {companyInfo.representative}
                      </div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#DEDEDE] hover:border-[#FFBD00] hover:bg-[#FEFBF3] transition-colors flex items-start gap-3.5 group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#DEDEDE] text-[#FF7C00] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#747474]">Email liên hệ</div>
                      <div className="text-sm sm:text-base font-extrabold text-[#1C1C1C] group-hover:text-[#FF7C00] mt-1 break-all transition-colors">
                        {companyInfo.email}
                      </div>
                      <div className="text-[11px] text-[#747474] mt-0.5">
                        Tiếp nhận hồ sơ &amp; báo giá dự án
                      </div>
                    </div>
                  </a>
                </div>

                {/* Detailed Addresses & Working Hours */}
                <div className="space-y-3.5 pt-2 text-xs sm:text-sm">
                  <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#DEDEDE] flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#FF7C00] shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wide">
                        ĐỊA CHỈ KHO TỔNG (KÈM TỌA ĐỘ):
                      </div>
                      <div className="text-sm font-bold text-[#1C1C1C] mt-1 leading-relaxed break-words">
                        {companyInfo.warehouseAddress}
                      </div>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <a
                          href={companyInfo.warehouseMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white text-xs font-bold transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Mở chỉ đường tới kho tổng trên Google Maps</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#DEDEDE] flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-[#FF7C00] shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wide">
                        ĐỊA CHỈ VĂN PHÒNG HOẠT ĐỘNG:
                      </div>
                      <div className="text-xs sm:text-sm text-[#363636] font-medium mt-1 leading-relaxed break-words">
                        {companyInfo.officeAddress}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#F8F8F8] border border-[#DEDEDE] flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#FF7C00] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-[#747474]">Giờ làm việc</div>
                        <div className="text-xs font-bold text-[#1C1C1C] break-words">
                          {companyInfo.workingHours}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F8F8F8] border border-[#DEDEDE] flex items-center gap-3">
                      <UserCheck className="w-4 h-4 text-[#FF7C00] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-[#747474]">Tình trạng hoạt động</div>
                        <div className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#6FBA84] shrink-0" />
                          <span>{companyInfo.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Interactive Embedded Google Maps Card for Warehouse */}
            <ScrollReveal y={22} delay={0.1}>
              <div className="bg-white border border-[#DEDEDE] shadow-xs rounded-[2rem] sm:rounded-[2.25rem] p-4 sm:p-5 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#DEDEDE]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#FFF2D0] border border-[#FFBD00] flex items-center justify-center text-[#FF7C00] shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#1C1C1C] uppercase truncate">
                        BẢN ĐỒ GOOGLE MAPS VỊ TRÍ KHO TỔNG ĐỨC VINH SOLAR
                      </h3>
                      <p className="text-[11px] text-[#747474] truncate">
                        {companyInfo.warehouseAddress}
                      </p>
                    </div>
                  </div>

                  <a
                    href={companyInfo.warehouseMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở Google Maps lớn</span>
                  </a>
                </div>

                <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#DEDEDE] bg-[#F8F8F8]">
                  <iframe
                    title="Bản đồ vị trí kho tổng Đức Vinh Solar"
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column (5 cols): Quote & Consultation Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 bg-white border border-[#DEDEDE] shadow-xs rounded-[2rem] sm:rounded-[2.25rem] p-5 sm:p-7"
          >
            {isSubmitted ? (
              <div className="text-center py-10">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#FFBD00] mb-5">
                  <CheckCircle className="h-9 w-9 text-[#1C1C1C]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1C1C1C] mb-2">
                  Đã gửi yêu cầu tư vấn &amp; báo giá!
                </h3>
                <p className="text-xs sm:text-sm text-[#747474] mb-6 max-w-md mx-auto leading-relaxed">
                  Cảm ơn quý khách đã liên hệ với <strong className="text-[#1C1C1C]">{companyInfo.tradeName}</strong>. Yêu cầu của quý khách đã được chuyển vào mục quản trị đơn hàng, kỹ sư sẽ liên hệ lại sớm nhất.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-extrabold text-xs sm:text-sm text-[#1C1C1C] bg-[#FFBD00] hover:bg-[#FF7C00] hover:text-white transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Chat Zalo ngay: {companyInfo.hotlineZalo}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        address: '',
                        subject: 'Báo giá thiết bị (tấm pin, Inverter, pin lưu trữ)',
                        message: ''
                      });
                    }}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-full font-bold text-xs sm:text-sm text-[#1C1C1C] bg-[#F8F8F8] border border-[#DEDEDE] hover:border-[#FFBD00] transition-colors"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#DEDEDE]">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFBD00] flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-[#1C1C1C]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1C1C1C] uppercase">
                      GỬI YÊU CẦU TƯ VẤN &amp; BÁO GIÁ
                    </h3>
                    <p className="text-xs text-[#747474]">
                      Điền thông tin bên dưới hoặc gọi trực tiếp <strong className="text-[#FF7C00] font-mono">{companyInfo.hotlineZalo}</strong>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
                      HỌ VÀ TÊN KHÁCH HÀNG *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nhập họ và tên của bạn..."
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#F8F8F8] border border-[#DEDEDE] rounded-xl focus:ring-2 focus:ring-[#FFBD00]/40 focus:border-[#FFBD00] outline-none text-[#1C1C1C] placeholder-[#747474] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
                      SỐ ĐIỆN THOẠI / ZALO *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Nhập số điện thoại để kỹ sư liên hệ lại..."
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#F8F8F8] border border-[#DEDEDE] rounded-xl focus:ring-2 focus:ring-[#FFBD00]/40 focus:border-[#FFBD00] outline-none text-[#1C1C1C] placeholder-[#747474] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
                      ĐỊA CHỈ LẮP ĐẶT / KHU VỰC (TÙY CHỌN)
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="VD: Hóc Môn, Quận 12, Bình Dương..."
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#F8F8F8] border border-[#DEDEDE] rounded-xl focus:ring-2 focus:ring-[#FFBD00]/40 focus:border-[#FFBD00] outline-none text-[#1C1C1C] placeholder-[#747474] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
                      HẠNG MỤC QUAN TÂM
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#F8F8F8] border border-[#DEDEDE] rounded-xl focus:ring-2 focus:ring-[#FFBD00]/40 focus:border-[#FFBD00] outline-none text-[#1C1C1C] transition-all"
                    >
                      <option value="Báo giá thiết bị (tấm pin, Inverter, pin lưu trữ)">
                        Báo giá thiết bị (tấm pin, Inverter, pin lưu trữ)
                      </option>
                      <option value="Tư vấn lắp đặt điện mặt trời hộ gia đình / biệt thự">
                        Tư vấn lắp đặt điện mặt trời hộ gia đình / biệt thự
                      </option>
                      <option value="Tư vấn điện mặt trời nhà xưởng & doanh nghiệp (C&I)">
                        Tư vấn điện mặt trời nhà xưởng &amp; doanh nghiệp (C&amp;I)
                      </option>
                      <option value="Đăng ký báo giá sỉ đại lý / anh em thợ lắp đặt">
                        Đăng ký báo giá sỉ đại lý / anh em thợ lắp đặt
                      </option>
                      <option value="Đèn năng lượng mặt trời & phụ kiện Solar">
                        Đèn năng lượng mặt trời &amp; phụ kiện Solar
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
                      GHI CHÚ NHU CẦU CHI TIẾT *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Nhập tên sản phẩm, số lượng cần lấy tại kho hoặc mức tiền điện hàng tháng của gia đình..."
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#F8F8F8] border border-[#DEDEDE] rounded-xl focus:ring-2 focus:ring-[#FFBD00]/40 focus:border-[#FFBD00] outline-none text-[#1C1C1C] placeholder-[#747474] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-[#FFBD00] hover:bg-[#FF7C00] text-[#1C1C1C] hover:text-white font-black text-xs sm:text-sm rounded-full transition-all flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Send className="h-4 w-4" />
                    <span>Gửi yêu cầu tư vấn &amp; báo giá</span>
                  </button>
                </form>

                {/* Direct Zalo Quick Callout at bottom of form */}
                <div className="mt-5 pt-4 border-t border-[#DEDEDE] flex items-center justify-between gap-2 text-xs">
                  <span className="text-[#747474]">Cần phản hồi ngay lập tức?</span>
                  <a
                    href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-[#FF7C00] hover:text-[#1C1C1C] underline"
                  >
                    Nhắn Zalo: {companyInfo.hotlineZalo} &rarr;
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
