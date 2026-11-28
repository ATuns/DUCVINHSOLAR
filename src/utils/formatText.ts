/**
 * Formats Vietnamese text into strict Sentence case (only first letter of line/sentence + proper nouns capitalized)
 * to eliminate Title Case ("Ghi Hoa Từng Chữ Luôn").
 */

const PROPER_NOUN_MAP: Array<[RegExp, string]> = [
  [/\bđức vinh solar\b/gi, 'Đức Vinh Solar'],
  [/\bsolar đức vinh\b/gi, 'Solar Đức Vinh'],
  [/\bđức vinh ess\b/gi, 'Đức Vinh ESS'],
  [/\bđức vinh lighting\b/gi, 'Đức Vinh Lighting'],
  [/\bđức vinh\b/gi, 'Đức Vinh'],
  [/\bnguyễn quang vinh\b/gi, 'Nguyễn Quang Vinh'],
  [/\bsolax power\b/gi, 'SolaX Power'],
  [/\bsolax cloud\b/gi, 'SolaX Cloud'],
  [/\bsolax\b/gi, 'SolaX'],
  [/\bdeye\b/gi, 'Deye'],
  [/\blongi\b/gi, 'Longi'],
  [/\bjinko solar\b/gi, 'Jinko Solar'],
  [/\bjinko\b/gi, 'Jinko'],
  [/\bcanadian solar\b/gi, 'Canadian Solar'],
  [/\bcanadian\b/gi, 'Canadian'],
  [/\bja solar\b/gi, 'JA Solar'],
  [/\btrina solar\b/gi, 'Trina Solar'],
  [/\bae solar\b/gi, 'AE Solar'],
  [/\bsungrow\b/gi, 'Sungrow'],
  [/\bsoliscloud\b/gi, 'SolisCloud'],
  [/\bsolis\b/gi, 'Solis'],
  [/\bluxpower\b/gi, 'Luxpower'],
  [/\bgrowatt\b/gi, 'Growatt'],
  [/\bhuawei\b/gi, 'Huawei'],
  [/\bdyness\b/gi, 'Dyness'],
  [/\bpylontech\b/gi, 'Pylontech'],
  [/\bgigabox\b/gi, 'Gigabox'],
  [/\bjindian solar\b/gi, 'Jindian Solar'],
  [/\bjindian\b/gi, 'Jindian'],
  [/\bsolar\b/gi, 'Solar'],
  [/\bhybrid\b/gi, 'Hybrid'],
  [/\binverter\b/gi, 'Inverter'],
  [/\blithium\b/gi, 'Lithium'],
  [/\blifepo4\b/gi, 'LiFePO4'],
  [/\btopcon\b/gi, 'TOPCon'],
  [/\bn-type\b/gi, 'N-Type'],
  [/\bhpbc\b/gi, 'HPBC'],
  [/\bbifacial\b/gi, 'Bifacial'],
  [/\bhalf-cell\b/gi, 'Half-cell'],
  [/\bzero-export\b/gi, 'Zero-Export'],
  [/\bzero export\b/gi, 'Zero Export'],
  [/\bpowersaver pro\b/gi, 'PowerSaver Pro'],
  [/\bpowersaver\b/gi, 'PowerSaver'],
  [/\btier 1\b/gi, 'Tier 1'],
  [/\bzalo\b/gi, 'Zalo'],
  [/\bgoogle maps\b/gi, 'Google Maps'],
  [/\bgoogle\b/gi, 'Google'],
  [/\btp\.?\s*hồ chí minh\b/gi, 'TP. Hồ Chí Minh'],
  [/\btp\.?\s*hcm\b/gi, 'TP.HCM'],
  [/\bhồ chí minh\b/gi, 'Hồ Chí Minh'],
  [/\bhóc môn\b/gi, 'Hóc Môn'],
  [/\bđông thạnh\b/gi, 'Đông Thạnh'],
  [/\bthới tam thôn\b/gi, 'Thới Tam Thôn'],
  [/\bthạnh xuân\b/gi, 'Thạnh Xuân'],
  [/\bbình hưng hòa\b/gi, 'Bình Hưng Hòa'],
  [/\bnhị xuân\b/gi, 'Nhị Xuân'],
  [/\bcủ chi\b/gi, 'Củ Chi'],
  [/\bquận 12\b/gi, 'Quận 12'],
  [/\bbình dương\b/gi, 'Bình Dương'],
  [/\bđồng nai\b/gi, 'Đồng Nai'],
  [/\blong an\b/gi, 'Long An'],
  [/\bviệt nam\b/gi, 'Việt Nam'],
  [/\bc&i\b/gi, 'C&I'],
  [/\bess\b/gi, 'ESS'],
  [/\bbms\b/gi, 'BMS'],
  [/\bmppt\b/gi, 'MPPT'],
  [/\bups\b/gi, 'UPS'],
  [/\beps\b/gi, 'EPS'],
  [/\bafci\b/gi, 'AFCI'],
  [/\bats\b/gi, 'ATS'],
  [/\bevn\b/gi, 'EVN'],
  [/\bvat\b/gi, 'VAT'],
  [/\bco\/cq\b/gi, 'CO/CQ'],
  [/\bco\b/gi, 'CO'],
  [/\bcq\b/gi, 'CQ'],
  [/\bip65\b/gi, 'IP65'],
  [/\bip66\b/gi, 'IP66'],
  [/\bip67\b/gi, 'IP67'],
  [/\bip68\b/gi, 'IP68'],
  [/\bkwh\b/gi, 'kWh'],
  [/\bkwp\b/gi, 'kWp'],
  [/\bkw\b/gi, 'kW'],
  [/\bkva\b/gi, 'kVA'],
  [/\bwp\b/gi, 'Wp'],
  [/\bmah\b/gi, 'mAh'],
  [/\bah\b/gi, 'Ah'],
  [/\bvnđ\b/gi, 'VNĐ'],
  [/\bkcn\b/gi, 'KCN'],
  [/\blcd\b/gi, 'LCD'],
  [/\bled\b/gi, 'LED'],
  [/\bwifi\b/gi, 'WiFi'],
  [/\brs485\b/gi, 'RS485'],
  [/\bcan\b/gi, 'CAN']
];

