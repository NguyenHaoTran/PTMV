// main.js (ES module)

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
  mod8Index,
} from "./kinhdich.js";

// LỤC HÀO
import { renderLucHaoTable } from "./luchao.js";

// VẼ QUẺ
import { renderGua } from "./renderGua.js";

// TIỆN ÍCH + DOM
import {
  onlyDigits,
  sumDigits,
  firstN,
  lastN,
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

/* -------------------- LẬP QUẺ -------------------- */
async function onCalcClick(event) {
  // tránh submit form reload trang nếu sau này anh bọc bằng <form>
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }

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

  // thêm :00 cho chắc cú (giây)
  const date = new Date(`${dStr}T${tStr}:00`);

  if (isNaN(date.getTime())) {
    alert("Ngày/giờ lập quẻ không hợp lệ!");
    return;
  }

  // ====== TỨ TRỤ + PHỤ LỤC (Can Chi, Nguyệt lệnh, Tuần không) ======
  const tuctru = getAllCanChi(date);
  const nguyetlenh = getNguyetLenh(tuctru.month);
  const khongvong = getKhongVong(tuctru.day);

  // ====== TIẾT KHÍ TỪ JSON 2025–2029 ======
  const tkInfo = await getCurrentTietKhiFromJSON(date);
  // tkInfo có dạng:
  // { stt, ten, solarDate, solarTime, lunarDate, kinhDo, phanLoai, solarYear, solarMonth, solarDay }
  const tietkhi = tkInfo.ten;

  // ====== CỤM ĐẦU/CUỐI SĐT → QUẺ ======
  const P = onlyDigits(phone);
  const head = firstN(P, 5); // Thượng quái = 5 số đầu
  const tail = lastN(P, 5); // Hạ quái = 5 số cuối

  const idxUpper = mod8Index(sumDigits(head));
  const idxLower = mod8Index(sumDigits(tail));

  const upperTri = trigramByIdx1to8(idxUpper);
  const lowerTri = trigramByIdx1to8(idxLower);

  // Quẻ CHỦ: 6 hào (3 dưới = hạ quái, 3 trên = thượng quái)
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
  const lowerC = changed.slice(0, 3);
  const upperC = changed.slice(3, 6);
  const lowerNameC = trigramNameByBits(lowerC);
  const upperNameC = trigramNameByBits(upperC);
  const changeKey = `${upperNameC}-${lowerNameC}`;
  const changeName =
    HEX_NAME[changeKey] ||
    `${TRIGRAM_WORD[upperNameC]} ${TRIGRAM_WORD[lowerNameC]} (biến)`;

  /* -------------------- GÁN KẾT QUẢ LÊN UI -------------------- */

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

  // Nguyệt lệnh & Tuần không
  setText("r-nguyetlenh", nguyetlenh);
  const kv = document.getElementById("r-khongvong");
  if (kv) kv.textContent = khongvong;

  // Quẻ chủ / Quẻ biến + họ quái + hào động
  setText("r-main-name", mainName.toUpperCase());
  setText("r-change-name", changeName.toUpperCase());
  setText("r-moving", moving);
  setText("r-main-family", upperTri.name);
  setText("r-change-family", upperNameC);

  // Vẽ 6 hào ô vuông
  renderGua("main-gua", mainLines, moving);
  renderGua("change-gua", changed, moving);

  // Bảng Lục Hào (dùng Nhật Can của ngày)
  const nhatCan = tuctru.day.split(" ")[0];
  renderLucHaoTable(mainLines, changed, moving, nhatCan);

  // sau khi có tuctru và tkInfo

  // Âm lịch: tạm thời dùng lunarDate trong tkInfo + Can Chi giờ
  const lunarEl = document.getElementById("r-lunar");
  if (lunarEl) {
    lunarEl.textContent = `${tuctru.hour}, ${tkInfo.lunarDate}`;
  }

  // Nhật thần: anh đang dùng Nhật Can của ngày = Can ngày + ngũ hành Thổ/…
  // Tạm thời có thể set đơn giản (sau này muốn tính chuẩn mình viết thêm)
  const nhatThanEl = document.getElementById("r-nhatthan");
  if (nhatThanEl) {
    // ví dụ: lấy CHI trong ngày làm "Nhật thần" cho dễ, sau nâng cấp sau
    nhatThanEl.textContent = tuctru.day;
  }
}
