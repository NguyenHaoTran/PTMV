// tietkhi.js
export const SOLAR_TERMS = [
  { m: 1, d: 6, name: "Tiểu Hàn" },
  { m: 1, d: 20, name: "Đại Hàn" },
  { m: 2, d: 4, name: "Lập Xuân" },
  { m: 2, d: 19, name: "Vũ Thủy" },
  { m: 3, d: 6, name: "Kinh Trập" },
  { m: 3, d: 21, name: "Xuân Phân" },
  { m: 4, d: 5, name: "Thanh Minh" },
  { m: 4, d: 20, name: "Cốc Vũ" },
  { m: 5, d: 5, name: "Lập Hạ" },
  { m: 5, d: 21, name: "Tiểu Mãn" },
  { m: 6, d: 6, name: "Mang Chủng" },
  { m: 6, d: 21, name: "Hạ Chí" },
  { m: 7, d: 7, name: "Tiểu Thử" },
  { m: 7, d: 22, name: "Đại Thử" },
  { m: 8, d: 7, name: "Lập Thu" },
  { m: 8, d: 23, name: "Xử Thử" },
  { m: 9, d: 7, name: "Bạch Lộ" },
  { m: 9, d: 23, name: "Thu Phân" },
  { m: 10, d: 8, name: "Hàn Lộ" },
  { m: 10, d: 23, name: "Sương Giáng" },
  { m: 11, d: 7, name: "Lập Đông" },
  { m: 11, d: 22, name: "Tiểu Tuyết" },
  { m: 12, d: 7, name: "Đại Tuyết" },
  { m: 12, d: 22, name: "Đông Chí" },
];

export function getTietKhiVN(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  let term = "Đông Chí";
  for (const t of SOLAR_TERMS) {
    if (m > t.m || (m === t.m && d >= t.d)) term = t.name;
  }
  return term;
}
