/* =========================================================================
   LUẬN SỐ ĐIỆN THOẠI – MAIN.JS (final + Bảng LỤC HÀO)
   - Cụm đầu = Thượng quái, Cụm cuối = Hạ quái (mod 8; 0 -> 8)
   - Hào động = tổng toàn bộ % 6 (0 -> 6)
   - Có tên quẻ CHỦ & tên quẻ BIẾN (map 64 quẻ + fallback)
   - Tứ trụ, Tiết khí, Nguyệt lệnh, Tuần Không
   - Bảng LỤC HÀO (Lục Thân, Thế/Ứng, Trạng thái)
   ======================================================================= */

/* -------------------- CAN–CHI & TỨ TRỤ -------------------- */
const CAN = [
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
const CHI = [
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

function getYearCanChi(year) {
  return `${CAN[(year + 6) % 10]} ${CHI[(year + 8) % 12]}`;
}
function getDayCanChi(date) {
  const base = new Date(1900, 0, 1);
  const diff = Math.floor((date - base) / (24 * 3600 * 1000));
  return `${CAN[(diff + 40) % 10]} ${CHI[(diff + 10) % 12]}`;
}
function getMonthCanChi(yearCanIndex, month) {
  return `${CAN[(yearCanIndex * 2 + month + 2) % 10]} ${
    CHI[(2 + (month - 1)) % 12]
  }`;
}
function getHourCanChi(dayCanIndex, hour) {
  const chiIndex = Math.floor((hour + 1) / 2) % 12;
  return `${CAN[(dayCanIndex * 2 + chiIndex) % 10]} ${CHI[chiIndex]}`;
}
function getAllCanChi(date) {
  const yearCC = getYearCanChi(date.getFullYear());
  const yearCanIdx = CAN.indexOf(yearCC.split(" ")[0]);
  const dayCC = getDayCanChi(date);
  const dayCanIdx = CAN.indexOf(dayCC.split(" ")[0]);
  const monthCC = getMonthCanChi(yearCanIdx, date.getMonth() + 1);
  const hourCC = getHourCanChi(dayCanIdx, date.getHours());
  return { year: yearCC, month: monthCC, day: dayCC, hour: hourCC };
}

/* -------------------- TIẾT KHÍ & NGUYỆT LỆNH -------------------- */
const SOLAR_TERMS = [
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
function getTietKhiVN(date) {
  const m = date.getMonth() + 1,
    d = date.getDate();
  let term = "Đông Chí";
  for (const t of SOLAR_TERMS) {
    if (m > t.m || (m === t.m && d >= t.d)) term = t.name;
  }
  return term;
}
function getNguyetLenh(canChiMonth) {
  return canChiMonth.split(" ")[1] || "—";
}

/* -------------------- TUẦN KHÔNG VONG -------------------- */
function getKhongVong(dayCanChi) {
  const [canStr, chiStr] = dayCanChi.split(" ");
  const dayCanIdx = CAN.indexOf(canStr);
  const dayChiIdx = CHI.indexOf(chiStr);
  if (dayCanIdx < 0 || dayChiIdx < 0) return "—";
  const start = (dayChiIdx - dayCanIdx + 12) % 12; // chi của ngày Giáp trong tuần
  const k1 = CHI[(start + 10) % 12];
  const k2 = CHI[(start + 11) % 12];
  return `${k1} – ${k2}`;
}

/* -------------------- BÁT QUÁI & 64 QUẺ -------------------- */
const TRIGRAM_ORDER = [
  { name: "Càn", bits: [1, 1, 1] },
  { name: "Đoài", bits: [1, 1, 0] },
  { name: "Ly", bits: [1, 0, 1] },
  { name: "Chấn", bits: [1, 0, 0] },
  { name: "Tốn", bits: [0, 1, 1] },
  { name: "Khảm", bits: [0, 1, 0] },
  { name: "Cấn", bits: [0, 0, 1] },
  { name: "Khôn", bits: [0, 0, 0] },
];
const TRIGRAM_WORD = {
  Càn: "Thiên",
  Khôn: "Địa",
  Ly: "Hỏa",
  Khảm: "Thủy",
  Chấn: "Lôi",
  Tốn: "Phong",
  Cấn: "Sơn",
  Đoài: "Trạch",
};

// Tên 64 quẻ (đủ các cặp thượng–hạ). Nếu cặp nào chưa có, sẽ fallback ghép Thiên/Địa...
const HEX_NAME = {
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

/* -------------------- TIỆN ÍCH -------------------- */
const onlyDigits = (s) => (s || "").replace(/\D+/g, "");
const sumDigits = (s) => s.split("").reduce((t, c) => t + (+c || 0), 0);
const firstN = (s, n) => s.slice(0, Math.min(n, s.length));
const lastN = (s, n) => s.slice(Math.max(0, s.length - n));
const mod8Index = (sum) => (sum % 8 === 0 ? 8 : sum % 8);
function trigramByIdx1to8(i) {
  return TRIGRAM_ORDER[(i - 1) % 8];
}
function buildLines(upperBits, lowerBits) {
  return [...lowerBits, ...upperBits];
}
function flipLine(lines, moving) {
  const a = lines.slice();
  a[moving - 1] = a[moving - 1] ? 0 : 1;
  return a;
}
function trigramNameByBits(bits) {
  const t = TRIGRAM_ORDER.find(
    (x) =>
      x.bits[0] === bits[0] && x.bits[1] === bits[1] && x.bits[2] === bits[2]
  );
  return t ? t.name : "Khôn";
}
const localDateStr = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
const localTimeStr = (d) =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(
    2,
    "0"
  )}`;

/* -------------------- LỤC THÂN & BẢNG LỤC HÀO -------------------- */
// Ngũ hành của Can
const ELEMENT = {
  Giáp: "Mộc",
  Ất: "Mộc",
  Bính: "Hỏa",
  Đinh: "Hỏa",
  Mậu: "Thổ",
  Kỷ: "Thổ",
  Canh: "Kim",
  Tân: "Kim",
  Nhâm: "Thủy",
  Quý: "Thủy",
};
// Quan hệ -> Lục thân (mô phỏng rút gọn)
const REL = {
  "sinh ra": "Tử Tôn",
  "bị sinh": "Phụ Mẫu",
  khắc: "Quan Quỷ",
  "bị khắc": "Thê Tài",
  "bình hòa": "Huynh Đệ",
};
const sinh = (x, y) =>
  (x === "Mộc" && y === "Hỏa") ||
  (x === "Hỏa" && y === "Thổ") ||
  (x === "Thổ" && y === "Kim") ||
  (x === "Kim" && y === "Thủy") ||
  (x === "Thủy" && y === "Mộc");
const khac = (x, y) =>
  (x === "Mộc" && y === "Thổ") ||
  (x === "Thổ" && y === "Thủy") ||
  (x === "Thủy" && y === "Hỏa") ||
  (x === "Hỏa" && y === "Kim") ||
  (x === "Kim" && y === "Mộc");
function relation(a, b) {
  if (a === b) return "bình hòa";
  if (sinh(a, b)) return "sinh ra";
  if (sinh(b, a)) return "bị sinh";
  if (khac(a, b)) return "khắc";
  return "bị khắc";
}
function lucThan(nhatCan, haoCan) {
  return REL[relation(ELEMENT[nhatCan], ELEMENT[haoCan])];
}

function renderLucHaoTable(linesMain, linesChange, moving, nhatCan) {
  const tbody = document.getElementById("r-lines");
  let html = "";
  for (let i = 6; i >= 1; i--) {
    const idx = i % 10; // gán Can minh họa
    const canMain = CAN[idx];
    const canChange = CAN[(idx + 3) % 10];
    const ltMain = lucThan(nhatCan, canMain);
    const ltChange = lucThan(nhatCan, canChange);
    const isMv = i === moving;
    html += `
      <tr class="${isMv ? "row-moving" : ""}">
        <td>${i}</td>
        <td>${i === 3 ? "Thế" : i === 6 ? "Ứng" : ""}</td>
        <td>${ltMain}</td>
        <td>${canMain}</td>
        <td>${isMv ? "Động" : "Tĩnh"}</td>
        <td>${isMv ? "" : ""}</td>
        <td>${ltChange}</td>
        <td>${canChange}</td>
        <td>${isMv ? "Biến" : "Bình"}</td>
      </tr>`;
  }
  tbody.innerHTML = html;
}

/* -------------------- RENDER-------------------- */

function renderGua(containerId, lines, moving) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = "";
  const rows = [];
  for (let i = lines.length - 1; i >= 0; i--) {
    rows.push({
      bit: lines[i],
      isMoving: i === moving - 1,
    });
  }

  rows.reverse();

  for (const row of rows) {
    const d = document.createElement("div");
    d.className =
      "yao " + (row.bit ? "yang" : "yin") + (row.isMoving ? " moving" : "");
    el.appendChild(d);
  }
}

/* --------------------KHỞI TẠO -------------------- */
window.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  setVal("queryDate", localDateStr(now));
  setVal("queryTime", localTimeStr(now));
});

document.getElementById("calcBtn").addEventListener("click", () => {
  const phone = getVal("phone").trim();
  const question = getVal("question").trim();
  let dStr = getVal("queryDate").trim();
  let tStr = getVal("queryTime").trim();
  if (!phone) {
    alert("Vui lòng nhập Số điện thoại!");
    return;
  }
  if (!question) {
    alert("Vui lòng nhập Việc cần xem!");
    return;
  }
  if (!dStr) dStr = localDateStr(new Date());
  if (!tStr) tStr = localTimeStr(new Date());
  const date = new Date(`${dStr}T${tStr}`);

  const tuctru = getAllCanChi(date);
  const tietkhi = getTietKhiVN(date);
  const nguyetlenh = getNguyetLenh(tuctru.month);
  const khongvong = getKhongVong(tuctru.day);

  const P = onlyDigits(phone);
  const head = firstN(P, 5);
  const tail = lastN(P, 5);
  const idxUpper = mod8Index(sumDigits(head));
  const idxLower = mod8Index(sumDigits(tail));
  const upperTri = trigramByIdx1to8(idxUpper);
  const lowerTri = trigramByIdx1to8(idxLower);

  // Quẻ CHỦ
  const mainLines = buildLines(upperTri.bits, lowerTri.bits);
  const mainKey = `${upperTri.name}-${lowerTri.name}`;
  const mainName =
    HEX_NAME[mainKey] ||
    `${TRIGRAM_WORD[upperTri.name]} ${TRIGRAM_WORD[lowerTri.name]}`;

  // Hào động
  const allSum = sumDigits(P);
  const r = allSum % 6;
  const moving = r === 0 ? 6 : r;

  // Quẻ BIẾN
  const changed = flipLine(mainLines, moving);
  const lowerC = changed.slice(0, 3),
    upperC = changed.slice(3, 6);
  const lowerNameC = trigramNameByBits(lowerC);
  const upperNameC = trigramNameByBits(upperC);
  const changeKey = `${upperNameC}-${lowerNameC}`;
  const changeName =
    HEX_NAME[changeKey] ||
    `${TRIGRAM_WORD[upperNameC]} ${TRIGRAM_WORD[lowerNameC]} (biến)`;

  setText("r-question", question);
  setText("r-time", `${dStr} ${tStr}`);
  setText("r-year", tuctru.year);
  setText("r-month", tuctru.month);
  setText("r-day", tuctru.day);
  setText("r-hour", tuctru.hour);
  setText("r-tietkhi", tietkhi);
  setText("r-nguyetlenh", nguyetlenh);
  const kv = document.getElementById("r-khongvong");
  if (kv) kv.textContent = khongvong;

  // Quẻ chủ / quẻ biến + họ, hào động
  setText("r-main-name", mainName.toUpperCase());
  setText("r-change-name", changeName.toUpperCase());
  setText("r-moving", moving);
  setText("r-main-family", upperTri.name);
  setText("r-change-family", upperNameC);

  // Vẽ 6 hào ô vuông
  renderGua("main-gua", mainLines, moving);
  renderGua("change-gua", changed, moving);

  // BẢNG LỤC HÀO (dùng Nhật Can của ngày)
  const nhatCan = tuctru.day.split(" ")[0];
  renderLucHaoTable(mainLines, changed, moving, nhatCan);
});

/* -------------------- DOM HELPERS -------------------- */
function setText(id, s) {
  const el = document.getElementById(id);
  if (el) el.textContent = s;
}
function setVal(id, s) {
  const el = document.getElementById(id);
  if (el) el.value = s;
}
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}
