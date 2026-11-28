import { Product, ProjectItem, CompanyInfo, CategoryItem, BrandItem, BlogPost } from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'solar-panels',
    label: 'Tấm pin mặt trời',
    shortLabel: 'Tấm pin',
    desc: 'Longi, Jinko, Canadian, JA...',
    iconName: 'Sun'
  },
  {
    id: 'inverters',
    label: 'Biến tần Inverter',
    shortLabel: 'Biến tần',
    desc: 'SolaX, Deye, Solis, Sungrow...',
    iconName: 'Cpu'
  },
  {
    id: 'energy-storage',
    label: 'Pin lưu trữ ESS',
    shortLabel: 'Lưu trữ',
    desc: 'SolaX, Deye, Dyness, LiFePO4...',
    iconName: 'BatteryCharging'
  },
  {
    id: 'solar-lights',
    label: 'Đèn năng lượng',
    shortLabel: 'Đèn Solar',
    desc: 'Đèn đường liền thể, đèn pha...',
    iconName: 'Lightbulb'
  }
];

export const INITIAL_BRANDS: BrandItem[] = [
  // Tấm Pin Mặt Trời
  { id: 'br-longi', name: 'Longi', categoryId: 'solar-panels', origin: 'Tier 1 Thế Giới' },
  { id: 'br-jinko', name: 'Jinko Solar', categoryId: 'solar-panels', origin: 'Tier 1 Thế Giới' },
  { id: 'br-canadian', name: 'Canadian Solar', categoryId: 'solar-panels', origin: 'Tier 1 Thế Giới' },
  { id: 'br-jasolar', name: 'JA Solar', categoryId: 'solar-panels', origin: 'Tier 1 Thế Giới' },
  // Biến Tần Inverter
  { id: 'br-inv-solax', name: 'SolaX', categoryId: 'inverters', origin: 'Chính Hãng Quốc Tế' },
  { id: 'br-inv-deye', name: 'Deye', categoryId: 'inverters', origin: 'Chính Hãng' },
  { id: 'br-inv-solis', name: 'Solis', categoryId: 'inverters', origin: 'Chính Hãng' },
  { id: 'br-inv-sungrow', name: 'Sungrow', categoryId: 'inverters', origin: 'Tier 1 Thế Giới' },
  // Pin Lưu Trữ ESS
  { id: 'br-ess-solax', name: 'SolaX', categoryId: 'energy-storage', origin: 'Chính Hãng' },
  { id: 'br-ess-deye', name: 'Deye', categoryId: 'energy-storage', origin: 'Chính Hãng' },
  { id: 'br-ess-dyness', name: 'Dyness', categoryId: 'energy-storage', origin: 'Chính Hãng' },
  { id: 'br-ess-dvs', name: 'Đức Vinh ESS', categoryId: 'energy-storage', origin: 'Đức Vinh Solar' },
  // Đèn Năng Lượng
  { id: 'br-lgt-dvs', name: 'Đức Vinh Lighting', categoryId: 'solar-lights', origin: 'Đức Vinh Solar' },
  { id: 'br-lgt-jd', name: 'Jindian Solar', categoryId: 'solar-lights', origin: 'Chính Hãng' }
];

export const INITIAL_COMPANY_INFO: CompanyInfo = {
  legalName: 'CÔNG TY TRÁCH NHIỆM HỮU HẠN DỊCH VỤ VIỄN THÔNG ĐỨC VINH',
  tradeName: 'Đức Vinh Solar',
  taxCode: '0311193770',
  taxAddress: '137 Đường Thới Tam Thôn 9, Xã Đông Thạnh, TP Hồ Chí Minh, Việt Nam',
  officeAddress: '137 Đường Thới Tam Thôn 9, Xã Đông Thạnh, Thành phố Hồ Chí Minh, Việt Nam',
  warehouseAddress: '137 Đường Thới Tam Thôn 9, Xã Đông Thạnh, Hóc Môn, TP. Hồ Chí Minh (10°53\'08.1"N 106°36\'15.1"E)',
  warehouseMapUrl: "https://www.google.com/maps/place/10%C2%B053'08.1%22N+106%C2%B036'15.1%22E/@10.8855743,106.6035469,277m/data=!3m2!1e3!4b1!4m13!1m8!3m7!1s0x3174d5ef3c8d7f03:0x85dc86670aef7a4!2zMTM3IMSQLiBUaOG7m2kgVGFtIFRow7RuIDksIMSQw7RuZyBUaOG6oW5oLCBI4buTIENow60gTWluaCA3MDAwMDAsIFZp4buHdCBOYW0!3b1!8m2!3d10.8962963!4d106.6152702!16s%2Fg%2F11nm9lgw6_!3m3!8m2!3d10.885573!4d106.604192?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D",
  status: 'Đang hoạt động',
  representative: 'NGUYỄN QUANG VINH',
  affiliatedUnits: [
    'CHI NHÁNH CÔNG TY TRÁCH NHIỆM HỮU HẠN DỊCH VỤ VIỄN THÔNG ĐỨC VINH',
    'Hộ kinh doanh Nguyễn Quang Vinh Solar'
  ],
  hotlineZalo: '0938288876',
  email: 'ducvinhsolar@gmail.com',
  workingHours: '07:30 - 18:30 (Tất cả các ngày trong tuần)',
  aboutText: 'Đức Vinh Solar tự hào là đơn vị uy tín hàng đầu tại TP. Hồ Chí Minh chuyên tư vấn, thiết kế, phân phối và thi công các hệ thống điện năng lượng mặt trời dân dụng, thương mại và thiết bị tiết kiệm điện năng công nghệ cao. Với đội ngũ kỹ sư giàu kinh nghiệm, chúng tôi cam kết mang lại giải pháp năng lượng xanh bền vững, tối ưu chi phí tiền điện tối đa cho gia đình và doanh nghiệp.'
};

