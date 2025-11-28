// luchao.js
import { CAN } from "./canchi.js";

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

/**
 * Render đầy đủ 2 bên Quẻ Chủ / Quẻ Biến giống layout simkinhdich.
 * Các phần P.Thần, T.K, V-S, Q.Thần, Thần Sát, Sao… hiện đang để "-" (placeholder).
 */
export function renderLucHaoTable(linesMain, linesChange, moving, nhatCan) {
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

  // duyệt từ hào 6 xuống 1 để đúng thứ tự
  for (let i = 6; i >= 1; i--) {
    const idx = i % 10;
    const canMain = CAN[idx];
    const canChange = CAN[(idx + 3) % 10];

    const ltMain = lucThan(nhatCan, canMain);
    const ltChange = lucThan(nhatCan, canChange);

    const isMv = i === moving;
    const theUng = i === 3 ? "Thế" : i === 6 ? "Ứng" : "";

    // ========== BẢNG 1: LỤC HÀO CHÍNH ==========
    htmlMainLeft += `
      <tr class="${isMv ? "row-moving" : ""}">
        <td>${i}</td>
        <td>${theUng}</td>
        <td>${ltMain}</td>
        <td>${canMain}</td>
        <td>-</td>
        <td>-</td>
      </tr>`;

    htmlMainRight += `
      <tr class="${isMv ? "row-moving" : ""}">
        <td>${ltChange}</td>
        <td>${canChange}</td>
        <td>-</td>
        <td>-</td>
        <td>${i}</td>
      </tr>`;

    // ========== BẢNG 2: V-S, Q.THẦN, T.S ==========
    // tạm thời dùng "-" để đủ cấu trúc, sau này bạn thay bằng thuật toán thật
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

  // ========== BẢNG 3: LỘC – MÃ – QUÝ – ĐÀO – THẦN Y – NG.GIẢI – N.GIẢI – K.MỘ ==========
  // mỗi bên 4 dòng số cho giống ảnh, có thể sửa theo thuật số của bạn
  starsLeft.innerHTML = `
    <tr><td>-</td><td>5</td><td>4</td><td>2</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
    <tr><td>-</td><td>4</td><td>4</td><td>-</td><td>-</td><td>-</td><td>3</td><td>-</td></tr>
    <tr><td>-</td><td>-</td><td>2</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
    <tr><td>-</td><td>2</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
  `;

  starsRight.innerHTML = `
    <tr><td>-</td><td>5</td><td>4</td><td>3</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
    <tr><td>-</td><td>4</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>4</td></tr>
    <tr><td>-</td><td>-</td><td>3</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
    <tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>3</td></tr>
  `;
}