export const toSentenceCase = (input?: string | null): string => {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Convert entire string to lowercase first while preserving uppercase alphanumeric SKU/model codes like X1-Hybrid, Hi-MO, SE-G5.1, SUN-5K-SG04LP1
  const tokens = trimmed.split(/(\s+)/);
  const processedTokens = tokens.map((tok) => {
    if (/^\s+$/.test(tok)) return tok;
    // Keep model codes containing digits + uppercase letters or hyphens (e.g. X1-Hybrid, G4, Hi-MO, SUN-12K, TOPHiKu6, 16BB)
    const cleanTok = tok.replace(/^[("“‘']+|[)"”’',.:;!?]+$/g, '');
    if (
      /[0-9]/.test(cleanTok) &&
      /[A-Z]/.test(cleanTok) &&
      !/^(Tháng|Năm|Quận|Phường|Đường|Tấm|Bộ|Pin)$/i.test(cleanTok)
    ) {
      return tok;
    }
    if (/^[A-Z0-9-]{2,}$/.test(cleanTok) && /[0-9-]/.test(cleanTok)) {
      return tok;
    }
    return tok.toLowerCase();
  });

  let result = processedTokens.join('');

  // Restore proper nouns & technical acronyms
  for (const [regex, replacement] of PROPER_NOUN_MAP) {
    result = result.replace(regex, replacement);
  }

  // Capitalize the very first letter of the string and any letter following a line break or sentence-ending punctuation
  result = result.replace(/(^\s*[("“‘']*|[.!?]\s+|\n\s*)([a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ])/g, (_, prefix: string, letter: string) => {
    return prefix + letter.toUpperCase();
  });

  return result;
};
