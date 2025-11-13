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

export function renderLucHaoTable(linesMain, linesChange, moving, nhatCan) {
  const tbody = document.getElementById("r-lines");
  if (!tbody) return;

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
