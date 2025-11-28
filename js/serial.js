// js/serial.js

// ====== LỤC THÂN TỪ NGŨ HÀNH & CAN ======

const CAN = [
  "", // bỏ trống để index 1 = Giáp
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

// ====== XỬ LÝ SERIAL → 3 QUẺ ======

function normalizeSerial(str) {
  if (!str) return "";
  return (str.match(/\d/g) || []).join("");
}

/**
 * Từ serial → 3 quẻ:
 *  - quẻ trái (Tiểu Quỷ)
 *  - quẻ giữa (trung quái)
 *  - quẻ phải (Thời Ma)
 *
 * Ở đây mình dùng rule DEMO:
 *  - Trái: 6 số đầu
 *  - Giữa: 6 số tiếp theo (dịch sang phải 2 số)
 *  - Phải: 6 số cuối (hoặc đảo ngược)
 *  - Hào dương = số lẻ, âm = số chẵn
 *  - Hào động trái / phải: tổng % 6 + 1
 */
function buildSerialHexagrams(digits) {
  if (!digits) digits = "123456789012";
  while (digits.length < 12) {
    digits += digits;
  }
  digits = digits.slice(0, 12);

  const p1 = digits.slice(0, 6);
  const p2 = digits.slice(2, 8);
  const p3 = digits.slice(6, 12);

  const left = {};
  const mid = {};
  const right = {};
  let sumLeft = 0;
  let sumRight = 0;

  for (let i = 1; i <= 6; i++) {
    const d1 = parseInt(p1[i - 1], 10);
    const d2 = parseInt(p2[i - 1], 10);
    const d3 = parseInt(p3[i - 1], 10);

    left[i] = d1 % 2 === 1; // true = dương
    mid[i] = d2 % 2 === 1;
    right[i] = d3 % 2 === 1;

    sumLeft += d1;
    sumRight += d3;
  }

  const movingLeft = (sumLeft % 6) + 1;
  const movingRight = (sumRight % 6) + 1;

  return { left, mid, right, movingLeft, movingRight };
}

// ====== RENDER 1 QUẺ (6 HÀO) ======

function renderGua(containerId, lines, moving) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = "";

  for (let i = 1; i <= 6; i++) {
    const isYang = lines[i];
    const div = document.createElement("div");
    div.classList.add("yao");
    if (!isYang) div.classList.add("yin");
    if (moving && i === moving) div.classList.add("moving");
    el.prepend(div); // hào 6 nằm trên
  }
}

// ====== RENDER BẢNG LỤC HÀO (TRÁI / PHẢI) ======

function renderLucHaoTableSerial(
  linesLeft,
  linesRight,
  movingLeft,
  movingRight,
  nhatCan = "Giáp"
) {
  const mainLeft = document.getElementById("r-lh-main-left");
  const mainRight = document.getElementById("r-lh-main-right");
  const vsLeft = document.getElementById("r-lh-vs-left");
  const vsRight = document.getElementById("r-lh-vs-right");
  const starsLeft = document.getElementById("r-lh-stars-left");
  const starsRight = document.getElementById("r-lh-stars-right");

  if (!mainLeft || !mainRight) return;

  let htmlMainLeft = "";
  let htmlMainRight = "";
  let htmlVsLeft = "";
  let htmlVsRight = "";

  for (let i = 6; i >= 1; i--) {
    const idx = i % 10 || 10;
    const canLeft = CAN[idx];
    const canRight = CAN[((idx + 3 - 1) % 10) + 1];

    const ltLeft = lucThan(nhatCan, canLeft);
    const ltRight = lucThan(nhatCan, canRight);

    const isMvLeft = i === movingLeft;
    const isMvRight = i === movingRight;
    const theUngLeft = i === 3 ? "Thế" : i === 6 ? "Ứng" : "";

    // Bảng 1 – Tiểu Quỷ
    htmlMainLeft += `
      <tr class="${isMvLeft ? "row-moving" : ""}">
        <td>${i}</td>
        <td>${theUngLeft}</td>
        <td>${ltLeft}</td>
        <td>${canLeft}</td>
        <td>-</td>
        <td>-</td>
      </tr>`;

    // Bảng 1 – Thời Ma
    htmlMainRight += `
      <tr class="${isMvRight ? "row-moving" : ""}">
        <td>${ltRight}</td>
        <td>${canRight}</td>
        <td>-</td>
        <td>-</td>
        <td>${i}</td>
      </tr>`;

    // Bảng 2 – VS / Thần sát (demo)
    htmlVsLeft += `
      <tr>
        <td>Đinh ${["Mùi", "Dậu", "Hợi", "Thân", "Ngọ", "Thìn"][6 - i]}</td>
        <td>-</td>
        <td>-</td>
        <td>M.Dục</td>
        <td>L.Quan</td>
      </tr>`;

    htmlVsRight += `
      <tr>
        <td>Đinh ${["Mùi", "Dậu", "Hợi", "Hợi", "Sửu", "Mão"][6 - i]}</td>
        <td>-</td>
        <td>M.Dục</td>
        <td>L.Quan</td>
      </tr>`;
  }

  mainLeft.innerHTML = htmlMainLeft;
  mainRight.innerHTML = htmlMainRight;
  vsLeft.innerHTML = htmlVsLeft;
  vsRight.innerHTML = htmlVsRight;

  // Bảng 3 – Sao: luôn 4 dòng fallback giống layout simkinhdich
  const fallbackStarsLeft = [
    ["-", "5", "-", "-", "-", "-", "-", "-"],
    ["-", "4", "4", "-", "-", "-", "-", "4"],
    ["-", "-", "-", "-", "-", "3", "-", "-"],
    ["2", "-", "2", "-", "-", "-", "-", "-"],
  ];
  let htmlStarLeft = "";
  fallbackStarsLeft.forEach((row) => {
    htmlStarLeft += `
      <tr>
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
        <td>${row[5]}</td>
        <td>${row[6]}</td>
        <td>${row[7]}</td>
      </tr>`;
  });
  starsLeft.innerHTML = htmlStarLeft;

  const fallbackStarsRight = [
    ["-", "5", "-", "-", "-", "-", "-", "-"],
    ["-", "4", "4", "-", "-", "-", "-", "4"],
    ["-", "-", "-", "-", "-", "3", "-", "-"],
    ["-", "-", "3", "-", "-", "-", "-", "3"],
  ];
  let htmlStarRight = "";
  fallbackStarsRight.forEach((row) => {
    htmlStarRight += `
      <tr>
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
        <td>${row[5]}</td>
        <td>${row[6]}</td>
        <td>${row[7]}</td>
      </tr>`;
  });
  starsRight.innerHTML = htmlStarRight;
}

