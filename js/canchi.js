// canchi.js
export const CAN = [
  "Giáp",
  "Ất",
  "Bính",
  "Đinh",
  "Mậu",
  "Kỷ",
  "Canh",
  "Tân",
  "Nhâm",
  "Quý",
];

export const CHI = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
];

export function getYearCanChi(year) {
  return `${CAN[(year + 6) % 10]} ${CHI[(year + 8) % 12]}`;
}

export function getDayCanChi(date) {
  const base = new Date(1900, 0, 1);
  const diff = Math.floor((date - base) / (24 * 3600 * 1000));
  return `${CAN[(diff + 40) % 10]} ${CHI[(diff + 10) % 12]}`;
}

export function getMonthCanChi(yearCanIndex, month) {
  return `${CAN[(yearCanIndex * 2 + month + 2) % 10]} ${
    CHI[(2 + (month - 1)) % 12]
  }`;
}

export function getHourCanChi(dayCanIndex, hour) {
  const chiIndex = Math.floor((hour + 1) / 2) % 12;
  return `${CAN[(dayCanIndex * 2 + chiIndex) % 10]} ${CHI[chiIndex]}`;
}

export function getAllCanChi(date) {
  const yearCC = getYearCanChi(date.getFullYear());
  const yearCanIdx = CAN.indexOf(yearCC.split(" ")[0]);
  const dayCC = getDayCanChi(date);
  const dayCanIdx = CAN.indexOf(dayCC.split(" ")[0]);
  const monthCC = getMonthCanChi(yearCanIdx, date.getMonth() + 1);
  const hourCC = getHourCanChi(dayCanIdx, date.getHours());
  return { year: yearCC, month: monthCC, day: dayCC, hour: hourCC };
}

// Nguyệt lệnh: lấy từ Can Chi tháng
export function getNguyetLenh(canChiMonth) {
  return canChiMonth.split(" ")[1] || "—";
}

// Tuần Không Vong
export function getKhongVong(dayCanChi) {
  const [canStr, chiStr] = dayCanChi.split(" ");
  const dayCanIdx = CAN.indexOf(canStr);
  const dayChiIdx = CHI.indexOf(chiStr);
  if (dayCanIdx < 0 || dayChiIdx < 0) return "—";
  const start = (dayChiIdx - dayCanIdx + 12) % 12; // chi của ngày Giáp trong tuần
  const k1 = CHI[(start + 10) % 12];
  const k2 = CHI[(start + 11) % 12];
  return `${k1} – ${k2}`;
}
