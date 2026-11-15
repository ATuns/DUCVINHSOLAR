import React from 'react';

interface ProductSvgThumbnailProps {
  type: 'panel' | 'inverter' | 'battery' | 'optimizer' | 'streetlight' | 'custom';
  imageUrl?: string;
  name: string;
  className?: string;
  fit?: 'contain' | 'cover';
}

export const ProductSvgThumbnail: React.FC<ProductSvgThumbnailProps> = ({
  type,
  imageUrl,
  name,
  className = 'w-full h-full',
  fit = 'contain'
}) => {
  // If a valid image URL is supplied, attempt to display it with fallback
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  if (imageUrl && !imgError) {
    const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${className} ${fitClass}`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  // High-fidelity vector SVG representations tailored to each solar & electrical component
  switch (type) {
    case 'panel':
      return (
        <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f0fdf4" />
              <stop offset="1" stopColor="#dcfce7" />
            </linearGradient>
            <linearGradient id="panelGrad" x1="60" y1="30" x2="340" y2="260" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0f172a" />
              <stop offset="0.5" stopColor="#1e293b" />
              <stop offset="1" stopColor="#090d16" />
            </linearGradient>
            <linearGradient id="cellShine" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="0.7" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="1" stopColor="#0284c7" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#skyGrad)" />
          {/* Subtle sun ray */}
          <circle cx="340" cy="50" r="35" fill="#fef08a" fillOpacity="0.6" />
          <circle cx="340" cy="50" r="48" fill="#fef9c3" fillOpacity="0.3" />

          {/* Solar Panel Shadow */}
          <polygon points="65,245 335,245 355,255 45,255" fill="#cbd5e1" fillOpacity="0.6" />

          {/* Aluminum Frame */}
          <polygon points="70,55 330,55 345,240 55,240" fill="#64748b" stroke="#334155" strokeWidth="2" />
          {/* Panel Glass Surface */}
          <polygon points="75,60 325,60 339,235 61,235" fill="url(#panelGrad)" />
          {/* Shine overlay */}
          <polygon points="75,60 325,60 339,235 61,235" fill="url(#cellShine)" />

          {/* Grid lines - horizontal */}
          <line x1="72" y1="95" x2="328" y2="95" stroke="#475569" strokeWidth="1" strokeDasharray="3 1" />
          <line x1="69" y1="130" x2="331" y2="130" stroke="#475569" strokeWidth="1" strokeDasharray="3 1" />
          <line x1="66" y1="165" x2="334" y2="165" stroke="#475569" strokeWidth="1" strokeDasharray="3 1" />
          <line x1="63" y1="200" x2="337" y2="200" stroke="#475569" strokeWidth="1" strokeDasharray="3 1" />

          {/* Grid lines - vertical (busbars) */}
          <line x1="120" y1="58" x2="110" y2="237" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="165" y1="58" x2="160" y2="237" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="200" y1="58" x2="200" y2="237" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="235" y1="58" x2="240" y2="237" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="280" y1="58" x2="290" y2="237" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.7" />

          {/* Silicon cell shimmer badge */}
          <rect x="75" y="250" width="105" height="24" rx="4" fill="#047857" />
          <text x="127" y="266" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="sans-serif">
            N-TYPE TOPCon
          </text>
          <rect x="220" y="250" width="105" height="24" rx="4" fill="#0f766e" />
          <text x="272" y="266" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="sans-serif">
            TIER 1 SOLAR
          </text>
        </svg>
      );

    case 'inverter':
      return (
        <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#f8fafc" />
          {/* Wall mount backplate shadow */}
          <rect x="110" y="45" width="180" height="215" rx="14" fill="#94a3b8" fillOpacity="0.3" />
          {/* Inverter body */}
          <rect x="115" y="40" width="170" height="210" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          {/* Top Cooling Fins */}
          <rect x="130" y="30" width="140" height="10" rx="2" fill="#475569" />
          <line x1="145" y1="30" x2="145" y2="40" stroke="#64748b" strokeWidth="2" />
          <line x1="165" y1="30" x2="165" y2="40" stroke="#64748b" strokeWidth="2" />
          <line x1="185" y1="30" x2="185" y2="40" stroke="#64748b" strokeWidth="2" />
          <line x1="205" y1="30" x2="205" y2="40" stroke="#64748b" strokeWidth="2" />
          <line x1="225" y1="30" x2="225" y2="40" stroke="#64748b" strokeWidth="2" />
          <line x1="245" y1="30" x2="245" y2="40" stroke="#64748b" strokeWidth="2" />

          {/* LCD Screen */}
          <rect x="140" y="70" width="120" height="65" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
          <text x="200" y="92" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="700" fontFamily="monospace">
            5.24 kW
          </text>
          <text x="200" y="108" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace">
            PV: 5.6kW | BAT: 98%
          </text>
          <text x="200" y="122" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontFamily="monospace">
            HYBRID ON-GRID / ESS
          </text>

          {/* LED Indicators */}
          <circle cx="150" cy="155" r="4" fill="#10b981" />
          <text x="160" y="158" fill="#334155" fontSize="8" fontWeight="600">NORMAL</text>
          <circle cx="215" cy="155" r="4" fill="#0284c7" />
          <text x="225" y="158" fill="#334155" fontSize="8" fontWeight="600">COMM</text>

          {/* Brand mark stripe */}
          <rect x="135" y="180" width="130" height="4" rx="2" fill="#059669" />
          <text x="200" y="205" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="800" letterSpacing="0.05em">
            ĐỨC VINH SOLAR
          </text>
          <text x="200" y="222" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600">
            SMART HYBRID INVERTER
          </text>

          {/* Bottom terminals / breaker switch */}
          <rect x="155" y="245" width="20" height="15" rx="2" fill="#334155" />
          <rect x="190" y="245" width="20" height="15" rx="2" fill="#dc2626" />
          <rect x="225" y="245" width="20" height="15" rx="2" fill="#059669" />
        </svg>
      );

    case 'battery':
      return (
        <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#f0fdf4" />
          {/* Battery module body */}
          <rect x="100" y="50" width="200" height="200" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          {/* Inner bezel */}
          <rect x="110" y="60" width="180" height="180" rx="8" fill="#0f172a" />

          {/* Lithium LiFePO4 Branding */}
          <text x="200" y="88" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">
            LITHIUM LiFePO4 ESS
          </text>
          <text x="200" y="105" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="600" letterSpacing="0.08em">
            51.2V / 100Ah · 5.12 kWh
          </text>

          {/* Battery Charge Gauge */}
          <rect x="130" y="125" width="140" height="26" rx="6" fill="#1e293b" stroke="#059669" strokeWidth="1.5" />
          {/* Segments */}
          <rect x="134" y="129" width="22" height="18" rx="3" fill="#10b981" />
          <rect x="160" y="129" width="22" height="18" rx="3" fill="#10b981" />
          <rect x="186" y="129" width="22" height="18" rx="3" fill="#10b981" />
          <rect x="212" y="129" width="22" height="18" rx="3" fill="#10b981" />
          <rect x="238" y="129" width="16" height="18" rx="3" fill="#34d399" />

          {/* Battery Terminal Nipples */}
          <circle cx="140" cy="185" r="10" fill="#dc2626" />
          <text x="140" y="189" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">+</text>
          <circle cx="260" cy="185" r="10" fill="#475569" />
          <text x="260" y="189" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">-</text>

          {/* Breaker switch & comm ports */}
          <rect x="175" y="175" width="50" height="20" rx="3" fill="#334155" />
          <text x="200" y="189" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">CAN / RS485</text>

          {/* Cycle count text */}
          <text x="200" y="222" textAnchor="middle" fill="#94a3b8" fontSize="9">
            ≥ 6,000 Chu Kỳ · Độ Xả 90% DoD
          </text>
        </svg>
      );

    case 'optimizer':
      return (
        <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#f8fafc" />
          {/* Industrial Box Shadow */}
          <rect x="95" y="45" width="210" height="215" rx="8" fill="#cbd5e1" />
          {/* Main Enclosure */}
          <rect x="90" y="40" width="210" height="210" rx="8" fill="#1e293b" stroke="#059669" strokeWidth="2.5" />

          {/* Top warning stripe */}
          <rect x="91" y="41" width="208" height="10" rx="2" fill="#eab308" />

          {/* Title */}
          <text x="195" y="75" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="800">
            POWERSAVER PRO 50kVA
          </text>
          <text x="195" y="90" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="600">
            BỘ TỐI ƯU HÓA &amp; TIẾT KIỆM ĐIỆN 3 PHA
          </text>

          {/* Digital LED Multimeter */}
          <rect x="120" y="105" width="150" height="75" rx="5" fill="#090d16" stroke="#0284c7" strokeWidth="1.5" />
          <text x="130" y="125" fill="#38bdf8" fontSize="10" fontFamily="monospace">VOLTAGE: 382.4 V</text>
          <text x="130" y="142" fill="#38bdf8" fontSize="10" fontFamily="monospace">CURRENT: 64.8 A</text>
          <text x="130" y="159" fill="#10b981" fontSize="11" fontWeight="700" fontFamily="monospace">COS PHI: 0.985</text>
          <text x="130" y="174" fill="#f59e0b" fontSize="10" fontWeight="700" fontFamily="monospace">TIẾT KIỆM: -18.2%</text>

          {/* Heat dissipation vents */}
          <line x1="110" y1="195" x2="280" y2="195" stroke="#475569" strokeWidth="2" />
          <line x1="110" y1="202" x2="280" y2="202" stroke="#475569" strokeWidth="2" />
          <line x1="110" y1="209" x2="280" y2="209" stroke="#475569" strokeWidth="2" />

          {/* Status LEDs */}
          <circle cx="130" cy="230" r="5" fill="#10b981" />
          <text x="142" y="233" fill="#ffffff" fontSize="8">RUN</text>

          <circle cx="180" cy="230" r="5" fill="#0284c7" />
          <text x="192" y="233" fill="#ffffff" fontSize="8">SAVING</text>

          <circle cx="235" cy="230" r="5" fill="#eab308" />
          <text x="247" y="233" fill="#ffffff" fontSize="8">SURGE</text>
        </svg>
      );

    case 'streetlight':
      return (
        <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#f0fdf4" />
          {/* Sky sun icon */}
          <circle cx="80" cy="60" r="25" fill="#fef08a" />
          {/* Street Pole */}
          <line x1="120" y1="280" x2="160" y2="150" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
          <line x1="160" y1="150" x2="200" y2="120" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />

          {/* Integrated Solar Street Light Body */}
          <polygon points="180,130 320,80 340,95 200,145" fill="#334155" stroke="#1e293b" strokeWidth="2" />
          {/* Integrated Solar Panel on Top */}
          <polygon points="185,127 315,79 328,88 198,136" fill="#0f172a" />
          <line x1="220" y1="114" x2="230" y2="124" stroke="#38bdf8" strokeWidth="1" />
          <line x1="250" y1="103" x2="260" y2="113" stroke="#38bdf8" strokeWidth="1" />
          <line x1="280" y1="92" x2="290" y2="102" stroke="#38bdf8" strokeWidth="1" />

          {/* Bottom LED matrix glowing */}
          <polygon points="205,148 330,103 336,118 211,163" fill="#ffffff" />
          <ellipse cx="270" cy="133" rx="40" ry="12" fill="#fef08a" fillOpacity="0.8" />

          {/* Beam of Light downwards */}
          <polygon points="211,163 336,118 380,270 170,270" fill="#fef08a" fillOpacity="0.25" />

          {/* Tag labels */}
          <rect x="220" y="240" width="150" height="26" rx="4" fill="#047857" />
          <text x="295" y="257" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
            ĐÈN LIỀN THỂ 400W IP67
          </text>
        </svg>
      );

    default:
      return (
        <div className={`flex flex-col items-center justify-center bg-slate-100 text-slate-500 ${className}`}>
          <svg className="w-12 h-12 text-emerald-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-xs font-medium text-slate-700">{name}</span>
        </div>
      );
  }
};