// ====== XỬ LÝ FORM ======

function formatDateTimeOutput(date, time) {
  if (!date) return "—";
  const [y, m, d] = date.split("-");
  const t = time || "";
  return `${d}/${m}/${y}${t ? " " + t : ""}`;
}

function handleCalc() {
  const serialInput = document.getElementById("serial");
  const questionInput = document.getElementById("question");
  const dateInput = document.getElementById("queryDate");
  const timeInput = document.getElementById("queryTime");

  const rawSerial = serialInput.value.trim();
  const digits = normalizeSerial(rawSerial);

  if (!digits) {
    alert("Vui lòng nhập Serial tiền (phải có ít nhất 1 chữ số).");
    return;
  }

  const question = questionInput.value.trim() || "—";
  const date = dateInput.value || "";
  const time = timeInput.value || "";

  // Thông tin header
  document.getElementById("r-method").textContent = "Lập quẻ bằng Serial tiền";
  document.getElementById("r-question").textContent = question;
  document.getElementById("r-time").textContent = formatDateTimeOutput(
    date,
    time
  );
  document.getElementById("r-lunar").textContent = "—";
  document.getElementById("r-hour").textContent = "—";
  document.getElementById("r-day").textContent = "—";
  document.getElementById("r-month").textContent = "—";
  document.getElementById("r-year").textContent = "—";
  document.getElementById("r-tietkhi").textContent = "—";
  document.getElementById("r-tietkhi-detail").textContent = "—";
  document.getElementById("r-khongvong").textContent = "—";

  // Lập 3 quẻ từ serial
  const { left, mid, right, movingLeft, movingRight } =
    buildSerialHexagrams(digits);

  renderGua("left-gua", left, movingLeft);
  renderGua("mid-gua", mid, null); // thường quẻ giữa không tô hào động
  renderGua("right-gua", right, movingRight);

  // Tên quẻ – tạm placeholder, sau bạn thay bằng tên thật theo kinh dịch
  document.getElementById("r-left-name").textContent = "Quẻ Tiểu Quỷ";
  document.getElementById("r-mid-name").textContent = "Quẻ Trung";
  document.getElementById("r-right-name").textContent = "Quẻ Thời Ma";

  document.getElementById("r-left-family").textContent = "—";
  document.getElementById("r-mid-family").textContent = "—";
  document.getElementById("r-right-family").textContent = "—";

  document.getElementById("r-moving-left").textContent = movingLeft;
  document.getElementById("r-moving-right").textContent = movingRight;

  // Lục Hào cho Tiểu Quỷ & Thời Ma
  renderLucHaoTableSerial(left, right, movingLeft, movingRight, "Giáp");
}

// ====== INIT ======

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("calcBtn");
  if (btn) btn.addEventListener("click", handleCalc);
});