export const INITIAL_PRODUCTS: Product[] = [
  // ================= TẤM PIN MẶT TRỜI (solar-panels) =================
  {
    id: 'prod-01',
    sku: 'DVS-PN-LONGI-580',
    name: 'Tấm Pin Năng Lượng Mặt Trời Longi Hi-MO 6 Explorer 580W',
    category: 'solar-panels',
    brand: 'Longi',
    shortDesc: 'Công nghệ tế bào HPBC N-Type thế hệ mới, hiệu suất chuyển đổi quang năng đạt 22.5%, chống suy hao cực tốt.',
    fullDesc: 'Tấm pin Longi Hi-MO 6 Explorer 580W là dòng pin cao cấp ứng dụng tế bào quang điện hiệu suất cao HPBC thế hệ mới của Longi. Bề mặt không có đường hàn mặt trước giúp tối đa hóa khả năng hấp thụ ánh sáng mặt trời, thẩm mỹ tuyệt đẹp cho mái nhà và nhà xưởng, vận hành bền bỉ ngay cả trong điều kiện nhiệt độ cao và bức xạ yếu.',
    stock: 280,
    unit: 'tấm',
    featured: true,
    svgType: 'panel',
    origin: 'Chính hãng Longi (Đầy đủ CO/CQ)',
    warrantyYears: 15,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất đỉnh (Pmax)', value: '580 Wp' },
      { label: 'Hiệu suất quang năng', value: '22.5%' },
      { label: 'Công nghệ cell', value: 'Monocrystalline HPBC N-Type' },
      { label: 'Điện áp hở mạch (Voc)', value: '51.80 V' },
      { label: 'Dòng điện ngắn mạch (Isc)', value: '14.28 A' },
      { label: 'Điện áp điểm cực đại (Vmp)', value: '43.60 V' },
      { label: 'Dòng điểm cực đại (Imp)', value: '13.31 A' },
      { label: 'Kích thước', value: '2278 x 1134 x 35 mm' },
      { label: 'Trọng lượng', value: '27.5 kg' },
      { label: 'Chuẩn kháng nước/bụi', value: 'Hộp đấu nối IP68, 3 diode bypass' },
      { label: 'Bảo hành vật lý', value: '15 năm' },
      { label: 'Bảo hành hiệu suất tuyến tính', value: '25 năm (≥ 88.9%)' }
    ],
    highlights: [
      'Công nghệ HPBC độc quyền nâng hiệu suất tế bào lên trên 25%',
      'Hệ số suy hao nhiệt độ thấp chỉ -0.29%/°C giúp sinh điện vượt trội mùa hè',
      'Khung nhôm hợp kim Anodized siêu bền, chịu tải gió 2400Pa và tải tuyết 5400Pa',
      'Đầy đủ chứng chỉ TUV, CE, IEC 61215/61730 cho dự án hòa lưới và độc lập'
    ],
    applications: [
      'Hệ thống điện mặt trời áp mái hộ gia đình và biệt thự cao cấp',
      'Hệ thống điện năng lượng mặt trời nhà xưởng, nhà máy, kho bãi',
      'Trang trại nông nghiệp kết hợp điện mặt trời (Agrivoltaics)'
    ]
  },
  {
    id: 'prod-02',
    sku: 'DVS-PN-JINKO-620',
    name: 'Tấm Pin Năng Lượng Mặt Trời Jinko Tiger Neo N-Type 620W (2 Mặt Kính)',
    category: 'solar-panels',
    brand: 'Jinko Solar',
    shortDesc: 'Dòng pin 2 mặt kính (Bifacial) công nghệ TOPCon N-Type, gia tăng sản lượng điện thêm 10% - 25% từ mặt lưng.',
    fullDesc: 'Jinko Tiger Neo 620W ứng dụng công nghệ N-Type TOPCon dẫn đầu thế giới. Cấu trúc hai mặt kính cường lực kép chống chịu thời tiết khắc nghiệt, chống hiện tượng PID và LID triệt để. Tấm pin hấp thụ cả ánh sáng phản xạ từ mái tôn, sàn bê tông hoặc mặt đất giúp tăng tổng sản lượng điện phát ra hàng ngày.',
    stock: 160,
    unit: 'tấm',
    featured: true,
    svgType: 'panel',
    origin: 'Chính hãng Jinko Solar',
    warrantyYears: 15,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất đỉnh (Pmax)', value: '620 Wp' },
      { label: 'Hiệu suất module', value: '23.0%' },
      { label: 'Hệ số 2 mặt (Bifaciality)', value: '80% ± 5%' },
      { label: 'Công nghệ cell', value: 'N-Type TOPCon 16BB' },
      { label: 'Điện áp cực đại (Vmp)', value: '45.85 V' },
      { label: 'Dòng điện cực đại (Imp)', value: '13.53 A' },
      { label: 'Cấu tạo kính', value: 'Kính kép cường lực 2.0mm + 2.0mm chống phản xạ' },
      { label: 'Kích thước', value: '2382 x 1134 x 30 mm' },
      { label: 'Trọng lượng', value: '32.0 kg' },
      { label: 'Bảo hành hiệu suất', value: '30 năm bảo hành hiệu suất tuyến tính' }
    ],
    highlights: [
      'Tăng thêm 15% - 25% sản lượng điện nhờ công nghệ thu quang 2 mặt',
      'Độ suy hao năm đầu tiên cực thấp dưới 1.0%, mỗi năm sau chỉ 0.4%',
      'Chống cháy Class A và khả năng chống ăn mòn sương muối vượt trội'
    ],
    applications: [
      'Nhà xưởng công nghiệp, kho logistic diện tích mái lớn',
      'Hệ thống khung giàn solar trên sân thượng, bãi đỗ xe Solar Carport',
      'Dự án điện mặt trời mặt đất (Ground-mounted)'
    ]
  },
  {
    id: 'prod-03',
    sku: 'DVS-PN-CANADIAN-575',
    name: 'Tấm Pin Năng Lượng Mặt Trời Canadian Solar TOPHiKu6 575W',
    category: 'solar-panels',
    brand: 'Canadian Solar',
    shortDesc: 'Mô-đun TOPCon N-type hiệu suất cao, giảm chi phí LCOE và tăng hiệu quả hoàn vốn đầu tư dự án.',
    fullDesc: 'Canadian Solar TOPHiKu6 575W là giải pháp lý tưởng cho các công trình áp mái dân dụng và thương mại cần mật độ công suất cao trên diện tích mái có hạn. Sử dụng công nghệ chia nửa tế bào (Half-cell) giúp giảm thiểu tối đa tổn hao do bóng râm che khuất một phần.',
    stock: 210,
    unit: 'tấm',
    featured: false,
    svgType: 'panel',
    origin: 'Canadian Solar Chính Hãng',
    warrantyYears: 12,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất đỉnh (Pmax)', value: '575 Wp' },
      { label: 'Hiệu suất quang năng', value: '22.3%' },
      { label: 'Điện áp hở mạch (Voc)', value: '51.4 V' },
      { label: 'Dòng ngắn mạch (Isc)', value: '14.15 A' },
      { label: 'Kích thước', value: '2278 x 1134 x 30 mm' },
      { label: 'Trọng lượng', value: '27.6 kg' },
      { label: 'Tiêu chuẩn bảo vệ', value: 'IP68' },
      { label: 'Bảo hành vật lý', value: '12 năm' },
      { label: 'Bảo hành công suất', value: '30 năm' }
    ],
    highlights: [
      'Công nghệ Half-cell hạn chế điểm nóng (hot-spot) tối đa',
      'Độ bền cơ học vượt chuẩn quốc tế, khung nhôm anode hóa',
      'Tối ưu hóa sản lượng điện ngay cả khi trời nhiều mây'
    ],
    applications: [
      'Mái nhà phố, biệt thự, văn phòng công ty',
      'Nhà máy chế biến, xưởng gia công cơ khí'
    ]
  },
  {
    id: 'prod-13',
    sku: 'DVS-PN-JASOLAR-590',
    name: 'Tấm Pin Năng Lượng Mặt Trời JA Solar DeepBlue 4.0 Pro 590W N-Type',
    category: 'solar-panels',
    brand: 'JA Solar',
    shortDesc: 'Dòng pin DeepBlue 4.0 Pro sử dụng cell Bycium+ hiệu suất 22.8%, vận hành cực kỳ ổn định tại khí hậu nhiệt đới.',
    fullDesc: 'JA Solar DeepBlue 4.0 Pro 590W tích hợp công nghệ đóng gói mật độ cao và tế bào quang điện N-Type Bycium+ tiên tiến, giảm thiểu suy hao quang học và điện trở nội, thích hợp cho cả mái tôn công nghiệp và dân dụng.',
    stock: 190,
    unit: 'tấm',
    featured: false,
    svgType: 'panel',
    origin: 'JA Solar Chính Hãng',
    warrantyYears: 12,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất đỉnh (Pmax)', value: '590 Wp' },
      { label: 'Hiệu suất quang năng', value: '22.8%' },
      { label: 'Công nghệ cell', value: 'N-Type Bycium+ 16BB Half-cell' },
      { label: 'Điện áp hở mạch (Voc)', value: '51.95 V' },
      { label: 'Kích thước', value: '2278 x 1134 x 30 mm' },
      { label: 'Chuẩn bảo vệ', value: 'IP68' }
    ],
    highlights: [
      'Tế bào N-type Bycium+ tuổi thọ cao, không suy hao LID',
      'Khả năng phát điện buổi sáng sớm và chiều muộn vượt trội',
      'Kháng muối biển và amoniac đạt chuẩn IEC'
    ],
    applications: [
      'Điện mặt trời mái nhà dân dụng và thương mại',
      'Trạm năng lượng mặt trời vùng ven biển'
    ]
  },

  // ================= BIẾN TẦN INVERTER (inverters) =================
  {
    id: 'prod-14',
    sku: 'DVS-INV-SOLAX-6KW-HYB',
    name: 'Biến Tần Inverter Hybrid SolaX X1-Hybrid G4 6kW 1 Pha Cao Cấp',
    category: 'inverters',
    brand: 'SolaX',
    shortDesc: 'Thương hiệu Inverter Hybrid cao cấp chuẩn châu Âu, chịu quá tải 150% PV, chuyển mạch UPS dưới 10ms.',
    fullDesc: 'SolaX X1-Hybrid G4 6kW là dòng biến tần lưu trữ thế hệ thứ 4 nổi tiếng toàn cầu của SolaX Power. Thiết bị cho phép lắp vượt công suất giàn pin lên tới 150%, sạc xả nhanh và tích hợp quản lý tải thông minh, hoạt động bền bỉ trong mọi điều kiện thời tiết.',
    stock: 18,
    unit: 'bộ',
    featured: true,
    svgType: 'inverter',
    origin: 'SolaX Power Chính Hãng',
    warrantyYears: 5,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất AC định mức', value: '6000 W (6 kW)' },
      { label: 'Công suất PV tối đa', value: '9000 Wp (150% Oversizing)' },
      { label: 'Số MPPT', value: '2 MPPT độc lập' },
      { label: 'Hiệu suất cực đại', value: '97.8%' },
      { label: 'Thời gian chuyển mạch EPS', value: '< 10 ms' },
      { label: 'Chuẩn bảo vệ', value: 'IP65 lắp đặt trong nhà & ngoài trời' },
      { label: 'Giám sát thông minh', value: 'SolaX Cloud (WiFi / LAN / 4G)' }
    ],
    highlights: [
      'Hỗ trợ lắp vượt công suất tấm pin lên đến 150% và quá tải ngõ ra EPS 120%',
      'Thiết kế tản nhiệt nhôm đúc nguyên khối không quạt ồn',
      'Tương thích hoàn hảo với hệ sinh thái pin lưu trữ SolaX Triple Power'
    ],
    applications: [
      'Biệt thự, nhà phố cao cấp cần độ ổn định và êm ái tuyệt đối',
      'Văn phòng công ty, phòng khám tư nhân'
    ]
  },
  {
    id: 'prod-15',
    sku: 'DVS-INV-SOLAX-15KW-3P',
    name: 'Biến Tần Inverter Hybrid SolaX X3-Ultra 15kW 3 Pha Lưu Trữ Công Suất Lớn',
    category: 'inverters',
    brand: 'SolaX',
    shortDesc: 'Dòng Hybrid 3 pha flagship của SolaX, hỗ trợ 200% công suất PV đầu vào và 2 cổng kết nối pin lưu trữ độc lập.',
    fullDesc: 'SolaX X3-Ultra 15kW mang đến công nghệ quản lý năng lượng AI thông minh, hỗ trợ tải lệch pha 100%, tích hợp chống hồ quang điện AFCI và chống sét Type II cả hai phía AC/DC.',
    stock: 9,
    unit: 'bộ',
    featured: false,
    svgType: 'inverter',
    origin: 'SolaX Power Chính Hãng',
    warrantyYears: 5,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất AC định mức', value: '15.000 W (3 Pha 380V)' },
      { label: 'Công suất PV cực đại', value: '30.000 Wp' },
      { label: 'Số MPPT', value: '3 MPPT (2 chuỗi/MPPT)' },
      { label: 'Hiệu suất tối đa', value: '98.0%' },
      { label: 'Cấp bảo vệ', value: 'IP66' }
    ],
    highlights: [
      'Cho phép đấu nối 2 cụm pin lưu trữ độc lập tăng gấp đôi dung lượng',
      'Chuyển mạch dự phòng siêu tốc < 4ms không làm gián đoạn thiết bị CNTT',
      'Hỗ trợ kết nối trạm sạc xe điện EV Charger thông minh'
    ],
    applications: [
      'Biệt thự lớn, tòa nhà văn phòng, showroom sử dụng điện 3 pha',
      'Cơ sở sản xuất kinh doanh cần nguồn điện dự phòng công suất cao'
    ]
  },
  {
    id: 'prod-04',
    sku: 'DVS-INV-DEYE-5KW',
    name: 'Biến Tần Inverter Hybrid Deye 5kW 1 Pha Lưu Trữ Thông Minh (SUN-5K-SG04LP1)',
    category: 'inverters',
    brand: 'Deye',
    shortDesc: 'Biến tần Hybrid thông minh hàng đầu, hỗ trợ pin lưu trữ 48V, chạy hòa lưới, độc lập và bám tải không phát lưới.',
    fullDesc: 'Inverter Hybrid Deye 5kW là dòng biến tần đa năng được ưa chuộng nhất hiện nay cho các hệ thống điện mặt trời gia đình. Thiết bị tích hợp màn hình cảm ứng LCD màu trực quan, cho phép kết nối máy phát điện, cài đặt thời gian nạp/xả pin theo giờ cao điểm - thấp điểm của EVN để tiết kiệm tối đa hóa đơn tiền điện.',
    stock: 22,
    unit: 'bộ',
    featured: true,
    svgType: 'inverter',
    origin: 'Deye Chính Hãng',
    warrantyYears: 5,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất AC danh định', value: '5000 W' },
      { label: 'Công suất ngõ vào PV tối đa', value: '6500 W' },
      { label: 'Số lượng MPPT', value: '2 MPPT độc lập' },
      { label: 'Dải điện áp MPPT', value: '125V - 425V DC' },
      { label: 'Điện áp ắc quy / pin lưu trữ', value: '40V - 60V (Chuẩn 48V/51.2V)' },
      { label: 'Dòng sạc / xả tối đa', value: '120A' },
      { label: 'Thời gian chuyển mạch UPS', value: '< 4ms (Không lo mất nguồn)' },
      { label: 'Hiệu suất cực đại', value: '97.6%' },
      { label: 'Giao tiếp & Giám sát', value: 'WiFi / GPRS / RS485 / CAN qua App di động' },
      { label: 'Cấp độ bảo vệ', value: 'IP65 ngoài trời' }
    ],
    highlights: [
      'Tự động chuyển đổi sang nguồn dự phòng siêu nhanh < 4ms khi cúp điện',
      'Màn hình cảm ứng LCD trực quan dễ thao tác cài đặt các thông số',
      'Hỗ trợ hòa lưới bám tải Zero-Export không lo phát ngược điện lên lưới',
      'Khả năng ghép song song lên đến 16 máy để nâng công suất'
    ],
    applications: [
      'Hệ thống điện mặt trời có lưu trữ cho biệt thự, nhà phố',
      'Cơ sở kinh doanh, văn phòng cần duy trì điện liên tục 24/7'
    ]
  },
  {
    id: 'prod-05',
    sku: 'DVS-INV-DEYE-12KW-3P',
    name: 'Biến Tần Inverter Hybrid Deye 12kW 3 Pha Cao Cấp (SUN-12K-SG04LP3)',
    category: 'inverters',
    brand: 'Deye',
    shortDesc: 'Biến tần Hybrid 3 pha điện áp thấp (48V), công suất 12kW, hỗ trợ tải mất cân bằng 100% từng pha.',
    fullDesc: 'Biến tần Hybrid 3 pha Deye 12kW là giải pháp tối ưu cho biệt thự lớn, nhà hàng, khách sạn và các xưởng sản xuất sử dụng điện 3 pha. Khả năng xuất tải không cân bằng 100% giúp các pha hoạt động độc lập không bị nghẽn khi nhu cầu sử dụng giữa các pha chênh lệch.',
    stock: 12,
    unit: 'bộ',
    featured: true,
    svgType: 'inverter',
    origin: 'Deye Chính Hãng',
    warrantyYears: 5,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất AC danh định', value: '12000 W (3 Pha 380V/400V)' },
      { label: 'Công suất ngõ vào PV tối đa', value: '15600 W' },
      { label: 'Dải điện áp pin lưu trữ', value: '40V - 60V (An toàn cho người dùng)' },
      { label: 'Dòng sạc / xả tối đa', value: '240A' },
      { label: 'Tải không cân bằng', value: 'Hỗ trợ 100% tải lệch pha' },
      { label: 'Hiệu suất tối đa', value: '97.6%' },
      { label: 'Chuẩn bảo vệ', value: 'IP65' },
      { label: 'Kích thước', value: '422 x 699 x 279 mm' }
    ],
    highlights: [
      'Sử dụng pin lưu trữ an toàn 48V không cần pin điện áp cao đắt đỏ',
      'Bảo vệ đầy đủ: quá áp, quá dòng, chống đảo dòng, phát hiện sự cố hồ quang AFCI',
      'Giám sát từ xa qua điện thoại thông minh mọi lúc mọi nơi'
    ],
    applications: [
      'Biệt thự sân vườn, trang trại, khu nghỉ dưỡng sinh thái',
      'Tòa nhà văn phòng, phòng khám, nhà thuốc dùng điện 3 pha'
    ]
  },
  {
    id: 'prod-16',
    sku: 'DVS-INV-SOLIS-5KW-HYB',
    name: 'Biến Tần Inverter Hybrid Solis S6-EH1P5K-L-PRO 5kW 1 Pha Thế Hệ Mới',
    category: 'inverters',
    brand: 'Solis',
    shortDesc: 'Dòng Hybrid S6 Pro mới nhất của Solis hỗ trợ dòng sạc xả 135A, kết nối máy phát điện và ghép song song 6 máy.',
    fullDesc: 'Solis S6-EH1P5K-L-PRO được thiết kế chuyên biệt cho hệ thống điện mặt trời lưu trữ hộ gia đình. Hỗ trợ dòng điện đầu vào MPPT lên đến 16A, tương thích với mọi loại tấm pin công suất lớn 580W - 650W hiện nay.',
    stock: 25,
    unit: 'bộ',
    featured: true,
    svgType: 'inverter',
    origin: 'Solis Chính Hãng',
    warrantyYears: 5,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất AC định mức', value: '5000 W' },
      { label: 'Công suất PV tối đa', value: '8000 W' },
      { label: 'Dòng ngắn mạch MPPT tối đa', value: '16A / 2 MPPT' },
      { label: 'Dòng sạc / xả pin tối đa', value: '135 A' },
      { label: 'Thời gian chuyển mạch UPS', value: '< 4 ms' },
      { label: 'Cấp bảo vệ', value: 'IP66 chống bụi nước cao cấp' }
    ],
    highlights: [
      'Chịu quá tải dự phòng lên tới 200% trong 10 giây cho các thiết bị đề dòng lớn',
      'Tương thích rộng rãi với các hãng pin lưu trữ Pylontech, Dyness, SolaX, Deye',
      'Quản lý thông minh trên ứng dụng SolisCloud tiếng Việt'
    ],
    applications: [
      'Nhà phố, biệt thự, cửa hàng kinh doanh dịch vụ',
      'Khu vực điện lưới yếu hoặc hay cắt điện đột xuất'
    ]
  },
  {
    id: 'prod-17',
    sku: 'DVS-INV-SOLIS-20KW-3P',
    name: 'Biến Tần Hòa Lưới 3 Pha Solis S5-GC20K 20kW Hiệu Suất Cao',
    category: 'inverters',
    brand: 'Solis',
    shortDesc: 'Biến tần hòa lưới 3 pha nhỏ gọn, hiệu suất 98.7%, tích hợp bám tải Zero Export cho hộ kinh doanh & văn phòng.',
    fullDesc: 'Solis S5-GC20K thuộc dòng biến tần hòa lưới thế hệ thứ 5 của Ginlong Solis, thiết kế dải điện áp MPPT rộng, khởi động sớm từ 180V giúp thu hoạch tối đa ánh nắng mặt trời từ sáng sớm tới chiều muộn.',
    stock: 15,
    unit: 'bộ',
    featured: false,
    svgType: 'inverter',
    origin: 'Solis Chính Hãng',
    warrantyYears: 5,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất đầu ra định mức', value: '20.000 W (20 kW 3 Pha)' },
      { label: 'Hiệu suất tối đa', value: '98.7%' },
      { label: 'Số lượng MPPT', value: '2 MPPT (4 chuỗi PV)' },
      { label: 'Điện áp khởi động', value: '180 V DC' },
      { label: 'Chuẩn bảo vệ', value: 'IP66' }
    ],
    highlights: [
      'Hiệu suất chuyển đổi 98.7% giảm thiểu tối đa tổn hao nhiệt',
      'Hỗ trợ giám sát từng chuỗi PV và chống phát ngược lưới thông minh',
      'Độ bền cao, vận hành ổn định trên 15 năm'
    ],
    applications: [
      'Văn phòng công ty, khách sạn, xưởng may, quán cà phê lớn',
      'Hộ gia đình sử dụng điện 3 pha kinh doanh'
    ]
  },
  {
    id: 'prod-06',
    sku: 'DVS-INV-SUNGROW-50K',
    name: 'Biến Tần Hòa Lưới Công Nghiệp Sungrow 50kW (SG50CX-P2)',
    category: 'inverters',
    brand: 'Sungrow',
    shortDesc: 'Biến tần hòa lưới chuỗi thế hệ mới cho mái nhà xưởng công nghiệp, 5 MPPT hiệu suất 98.5%.',
    fullDesc: 'Sungrow SG50CX-P2 là biểu tượng của sự bền bỉ trong ngành điện mặt trời công nghiệp. Thiết bị chịu được nhiệt độ cao, môi trường bụi bặm nhà máy, tối ưu hóa sản lượng điện trên diện tích mái lớn với 5 bộ theo dõi điểm công suất cực đại (MPPT).',
    stock: 6,
    unit: 'máy',
    featured: false,
    svgType: 'inverter',
    origin: 'Sungrow Chính Hãng',
    warrantyYears: 5,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất danh định', value: '50.000 W (50 kW)' },
      { label: 'Hiệu suất tối đa', value: '98.5%' },
      { label: 'Số kênh MPPT', value: '5 MPPT với 2 chuỗi/MPPT' },
      { label: 'Điện áp đầu vào tối đa', value: '1100 V' },
      { label: 'Cấp bảo vệ', value: 'IP66 và C5 chống ăn mòn' }
    ],
    highlights: [
      'Tích hợp tính năng ngắt mạch AFCI thông minh chống cháy nổ',
      'Làm mát quạt thông minh tăng tuổi thọ linh kiện',
      'Quản trị năng lượng thông minh trên nền tảng iSolarCloud'
    ],
    applications: [
      'Nhà máy sản xuất, khu công nghiệp, kho logistic',
      'Bãi đỗ xe năng lượng mặt trời doanh nghiệp'
    ]
  },

  // ================= PIN LƯU TRỮ ESS (energy-storage) =================
  {
    id: 'prod-18',
    sku: 'DVS-ESS-SOLAX-5.8KWH',
    name: 'Pin Lưu Trữ Lithium SolaX Triple Power T-BAT H 5.8kWh Cao Cấp',
    category: 'energy-storage',
    brand: 'SolaX',
    shortDesc: 'Pin lưu trữ LiFePO4 chính hãng SolaX, khả năng ghép nối linh hoạt, độ sâu xả 90% và hơn 6000 chu kỳ sạc xả.',
    fullDesc: 'SolaX Triple Power 5.8kWh là dòng pin lưu trữ đồng bộ cao cấp nhất khi kết hợp cùng biến tần SolaX Hybrid. Thiết kế chuẩn IP65 chống bụi nước, hệ thống sưởi ấm và kiểm soát nhiệt độ thông minh giúp pin hoạt động an toàn tuyệt đối.',
    stock: 16,
    unit: 'bộ',
    featured: true,
    svgType: 'battery',
    origin: 'SolaX Power Chính Hãng',
    warrantyYears: 10,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Dung lượng danh định', value: '5.8 kWh' },
      { label: 'Công nghệ cell', value: 'Lithium LiFePO4 an toàn tuyệt đối' },
      { label: 'Độ sâu xả (DoD)', value: '90%' },
      { label: 'Tuổi thọ chu kỳ', value: '> 6000 chu kỳ' },
      { label: 'Cấp bảo vệ', value: 'IP65' },
      { label: 'Bảo hành chính hãng', value: '10 năm' }
    ],
    highlights: [
      'Đồng bộ 100% giao thức BMS với biến tần SolaX qua SolaX Cloud',
      'Thiết kế dạng module xếp chồng không cần dây cáp rườm rà',
      'Hiệu suất nạp xả khứ hồi đạt trên 95%'
    ],
    applications: [
      'Hệ thống lưu trữ năng lượng cao cấp cho biệt thự và văn phòng',
      ' Nguồn điện dự phòng UPS công suất lớn'
    ]
  },
  {
    id: 'prod-19',
    sku: 'DVS-ESS-DEYE-SE-G5.1',
    name: 'Pin Lưu Trữ Lithium Deye SE-G5.1 Pro-B 5.12kWh 51.2V 100Ah',
    category: 'energy-storage',
    brand: 'Deye',
    shortDesc: 'Pin lưu trữ đồng bộ chính hãng Deye, tự động nhận diện giao tiếp CAN với Inverter Deye, bảo hành 10 năm.',
    fullDesc: 'Deye SE-G5.1 Pro-B sử dụng cell pin LiFePO4 không chứa coban, tuổi thọ dài và độ an toàn cao. Hỗ trợ kết nối song song tối đa 64 cụm pin mà không cần bộ điều khiển trung tâm bên ngoài.',
    stock: 20,
    unit: 'bộ',
    featured: true,
    svgType: 'battery',
    origin: 'Deye Chính Hãng',
    warrantyYears: 10,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Dung lượng danh định', value: '5.12 kWh (51.2V - 100Ah)' },
      { label: 'Dòng sạc/xả tối đa', value: '100A liên tục' },
      { label: 'Tuổi thọ chu kỳ', value: '≥ 6000 chu kỳ (tại 25°C, 90% DoD)' },
      { label: 'Cổng giao tiếp', value: 'CAN2.0 / RS485' },
      { label: 'Trọng lượng', value: '44 kg' }
    ],
    highlights: [
      'Cắm là chạy (Plug & Play) tự nhận cấu hình với biến tần Deye',
      'Hỗ trợ lắp đặt treo tường, đặt sàn hoặc lắp tủ Rack 19 inch',
      'Tích hợp BMS thông minh giám sát từng cell pin qua điện thoại'
    ],
    applications: [
      'Hệ thống điện mặt trời Hybrid gia đình và cửa hàng',
      'Lưu trữ điện giờ thấp điểm dùng cho giờ cao điểm'
    ]
  },
  {
    id: 'prod-07',
    sku: 'DVS-ESS-DYNESS-5KWH',
    name: 'Pin Lưu Trữ Lithium LiFePO4 Dyness Powerbox F 5.12kWh 51.2V',
    category: 'energy-storage',
    brand: 'Dyness',
    shortDesc: 'Cell pin Lithium Iron Phosphate an toàn nhất hiện nay, tuổi thọ trên 6000 chu kỳ nạp xả (trên 15 năm).',
    fullDesc: 'Pin lưu trữ Dyness Powerbox F-5.12 được sản xuất với cell pin LiFePO4 cao cấp, đảm bảo an toàn tuyệt đối chống cháy nổ. Thiết kế dạng module gắn tường hoặc đặt sàn tinh tế, tương thích hoàn hảo với các dòng Inverter Hybrid phổ biến như Deye, SolaX, Solis, Growatt.',
    stock: 28,
    unit: 'bộ',
    featured: true,
    svgType: 'battery',
    origin: 'Dyness Chính Hãng',
    warrantyYears: 10,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Dung lượng danh định', value: '5.12 kWh' },
      { label: 'Điện áp danh định', value: '51.2 V (100Ah)' },
      { label: 'Độ sâu xả DoD', value: '90%' },
      { label: 'Tuổi thọ chu kỳ', value: '≥ 6000 chu kỳ (tại 25°C, 0.5C)' },
      { label: 'Dòng sạc / xả liên tục', value: '50A (Khuyến nghị), 100A (Tối đa)' },
      { label: 'Hệ thống quản lý', value: 'BMS thông minh bảo vệ đa tầng' },
      { label: 'Khả năng mở rộng', value: 'Ghép song song tối đa 32 bộ (163.8 kWh)' },
      { label: 'Chuẩn an toàn', value: 'UN38.3, CE, IEC62619' }
    ],
    highlights: [
      'Cell pin LiFePO4 thế hệ mới không sinh nhiệt nguy hiểm',
      'Màn hình LED chỉ báo trạng thái SOC và dung lượng pin trực quan',
      'Tự động đồng bộ giao tiếp CAN/RS485 với biến tần Hybrid'
    ],
    applications: [
      'Lưu trữ điện mặt trời ban ngày để sử dụng vào ban đêm',
      'Hệ thống cấp điện dự phòng khi mất điện lưới cho camera, tủ lạnh, thiết bị chiếu sáng'
    ]
  },
  {
    id: 'prod-08',
    sku: 'DVS-ESS-WALL-10KWH',
    name: 'Bộ Pin Lưu Trữ Treo Tường Thông Minh Đức Vinh Solar ESS 10.24kWh',
    category: 'energy-storage',
    brand: 'Đức Vinh ESS',
    shortDesc: 'Pin lưu trữ lithium dạng mỏng treo tường cao cấp, dung lượng khủng 10.24kWh, thiết kế thẩm mỹ cho căn hộ.',
    fullDesc: 'Đức Vinh Solar ESS 10.24kWh là giải pháp lưu trữ điện cao cấp dành riêng cho các hộ gia đình và văn phòng muốn tự chủ nguồn điện mà không tốn diện tích sàn. Vỏ kim loại sơn tĩnh điện chống xước, tản nhiệt tự nhiên êm ái không tiếng ồn.',
    stock: 14,
    unit: 'bộ',
    featured: true,
    svgType: 'battery',
    origin: 'Lắp ráp tiêu chuẩn Đức Vinh Solar',
    warrantyYears: 10,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Dung lượng danh định', value: '10.24 kWh' },
      { label: 'Điện áp hoạt động', value: '44.8V - 58.4V (51.2V danh định)' },
      { label: 'Dung lượng Ah', value: '200 Ah' },
      { label: 'Dòng xả liên tục', value: '100A (Xả đỉnh 150A trong 10s)' },
      { label: 'Cấp bảo vệ', value: 'IP55' },
      { label: 'Trọng lượng', value: '88 kg' },
      { label: 'Kích thước', value: '720 x 550 x 200 mm' }
    ],
    highlights: [
      'Dung lượng lớn 10kWh đủ vận hành điều hòa và thiết bị gia đình qua đêm',
      'Thiết kế siêu mỏng treo tường thẩm mỹ như một món đồ nội thất',
      'Tích hợp cầu dao Aptomat DC chống chập cháy chuyên dụng'
    ],
    applications: [
      'Biệt thự, nhà phố hiện đại, căn hộ cao cấp',
      'Trạm viễn thông, phòng server nhỏ cần UPS thời gian dài'
    ]
  },

  // ================= ĐÈN NĂNG LƯỢNG MẶT TRỜI (solar-lights) =================
  {
    id: 'prod-11',
    sku: 'DVS-LGT-STREET-400W',
    name: 'Đèn Đường Năng Lượng Mặt Trời Liền Thể Cao Cấp 400W IP67 Đức Vinh',
    category: 'solar-lights',
    brand: 'Đức Vinh Lighting',
    shortDesc: 'Đèn đường solar thông minh tích hợp tấm pin, pin Lithium LiFePO4 và cảm biến radar tự động phát sáng.',
    fullDesc: 'Đèn đường năng lượng mặt trời liền thể 400W của Đức Vinh Solar là lựa chọn số 1 cho các công trình chiếu sáng đường phố nông thôn mới, khu dân cư, đường nội bộ nhà máy mà không cần tốn chi phí kéo dây điện hay tiền điện hàng tháng.',
    stock: 140,
    unit: 'bộ',
    featured: true,
    svgType: 'streetlight',
    origin: 'Đức Vinh Solar OEM',
    warrantyYears: 3,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất bóng LED', value: '400 W (Chip LED Bridgelux Mỹ siêu sáng)' },
      { label: 'Quang thông (Lumen)', value: '6500 lm' },
      { label: 'Tấm pin năng lượng mặt trời', value: 'Mono 6V/40W tích hợp mặt sau' },
      { label: 'Pin lưu trữ', value: 'Lithium LiFePO4 3.2V 36000mAh' },
      { label: 'Thời gian sạc đầy', value: '4 - 6 giờ nắng tiêu chuẩn' },
      { label: 'Thời gian chiếu sáng', value: '12 - 16 giờ liên tục (sáng cả đêm)' },
      { label: 'Cảm biến', value: 'Cảm biến chuyển động Radar + Cảm biến ánh sáng' },
      { label: 'Chỉ số bảo vệ', value: 'IP67 chống nước mưa và bụi tuyệt đối' }
    ],
    highlights: [
      'Không tốn 1 đồng tiền điện trong suốt vòng đời sản phẩm',
      'Thân đèn nhôm đúc nguyên khối tản nhiệt tuyệt vời chống oxy hóa',
      'Kèm remote điều khiển từ xa hẹn giờ và tăng giảm độ sáng'
    ],
    applications: [
      'Chiếu sáng đường giao thông nông thôn mới, đường liên ấp, liên thôn',
      'Đường nội bộ nhà máy, khu công nghiệp, kho bãi ngoài trời',
      'Khu nghỉ dưỡng, homestay, biệt thự sân vườn'
    ]
  },
  {
    id: 'prod-20',
    sku: 'DVS-LGT-JD-300W',
    name: 'Đèn Pha Năng Lượng Mặt Trời Jindian JD-8300L 300W Tấm Pin Rời',
    category: 'solar-lights',
    brand: 'Jindian Solar',
    shortDesc: 'Đèn pha năng lượng mặt trời tấm pin rời kích thước lớn, vỏ nhôm đúc, báo dung lượng pin trên mặt đèn.',
    fullDesc: 'Đèn pha Jindian 300W JD-8300L với tấm pin rời dây dài 5m cho phép lắp đặt đèn ở trong nhà xưởng, mái hiên, sân vườn trong khi tấm pin đặt trên mái đón nắng tối đa.',
    stock: 85,
    unit: 'bộ',
    featured: false,
    svgType: 'streetlight',
    origin: 'Jindian Chính Hãng',
    warrantyYears: 2,
    status: 'in-stock',
    updatedAt: '2026-11-03',
    specs: [
      { label: 'Công suất chiếu sáng', value: '300 W (Diện tích sáng ~300m²)' },
      { label: 'Pin lưu trữ', value: 'Lithium LiFePO4 40.000mAh' },
      { label: 'Tấm pin rời', value: 'Polycrystalline 6V / 45W' },
      { label: 'Thời gian chiếu sáng', value: '12 - 15 giờ liên tục' },
      { label: 'Chuẩn chống nước', value: 'IP67' }
    ],
    highlights: [
      'Dây nối dài 5m linh hoạt lắp đèn trong nhà hoặc dưới mái hiên',
      'Kính cường lực chống va đập, khung nhôm tản nhiệt rãnh sâu',
      'Tự động bật khi trời tối, tự động tắt và sạc khi trời sáng'
    ],
    applications: [
      'Chiếu sáng sân vườn, kho bãi, chuồng trại, nhà xưởng',
      'Đèn bảo vệ an ninh ban đêm cho gia đình'
    ]
  }
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-01',
    title: 'Hệ Thống Điện Mặt Trời Áp Mái 15kWp Gia Đình Biệt Thự Hóc Môn',
    category: 'residential',
    capacity: '15 kWp',
    location: 'Đông Thạnh, Huyện Hóc Môn, TP. Hồ Chí Minh',
    completionDate: 'Tháng 08/2026',
    estimatedSaving: 'Giảm 75% hóa đơn tiền điện (Tiết kiệm ~4.2 triệu VNĐ/tháng)',
    description: 'Thi công trọn gói hệ thống điện mặt trời hòa lưới có lưu trữ Hybrid cho gia đình sử dụng nhiều máy lạnh và thiết bị điện gia dụng. Hệ thống hoạt động hoàn toàn tự động, cấp điện liên tục khi có sự cố cúp điện lưới.',
    keyEquipment: [
      '26 tấm pin Longi Hi-MO 6 580W',
      '01 Inverter Hybrid Deye 12kW 3 Pha',
      '02 Pin lưu trữ Lithium Dyness 5.12kWh (Tổng 10.24kWh)',
      'Hệ thống khung giàn nhôm Anode chuyên dụng chống ăn mòn'
    ],
    svgType: 'rooftop'
  },
  {
    id: 'proj-02',
    title: 'Dự Án Điện Mặt Trời & Thiết Bị Tiết Kiệm Điện Nhà Xưởng Bao Bì 120kWp',
    category: 'commercial',
    capacity: '120 kWp + Tiết kiệm điện 18%',
    location: 'KCN Nhị Xuân, Hóc Môn, TP. Hồ Chí Minh',
    completionDate: 'Tháng 05/2026',
    estimatedSaving: 'Tiết kiệm ~38 triệu VNĐ tiền điện/tháng, hoàn vốn chỉ sau 3.8 năm',
    description: 'Kết hợp giải pháp lắp đặt tấm pin quang điện áp mái tôn nhà xưởng 120kWp cùng bộ tối ưu hóa năng lượng PowerSaver Pro 50kVA cho hệ thống động cơ kéo và máy thổi màng bao bì.',
    keyEquipment: [
      '200 tấm pin Jinko Tiger Neo N-Type 600W',
      '02 Biến tần hòa lưới Sungrow 50kW',
      '02 Bộ tiết kiệm điện PowerSaver Pro 50kVA',
      'Tủ điện đóng cắt bảo vệ ATS và chống sét lan truyền Type II'
    ],
    svgType: 'factory'
  },
  {
    id: 'proj-03',
    title: 'Hệ Thống Điện Mặt Trời Hybrid Độc Lập Cho Khu Nghỉ Dưỡng Sinh Thái',
    category: 'hybrid',
    capacity: '30 kWp + 40kWh Lưu Trữ',
    location: 'Củ Chi, TP. Hồ Chí Minh',
    completionDate: 'Tháng 03/2026',
    estimatedSaving: 'Tự chủ 95% nhu cầu điện năng toàn bộ khu nghỉ dưỡng',
    description: 'Cung cấp năng lượng xanh liên tục phục vụ chiếu sáng cảnh quan, hệ thống tưới cây tự động, hồ bơi và khu nhà hàng homestay với độ tin cậy tuyệt đối.',
    keyEquipment: [
      '50 tấm pin Canadian Solar 575W',
      '02 Inverter Hybrid SolaX X3-Ultra 15kW song song',
      '04 Khối pin lưu trữ lithium treo tường 10kWh',
      'Hệ thống giám sát điều khiển từ xa qua 4G'
    ],
    svgType: 'villa'
  },
  {
    id: 'proj-04',
    title: 'Công Trình Lắp Đặt 150 Bộ Đèn Đường Năng Lượng Mặt Trời Nông Thôn Mới',
    category: 'lighting',
    capacity: '150 Bộ Đèn 400W IP67',
    location: 'Tuyến đường liên ấp Xã Thới Tam Thôn & Đông Thạnh, Hóc Môn',
    completionDate: 'Tháng 09/2026',
    estimatedSaving: '0 đồng tiền điện hàng tháng, an toàn chiếu sáng 100% các tuyến đường',
    description: 'Dự án thắp sáng đường quê phối hợp cùng chính quyền địa phương, mang ánh sáng văn minh và an toàn giao thông cho bà con nhân dân mà không tốn chi phí kéo dây điện phức tạp.',
    keyEquipment: [
      '150 bộ đèn đường năng lượng mặt trời liền thể Đức Vinh 400W',
      'Trụ đèn thép mạ kẽm nhúng nóng cao 6 mét',
      'Bảo hành chính hãng 3 năm tận nơi'
    ],
    svgType: 'street'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-01',
    title: 'Kinh Nghiệm Chọn Lắp Điện Mặt Trời Có Lưu Trữ (Hybrid) Cho Hộ Gia Đình Năm 2026',
    category: 'Kinh Nghiệm Điện Mặt Trời',
    author: 'Kỹ Sư Đức Vinh Solar',
    publishedAt: '02/11/2026',
    readTime: '5 phút đọc',
    summary:
      'Hướng dẫn chi tiết cách tính toán công suất tấm pin và dung lượng pin lưu trữ Lithium (5kWh - 15kWh) giúp gia đình cắt giảm 70-90% tiền điện bậc thang cao và không lo cúp điện.',
    content: `Hệ thống điện mặt trời Hybrid (hòa lưới có lưu trữ) đang trở thành lựa chọn hàng đầu của các hộ gia đình và biệt thự tại TP. Hồ Chí Minh cũng như các tỉnh phía Nam nhờ khả năng vận hành thông minh cả ngày lẫn đêm.

1. Khi nào gia đình nên lắp hệ thống Hybrid thay vì Hòa lưới bám tải thông thường?
- Gia đình có hóa đơn tiền điện từ 2.500.000đ - 10.000.000đ/tháng và sử dụng nhiều thiết bị vào buổi tối (máy lạnh, bếp từ, bình nước nóng).
- Khu vực cần nguồn điện dự phòng liên tục cho camera an ninh, wifi, cửa cuốn, tủ lạnh, hồ cá Koi hoặc thiết bị y tế gia đình khi lưới điện gặp sự cố.

2. Cấu hình vàng được lắp đặt nhiều nhất tại Đức Vinh Solar:
- Gói 6kWp + Lưu trữ 5.12kWh: Phù hợp gia đình dùng 2-3 triệu tiền điện/tháng. Gồm 10-11 tấm pin N-Type 580W, 01 biến tần Hybrid 6kW (Deye / SolaX / Luxpower) và 01 pack pin Lithium LiFePO4 5.12kWh.
- Gói 10kWp - 12kWp + Lưu trữ 10.24kWh - 15kWh: Phù hợp nhà phố lớn, biệt thự dùng 4-8 triệu tiền điện/tháng, cho phép chạy cả điều hòa inverter ban đêm bằng điện mặt trời tích trữ.

3. Lưu ý kỹ thuật quan trọng khi chọn thiết bị:
- Ưu tiên tấm pin công nghệ N-Type TOPCon (Longi, Jinko, Canadian, AE Solar) có hiệu suất >22.5%, giảm suy hao hiệu suất theo thời gian.
- Chỉ sử dụng pin lưu trữ cell LiFePO4 chuẩn Grade A có giao tiếp CAN/RS485 đồng bộ trực tiếp với Inverter để bảo vệ tuổi thọ trên 6.000 chu kỳ sạc xả (tương đương 12-15 năm).`,
    tags: ['Điện mặt trời Hybrid', 'Pin lưu trữ Lithium', 'Tiết kiệm điện gia đình']
  },
  {
    id: 'blog-02',
    title: 'So Sánh Biến Tần Hybrid Deye, SolaX Và Luxpower: Nên Chọn Hãng Nào?',
    category: 'Kỹ Thuật & Lắp Đặt',
    author: 'Phòng Kỹ Thuật Đức Vinh Solar',
    publishedAt: '28/10/2026',
    readTime: '6 phút đọc',
    summary:
      'Đánh giá khách quan ưu nhược điểm thực tế của 3 dòng Inverter Hybrid phổ biến nhất thị trường về độ bền, khả năng chịu tải lệch pha và chế độ bảo hành chính hãng.',
    content: `Trong phân khúc biến tần Hybrid dân dụng và thương mại vừa, Deye, SolaX và Luxpower là 3 thương hiệu được khách hàng tại Kho Tổng Đức Vinh Solar quan tâm nhiều nhất. Dưới đây là góc nhìn kỹ thuật thực tế sau hàng trăm công trình:

1. Biến tần Hybrid Deye (1 Pha & 3 Pha Áp Thấp / Áp Cao):
- Ưu điểm nổi bật: Tản nhiệt nhôm đúc dày dặn, dòng sạc xả ắc quy lớn, đặc biệt dòng 3 pha 10kW - 50kW hỗ trợ chạy lệch pha 100% (mỗi pha có thể gánh tới 50% công suất định mức), cực kỳ phù hợp với thói quen dùng điện lệch pha tại Việt Nam.
- Tương thích: Kết nối mượt mà với hầu hết các hãng pin Lithium trên thị trường (Dyness, Pylontech, SolaX, Gigabox...).

2. Biến tần SolaX Power (X1-Hybrid & X3-Ultra):
- Ưu điểm nổi bật: Thương hiệu cao cấp chuẩn châu Âu/Úc, thiết kế tối giản sang trọng, hiệu suất chuyển đổi cực cao (lên tới 98.5%), vận hành siêu êm không tiếng ồn quạt lớn.
- Phù hợp: Biệt thự cao cấp, văn phòng công ty yêu cầu độ ổn định tuyệt đối và hệ sinh thái đồng bộ SolaX Triple Power.

3. Biến tần Luxpower (SNA & LXP):
- Ưu điểm nổi bật: Phần mềm giám sát tiếng Việt cực kỳ trực quan, cài đặt linh hoạt nhiều chế độ sạc xả theo khung giờ cao điểm/thấp điểm, chi phí đầu tư rất hợp lý.
- Phù hợp: Hộ gia đình muốn tối ưu chi phí đầu tư ban đầu nhưng vẫn đầy đủ tính năng lưu trữ và chạy độc lập khi mất điện.`,
    tags: ['Inverter Deye', 'Inverter SolaX', 'Luxpower', 'So sánh biến tần']
  },
  {
    id: 'blog-03',
    title: 'Giải Pháp Giảm Chi Phí Tiền Điện Giờ Cao Điểm Cho Nhà Xưởng & Kho Lạnh',
    category: 'Giải Pháp Tiết Kiệm Điện',
    author: 'Kỹ Sư Đức Vinh Solar',
    publishedAt: '20/10/2026',
    readTime: '5 phút đọc',
    summary:
      'Bài toán kết hợp điện mặt trời áp mái nhà xưởng C&I cùng hệ thống lưu trữ BESS giúp doanh nghiệp cắt đỉnh phụ tải giờ cao điểm và hoàn vốn chỉ sau 3 - 3.8 năm.',
    content: `Đối với các nhà xưởng sản xuất nhựa, bao bì, cơ khí, may mặc và kho lạnh bảo quản, chi phí tiền điện giờ cao điểm (9h30 - 11h30 và 17h00 - 20h00) chiếm tỷ trọng rất lớn trong giá thành sản xuất.

1. Tận dụng mái tôn nhà xưởng làm "nhà máy phát điện" tại chỗ:
- Khung giờ nắng đỉnh điểm từ 9h00 - 15h00 trùng khớp hoàn toàn với ca sản xuất ban ngày và khung giờ cao điểm trưa của biểu giá điện sản xuất/kinh doanh.
- Mỗi 100kWp điện mặt trời áp mái nhà xưởng tại khu vực TP.HCM, Bình Dương, Long An, Đồng Nai tạo ra trung bình 12.000 - 13.500 kWh/tháng, giúp doanh nghiệp tiết kiệm ngay 35 - 45 triệu đồng mỗi tháng.

2. Kết hợp BESS (Lưu trữ năng lượng thương mại) để xóa khung giờ cao điểm chiều tối:
- Hệ thống Inverter Hybrid công nghiệp kết hợp tủ pin lưu trữ áp cao (HV Battery) cho phép nạp điện mặt trời dư thừa hoặc điện giờ thấp điểm ban đêm, sau đó xả ra cấp cho nhà máy vào khung giờ cao điểm chiều (17h00 - 20h00).
- Đồng thời, lớp tấm pin mặt trời che phủ trên mái giúp giảm nhiệt độ nhà xưởng từ 4 - 6 độ C, giảm tải đáng kể cho hệ thống thông gió và máy làm mát.`,
    tags: ['Điện mặt trời nhà xưởng', 'Tiết kiệm điện công nghiệp', 'BESS']
  },
  {
    id: 'blog-04',
    title: 'Tiêu Chuẩn Kỹ Thuật Khi Thi Công Khung Giàn Nhôm & Chống Thấm Mái Tôn, Mái Ngói',
    category: 'Kỹ Thuật & Lắp Đặt',
    author: 'Đội Thi Công Đức Vinh Solar',
    publishedAt: '12/10/2026',
    readTime: '4 phút đọc',
    summary:
      'Quy trình 5 bước lắp đặt khung ray nhôm Anode AL6005-T5, kẹp biên, kẹp giữa và xử lý chống dột tuyệt đối giúp hệ thống bền vững trên 25 năm trước giông bão.',
    content: `Một hệ thống điện mặt trời có tuổi thọ tấm pin lên tới 25 - 30 năm, vì vậy chất lượng vật tư phụ kiện cơ khí và kỹ thuật thi công trên mái đóng vai trò quyết định đến sự an toàn lâu dài của ngôi nhà.

1. Tuyệt đối sử dụng hệ thanh ray nhôm hợp kim AL6005-T5 Anode hóa:
- Không sử dụng sắt hộp mạ kẽm mỏng dễ rỉ sét sau vài mùa mưa nắng.
- Thanh ray nhôm chuyên dụng Solar cùng phụ kiện bulong Inox 304 chống ăn mòn hoàn toàn, chịu được sức gió giật cấp 12.

2. Kỹ thuật chống thấm mái tôn và mái ngói tại Đức Vinh Solar:
- Đối với mái tôn: Sử dụng chân đỡ chữ L chuyên dụng có đệm cao su EPDM chịu nhiệt lão hóa cao, bắn vít vào đúng sóng dương xà gồ kết hợp keo chống thấm chuyên dụng ngoài trời.
- Đối với mái ngói / mái bê tông: Sử dụng móc ngói Inox 304 luồn dưới viên ngói, không khoan thủng mặt ngói, đảm bảo thẩm mỹ và không gây nứt vỡ ngói khi giãn nở nhiệt.

3. Hệ thống tủ điện DC/AC và tiếp địa chống sét:
- Mọi công trình đều phải có cọc tiếp địa đồng chuẩn điện trở đất quy định, kết hợp CB DC, cầu chì DC và chống sét lan truyền SPD Type II cho cả phía DC và AC.`,
    tags: ['Kỹ thuật lắp đặt', 'Khung nhôm Solar', 'An toàn điện mặt trời']
  },
  {
    id: 'blog-05',
    title: 'Cách Chọn Đèn Năng Lượng Mặt Trời Chính Hãng: Phân Biệt Công Suất Thực Và Ảo',
    category: 'Kinh Nghiệm Điện Mặt Trời',
    author: 'Kỹ Sư Đức Vinh Solar',
    publishedAt: '05/10/2026',
    readTime: '4 phút đọc',
    summary:
      'Mẹo kiểm tra kích thước tấm pin sạc, dung lượng pin lưu trữ LiFePO4 bên trong và chip LED giúp bạn chọn mua đèn đường, đèn pha Solar sáng xuyên đêm không bị tắt sớm.',
    content: `Trên thị trường hiện nay có rất nhiều loại đèn năng lượng mặt trời giá rẻ ghi công suất 500W, 1000W nhưng chỉ sáng được 2-3 tiếng đầu đêm là mờ dần hoặc tắt hẳn. Đức Vinh Solar chia sẻ 3 tiêu chí kiểm tra thực tế:

1. Kiểm tra kích thước tấm pin năng lượng mặt trời đi kèm:
- Tấm pin là bộ phận duy nhất thu năng lượng mặt trời để nạp vào đèn. Một bộ đèn pha hoặc đèn đường chuẩn sáng nguyên đêm (10-12 tiếng) phải có tấm pin Mono hoặc Poly kích thước đủ lớn (tối thiểu từ 35W - 60W thực cho đèn công trình).

2. Kiểm tra dung lượng và loại pin lưu trữ bên trong thân đèn:
- Đèn chính hãng tại Kho Đức Vinh Solar sử dụng pin Lithium Sắt Phốt Phát (LiFePO4) mới 100% có dung lượng thực từ 30.000mAh - 60.000mAh, tuổi thọ 4-6 năm, không phồng rộp.

3. Chất liệu vỏ đèn và tiêu chuẩn chống nước IP67:
- Chọn thân đèn bằng nhôm đúc nguyên khối có rãnh tản nhiệt sâu giúp chip LED SMD/COB không bị giảm độ sáng (quang thông) sau thời gian dài sử dụng ngoài mưa nắng.`,
    tags: ['Đèn năng lượng mặt trời', 'Đèn đường Solar', 'Mẹo chọn thiết bị']
  }
];

