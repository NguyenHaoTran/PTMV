// luchao-hoamai.js
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
  const elNhat = ELEMENT[nhatCan];
  const elHao = ELEMENT[haoCan];
  if (!elNhat || !elHao) return "";
  return REL[relation(elNhat, elHao)] || "";
}

/**
 * linesMain:  [hào1..hào6] – 0 = Âm, 1 = Dương
 * linesChange: giống trên cho quẻ biến
 * moving: số hào động (1–6, từ dưới lên)
 * nhatCan: "Giáp", "Ất"...
 */
export function renderLucHaoTable(
  linesMain = [],
  linesChange = [],
  moving = 0,
  nhatCan
) {
  const tbody = document.getElementById("r-lines");
  if (!tbody) return;

  if (!nhatCan || !ELEMENT[nhatCan]) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9">— Chưa có dữ liệu Lục Hào —</td>
      </tr>
    `;
    return;
  }

  let html = "";

  for (let hao = 6; hao >= 1; hao--) {
    const idx = hao - 1;

    const valMain = Array.isArray(linesMain) ? linesMain[idx] : undefined;
    const valChange = Array.isArray(linesChange) ? linesChange[idx] : undefined;

    const isYangMain = valMain === 1;
    const isYinMain = valMain === 0;
    const isYangChange = valChange === 1;
    const isYinChange = valChange === 0;

    const textMainYao = isYangMain ? "Dương" : isYinMain ? "Âm" : "";
    const textChangeYao = isYangChange ? "Dương" : isYinChange ? "Âm" : "";

    const isMoving = moving === hao;

    const canMain = CAN[hao % 10];
    const canChange = CAN[(hao + 3) % 10];

    const ltMain = lucThan(nhatCan, canMain);
    const ltChange = lucThan(nhatCan, canChange);

    const theUng = hao === 3 ? "Thế" : hao === 6 ? "Ứng" : "";

    const trangThaiMain = isMoving
      ? "Động"
      : isYangMain || isYinMain
      ? "Tĩnh"
      : "";

    const trangThaiChange = isMoving
      ? "Biến"
      : isYangChange || isYinChange
      ? "Bình"
      : "";

    const bienMoTa =
      (isYangMain || isYinMain) && (isYangChange || isYinChange)
        ? `${textMainYao} → ${textChangeYao}`
        : isMoving
        ? "→"
        : "";

    html += `
      <tr class="${isMoving ? "row-moving" : ""}">
        <td>${hao}</td>
        <td>${theUng}</td>
        <td class="col-main">${ltMain}</td>
        <td class="col-main">${canMain}</td>
        <td>${trangThaiMain}</td>
        <td class="col-bien">${bienMoTa}</td>
        <td class="col-change">${ltChange}</td>
        <td class="col-change">${canChange}</td>
        <td>${trangThaiChange}</td>
      </tr>
    `;
  }

  tbody.innerHTML = html;
}
