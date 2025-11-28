// main-hoamai.js – Quẻ Hoa Mai, 3 quẻ: Chủ / Hỗ / Biến

// CAN–CHI, TỨ TRỤ, NGUYỆT LỆNH, TUẦN KHÔNG
import { getAllCanChi, getNguyetLenh, getKhongVong } from "./canchi.js";

// TIẾT KHÍ từ file JSON 2025–2029
import { getCurrentTietKhiFromJSON } from "./tietkhi-json.js";

// BÁT QUÁI – 64 QUẺ
import {
  TRIGRAM_WORD,
  HEX_NAME,
  trigramByIdx1to8,
  buildLines,
  flipLine,
  trigramNameByBits,
} from "./kinhdich.js";

// LỤC HÀO (bản Hoa Mai)
import { renderLucHaoTable } from "./luchao-hoamai.js";

// VẼ QUẺ
import { renderGua } from "./renderGua.js";

// TIỆN ÍCH + DOM
import {
  localDateStr,
  localTimeStr,
  setText,
  setVal,
  getVal,
} from "./utils.js";

/* -------------------- KHỞI TẠO -------------------- */
window.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  setVal("queryDate", localDateStr(now));
  setVal("queryTime", localTimeStr(now));

  const btn = document.getElementById("calcBtn");
  if (btn) {
    btn.addEventListener("click", onCalcClick);
  }
});

/* -------------------- LẬP QUẺ HOA MAI -------------------- */
async function onCalcClick(event) {
  if (event?.preventDefault) event.preventDefault();

  const question = getVal("question").trim();
  let dStr = getVal("queryDate").trim();
  let tStr = getVal("queryTime").trim();

  if (!question) {
    alert("Vui lòng nhập Việc cần xem!");
    return;
  }

  if (!dStr) dStr = localDateStr(new Date());
  if (!tStr) tStr = localTimeStr(new Date());

  const date = new Date(`${dStr}T${tStr}:00`);
  if (isNaN(date.getTime())) {
    alert("Ngày/giờ lập quẻ không hợp lệ!");
    return;
  }

  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const H = date.getHours();
  const m = date.getMinutes();

  /* ====== 1. CÔNG THỨC HOA MAI: Thượng / Hạ quái + Hào động ====== */

  // Thượng quái
  const S1 = Y + M + D;
  let idxUpper = S1 % 8;
  if (idxUpper === 0) idxUpper = 8;

  // Hạ quái
  const S2 = S1 + H;
  let idxLower = S2 % 8;
  if (idxLower === 0) idxLower = 8;

  // Hào động
  const S3 = S2 + m;
  let moving = S3 % 6;
  if (moving === 0) moving = 6;

  const upperTri = trigramByIdx1to8(idxUpper);
  const lowerTri = trigramByIdx1to8(idxLower);

  // Quẻ CHỦ: 6 hào (h1 dưới cùng → h6 trên cùng)
  const mainLines = buildLines(upperTri.bits, lowerTri.bits);
  const mainKey = `${upperTri.name}-${lowerTri.name}`;
  const mainName =
    HEX_NAME[mainKey] ||
    `${TRIGRAM_WORD[upperTri.name]} ${TRIGRAM_WORD[lowerTri.name]}`;

  // Quẻ HỖ: lấy 4 hào giữa của quẻ chủ
  // Hạ quái hỗ = h2, h3, h4 ; Thượng quái hỗ = h3, h4, h5
  const hoLower = mainLines.slice(1, 4); // h2,h3,h4
  const hoUpper = mainLines.slice(2, 5); // h3,h4,h5
  const hoLines = [...hoLower, ...hoUpper];

  const hoLowerName = trigramNameByBits(hoLower);
  const hoUpperName = trigramNameByBits(hoUpper);
  const hoKey = `${hoUpperName}-${hoLowerName}`;
  const hoName =
    HEX_NAME[hoKey] ||
    `${TRIGRAM_WORD[hoUpperName]} ${TRIGRAM_WORD[hoLowerName]}`;

  // Quẻ BIẾN: lật hào động
  const changed = flipLine(mainLines, moving);
  const lowerC = changed.slice(0, 3);
  const upperC = changed.slice(3, 6);
  const lowerNameC = trigramNameByBits(lowerC);
  const upperNameC = trigramNameByBits(upperC);
  const changeKey = `${upperNameC}-${lowerNameC}`;
  const changeName =
    HEX_NAME[changeKey] ||
    `${TRIGRAM_WORD[upperNameC]} ${TRIGRAM_WORD[lowerNameC]} (biến)`;

  /* ====== 2. CAN CHI – TIẾT KHÍ – TUẦN KHÔNG ====== */

  const tuctru = getAllCanChi(date);
  const nguyetlenh = getNguyetLenh(tuctru.month);
  const khongvong = getKhongVong(tuctru.day);

  const tkInfo = await getCurrentTietKhiFromJSON(date);
  const tietkhi = tkInfo.ten;

  /* ====== 3. GÁN KẾT QUẢ LÊN UI ====== */

  // Thông tin chung
  setText("r-question", question);
  setText("r-time", `${dStr} ${tStr}`);

  setText("r-year", tuctru.year);
  setText("r-month", tuctru.month);
  setText("r-day", tuctru.day);
  setText("r-hour", tuctru.hour);

  // Tiết khí
  setText("r-tietkhi", tietkhi);
  const tkDetailEl = document.getElementById("r-tietkhi-detail");
  if (tkDetailEl) {
    tkDetailEl.textContent =
      `${tkInfo.solarDate} ${tkInfo.solarTime} | Âm lịch bắt đầu: ${tkInfo.lunarDate} | ` +
      `Kinh độ: ${tkInfo.kinhDo}° | ${tkInfo.phanLoai}`;
  }

  const kv = document.getElementById("r-khongvong");
  if (kv) kv.textContent = khongvong;

  // Quẻ CHỦ
  setText("r-main-name", mainName.toUpperCase());
  setText("r-main-family", upperTri.name);

  // Quẻ HỖ
  setText("r-ho-name", hoName.toUpperCase());
  setText("r-ho-family", hoUpperName);

  // Quẻ BIẾN
  setText("r-change-name", changeName.toUpperCase());
  setText("r-change-family", upperNameC);

  // Hào động
  setText("r-moving", moving);

  // Vẽ 3 quẻ
  renderGua("main-gua", mainLines, moving);
  renderGua("ho-gua", hoLines, 0); // quẻ hỗ không tô hào động
  renderGua("change-gua", changed, moving);

  // Bảng Lục Hào: dùng Nhật Can của ngày
  const nhatCan = tuctru.day.split(" ")[0];
  renderLucHaoTable(mainLines, changed, moving, nhatCan);

  // Âm lịch
  const lunarEl = document.getElementById("r-lunar");
  if (lunarEl) {
    lunarEl.textContent = `${tuctru.hour}, ${tkInfo.lunarDate}`;
  }
}
