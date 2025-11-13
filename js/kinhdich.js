// kinhdich.js
export const TRIGRAM_ORDER = [
  { name: "Càn", bits: [1, 1, 1] },
  { name: "Đoài", bits: [1, 1, 0] },
  { name: "Ly", bits: [1, 0, 1] },
  { name: "Chấn", bits: [1, 0, 0] },
  { name: "Tốn", bits: [0, 1, 1] },
  { name: "Khảm", bits: [0, 1, 0] },
  { name: "Cấn", bits: [0, 0, 1] },
  { name: "Khôn", bits: [0, 0, 0] },
];

export const TRIGRAM_WORD = {
  Càn: "Thiên",
  Khôn: "Địa",
  Ly: "Hỏa",
  Khảm: "Thủy",
  Chấn: "Lôi",
  Tốn: "Phong",
  Cấn: "Sơn",
  Đoài: "Trạch",
};

export const HEX_NAME = {
  "Càn-Càn": "Thuần Càn",
  "Càn-Đoài": "Thiên Trạch Lý",
  "Càn-Ly": "Thiên Hỏa Đồng Nhân",
  "Càn-Chấn": "Thiên Lôi Vô Vọng",
  "Càn-Tốn": "Thiên Phong Cấu",
  "Càn-Khảm": "Thiên Thủy Tụng",
  "Càn-Cấn": "Thiên Sơn Độn",
  "Càn-Khôn": "Thiên Địa Bĩ",
  "Đoài-Càn": "Trạch Thiên Quải",
  "Đoài-Đoài": "Thuần Đoài (Đoài)",
  "Đoài-Ly": "Trạch Hỏa Cách",
  "Đoài-Chấn": "Trạch Lôi Tùy",
  "Đoài-Tốn": "Trạch Phong Đại Quá",
  "Đoài-Khảm": "Trạch Thủy Khốn",
  "Đoài-Cấn": "Trạch Sơn Hàm",
  "Đoài-Khôn": "Trạch Địa Tụy",
  "Ly-Càn": "Hỏa Thiên Đại Hữu",
  "Ly-Đoài": "Hỏa Trạch Khuê",
  "Ly-Ly": "Thuần Ly (Ly)",
  "Ly-Chấn": "Hỏa Lôi Phệ Hạp",
  "Ly-Tốn": "Hỏa Phong Đỉnh",
  "Ly-Khảm": "Hỏa Thủy Vị Tế",
  "Ly-Cấn": "Hỏa Sơn Lữ",
  "Ly-Khôn": "Hỏa Địa Tấn",
  "Chấn-Càn": "Lôi Thiên Đại Tráng",
  "Chấn-Đoài": "Lôi Trạch Quy Muội",
  "Chấn-Ly": "Lôi Hỏa Phong",
  "Chấn-Chấn": "Thuần Chấn (Chấn)",
  "Chấn-Tốn": "Lôi Phong Hằng",
  "Chấn-Khảm": "Lôi Thủy Giải",
  "Chấn-Cấn": "Lôi Sơn Tiểu Quá",
  "Chấn-Khôn": "Lôi Địa Dự",
  "Tốn-Càn": "Phong Thiên Tiểu Súc",
  "Tốn-Đoài": "Phong Trạch Trung Phu",
  "Tốn-Ly": "Phong Hỏa Gia Nhân",
  "Tốn-Chấn": "Phong Lôi Ích",
  "Tốn-Tốn": "Thuần Tốn (Tốn)",
  "Tốn-Khảm": "Phong Thủy Hoán",
  "Tốn-Cấn": "Phong Sơn Tiệm",
  "Tốn-Khôn": "Phong Địa Quán",
  "Khảm-Càn": "Thủy Thiên Nhu",
  "Khảm-Đoài": "Thủy Trạch Tiết",
  "Khảm-Ly": "Thủy Hỏa Ký Tế",
  "Khảm-Chấn": "Thủy Lôi Truân",
  "Khảm-Tốn": "Thủy Phong Tỉnh",
  "Khảm-Khảm": "Thuần Khảm (Khảm)",
  "Khảm-Cấn": "Thủy Sơn Kiển",
  "Khảm-Khôn": "Thủy Địa Tỷ",
  "Cấn-Càn": "Sơn Thiên Đại Súc",
  "Cấn-Đoài": "Sơn Trạch Tổn",
  "Cấn-Ly": "Sơn Hỏa Bí",
  "Cấn-Chấn": "Sơn Lôi Di",
  "Cấn-Tốn": "Sơn Phong Cổ",
  "Cấn-Khảm": "Sơn Thủy Mông",
  "Cấn-Cấn": "Thuần Cấn (Cấn)",
  "Cấn-Khôn": "Sơn Địa Bác",
  "Khôn-Càn": "Địa Thiên Thái",
  "Khôn-Đoài": "Địa Trạch Lâm",
  "Khôn-Ly": "Địa Hỏa Minh Di",
  "Khôn-Chấn": "Địa Lôi Phục",
  "Khôn-Tốn": "Địa Phong Thăng",
  "Khôn-Khảm": "Địa Thủy Sư",
  "Khôn-Cấn": "Địa Sơn Khiêm",
  "Khôn-Khôn": "Thuần Khôn",
};

// index mod 8 (1–8)
export const mod8Index = (sum) => (sum % 8 === 0 ? 8 : sum % 8);

// Lấy quái theo chỉ số 1–8
export function trigramByIdx1to8(i) {
  return TRIGRAM_ORDER[(i - 1) % 8];
}

// build 6 hào: [hạ, thượng]
export function buildLines(upperBits, lowerBits) {
  return [...lowerBits, ...upperBits];
}

// lật hào động
export function flipLine(lines, moving) {
  const a = lines.slice();
  a[moving - 1] = a[moving - 1] ? 0 : 1;
  return a;
}

// tìm quái từ bits
export function trigramNameByBits(bits) {
  const t = TRIGRAM_ORDER.find(
    (x) =>
      x.bits[0] === bits[0] && x.bits[1] === bits[1] && x.bits[2] === bits[2]
  );
  return t ? t.name : "Khôn";
}
