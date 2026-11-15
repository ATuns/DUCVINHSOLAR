import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, MapPin, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { companyInfo, submitInquiry } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [productType, setProductType] = useState('Điện mặt trời áp mái gia đình');
  const [note, setNote] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    submitInquiry(name, phone, address, note, productType);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setName('');
      setPhone('');
      setAddress('');
      setNote('');
    }, 4000);
  };

  return (
    <section id="contact-section" className="py-10 sm:py-14 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Contact details & Map */}
          <div className="lg:col-span-5">
            <div className="glass-bubble rounded-[2rem] p-5 sm:p-6 mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-emerald-700 tracking-wider uppercase mb-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Kết Nối Trực Tiếp</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Liên Hệ &amp; Nhận Báo Giá Dự Án
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Quý khách hàng cần tư vấn kỹ thuật, kiểm tra hàng tại kho hoặc nhận bảng dự toán vật tư theo thiết kế, vui lòng liên hệ ngay với Đức Vinh Solar qua các kênh dưới đây:
              </p>
            </div>

            <div className="space-y-4">
              {/* Hotline Zalo Card */}
              <div className="p-4 sm:p-5 rounded-[1.75rem] glass-bubble flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 border border-white/80 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Hotline / Zalo tư vấn chính:</div>
                    <a
                      href={`tel:${companyInfo.hotlineZalo}`}
                      className="text-base font-extrabold text-emerald-800 hover:text-emerald-950 font-mono tracking-wide"
                    >
                      {companyInfo.hotlineZalo}
                    </a>
                  </div>
                </div>

                <a
                  href={`https://zalo.me/${companyInfo.hotlineZalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full whitespace-nowrap transition-all shadow-md shadow-emerald-600/20"
                >
                  Chat Zalo
                </a>
              </div>

              {/* Central Warehouse Address & Google Maps Card */}
              <div className="p-4 sm:p-5 rounded-[1.85rem] glass-bubble space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-white/80 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                      Địa Chỉ Kho Tổng &amp; Văn Phòng Giao Dịch:
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                      {companyInfo.warehouseAddress}
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <a
                        href={companyInfo.warehouseMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Xem Chỉ Đường Google Maps Kho Tổng &rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Embedded Google Maps for Central Warehouse (10.885573, 106.604192) */}
                <div className="rounded-2xl overflow-hidden border border-white/80 bg-slate-100 h-44 w-full shadow-inner">
                  <iframe
                    title="Bản đồ Kho tổng Đức Vinh Solar"
                    src="https://maps.google.com/maps?q=10.885573,106.604192&hl=vi&z=17&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Working Hours & Email Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-[1.5rem] glass-bubble flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 border border-white/80">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Giờ làm việc:</div>
                    <div className="text-xs font-bold text-slate-800">
                      {companyInfo.workingHours}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-[1.5rem] glass-bubble flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 border border-white/80">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-slate-500 font-medium">Email liên hệ:</div>
                    <a
                      href={`mailto:${companyInfo.email}`}
                      className="text-xs font-bold text-slate-800 hover:text-emerald-700 truncate block"
                    >
                      {companyInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Submission Form */}
          <div className="lg:col-span-7 glass-bubble rounded-[2.25rem] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Gửi Yêu Cầu Khảo Sát &amp; Dự Toán Chi Phí
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Điền thông tin dưới đây, kỹ sư Đức Vinh Solar sẽ lập phương án kỹ thuật và phản hồi trong vòng 30 phút:
            </p>

            {sentSuccess ? (
              <div className="p-6 rounded-[1.75rem] bg-emerald-50/85 backdrop-blur-md border border-emerald-300 text-center animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Gửi Yêu Cầu Thành Công!
                </h4>
                <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
                  Cảm ơn Quý khách! Đội ngũ Đức Vinh Solar đã nhận được thông tin và sẽ liên hệ lại qua số điện thoại để báo giá chi tiết.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Họ và Tên của Quý khách <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-white/75 backdrop-blur-md border border-white/90 rounded-full shadow-inner focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Số Điện Thoại / Zalo Nhận Báo Giá <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0938 288 876"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-white/75 backdrop-blur-md border border-white/90 rounded-full shadow-inner focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Khu Vực Thi Công / Tỉnh Thành
                    </label>
                    <input
                      type="text"
                      placeholder="Hóc Môn, Q.12, Bình Dương..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-white/75 backdrop-blur-md border border-white/90 rounded-full shadow-inner focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Hạng Mục Cần Tư Vấn
                    </label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-white/75 backdrop-blur-md border border-white/90 rounded-full shadow-inner focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                    >
                      <option value="Điện mặt trời áp mái hộ gia đình">Điện mặt trời áp mái hộ gia đình (3kW - 15kW)</option>
                      <option value="Hệ thống điện mặt trời lưu trữ Hybrid ESS">Hệ thống Hybrid lưu trữ ESS (Tự chủ 24/7)</option>
                      <option value="Điện mặt trời nhà xưởng & doanh nghiệp">Điện mặt trời nhà xưởng &amp; doanh nghiệp (50kW - 500kW)</option>
                      <option value="Thiết bị tiết kiệm điện PowerSaver công nghiệp">Thiết bị tiết kiệm điện PowerSaver công nghiệp</option>
                      <option value="Đèn đường năng lượng mặt trời công trình">Đèn đường năng lượng mặt trời công trình</option>
                      <option value="Mua lẻ vật tư tấm pin & Inverter chính hãng">Mua sỉ/lẻ tấm pin Solar &amp; Inverter chính hãng</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Ghi Chú Nhu Cầu Cụ Thể (Mức tiền điện hiện tại, diện tích mái...)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Tiền điện hàng tháng khoảng 4 triệu, cần tư vấn hệ thống có lưu trữ dự phòng cúp điện..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3 text-xs bg-white/75 backdrop-blur-md border border-white/90 rounded-2xl shadow-inner focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-full shadow-[0_8px_22px_rgba(16,185,129,0.32),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi Yêu Cầu Nhận Báo Giá Nhanh</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
