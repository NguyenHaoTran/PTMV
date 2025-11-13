// tietkhi-json.js
/**
 * Lấy tiết khí hiện tại (hoặc gần nhất) dựa trên file JSON cục bộ.
 * File JSON có cấu trúc:
 * { "2025": [ {stt, ten, solarDate, solarTime, ...}, ... ], "2026": [...], ... }
 */
// const resp = await fetch("Data/tiet_khi.json");

// tietkhi-json.js

// Đọc JSON 1 lần rồi cache để lần sau dùng lại cho nhanh
let _cacheTietKhi = null;

async function loadTietKhiData() {
  if (_cacheTietKhi) return _cacheTietKhi;
  const resp = await fetch("Data/tiet_khi.json");
  _cacheTietKhi = await resp.json();
  return _cacheTietKhi;
}

/**
 * Trả về TIẾT KHÍ đang diễn ra tại thời điểm 'date'
 * Dữ liệu trả về đầy đủ:
 *  - stt, ten, solarDate, solarTime, lunarDate, kinhDo, phanLoai
 *  - solarYear, solarMonth, solarDay (tách sẵn từ solarDate)
 */
export async function getCurrentTietKhiFromJSON(date) {
  const allData = await loadTietKhiData();
  const year = date.getFullYear();
  const list = allData[year];

  if (!list) {
    return {
      stt: 0,
      ten: "Không xác định",
      solarDate: "",
      solarTime: "",
      lunarDate: "",
      kinhDo: null,
      phanLoai: "",
      solarYear: year,
      solarMonth: null,
      solarDay: null,
    };
  }

  const nowTime = date.getTime();
  let current = list[0];

  for (const tk of list) {
    const tkDate = new Date(`${tk.solarDate}T${tk.solarTime}:00`);
    if (nowTime >= tkDate.getTime()) {
      current = tk;
    } else {
      break;
    }
  }

  // tách năm/tháng/ngày từ solarDate
  let solarYear = null,
    solarMonth = null,
    solarDay = null;
  if (current.solarDate) {
    const [y, m, d] = current.solarDate.split("-").map((v) => parseInt(v, 10));
    solarYear = y;
    solarMonth = m;
    solarDay = d;
  }

  return {
    ...current,
    solarYear,
    solarMonth,
    solarDay,
  };
}
