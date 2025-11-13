// utils.js
export const onlyDigits = (s) => (s || "").replace(/\D+/g, "");

export const sumDigits = (s) => s.split("").reduce((t, c) => t + (+c || 0), 0);

export const firstN = (s, n) => s.slice(0, Math.min(n, s.length));

export const lastN = (s, n) => s.slice(Math.max(0, s.length - n));

export const localDateStr = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const localTimeStr = (d) =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(
    2,
    "0"
  )}`;

// DOM helpers
export function setText(id, s) {
  const el = document.getElementById(id);
  if (el) el.textContent = s;
}

export function setVal(id, s) {
  const el = document.getElementById(id);
  if (el) el.value = s;
}

export function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}
