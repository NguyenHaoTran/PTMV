// renderGua.js
export function renderGua(containerId, lines, moving) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = "";

  // B1: Lấy quẻ theo CÁCH CŨ (đang bị ngược)
  const rows = [];
  for (let i = lines.length - 1; i >= 0; i--) {
    rows.push({
      bit: lines[i], // 1 = dương, 0 = âm
      isMoving: i === moving - 1, // moving đếm từ dưới lên
    });
  }

  // B2: Lật ngược toàn bộ quẻ (trên ↔ dưới)
  rows.reverse();

  // B3: Vẽ theo thứ tự mới
  for (const row of rows) {
    const d = document.createElement("div");
    d.className =
      "yao " + (row.bit ? "yang" : "yin") + (row.isMoving ? " moving" : "");
    el.appendChild(d);
  }
}
