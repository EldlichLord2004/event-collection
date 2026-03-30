/**
 * Map mã unit trong Google Sheet → tên hiển thị.
 * Khóa luôn lowercase để so khớp không phân biệt hoa thường.
 */
export const UNIT_DISPLAY = {
  all: "All",
  vs: "VIRTUAL SINGER",
  ln: "Leo/need",
  mmj: "MORE MORE JUMP !",
  vbs: "Vivid BAD SQUAD",
  wxs: "Wonderlands x Showtime",
  niigo: "25-ji, Nightcord de.",
  mix: "Mix",
};

/**
 * @param {string | null | undefined} unitRaw — giá trị cột Unit từ sheet
 * @returns {string} tên hiển thị, hoặc chuỗi gốc nếu không có trong map
 */
export function formatUnitLabel(unitRaw) {
  if (unitRaw == null || String(unitRaw).trim() === "") return "—";
  const key = String(unitRaw).trim().toLowerCase();
  if (Object.prototype.hasOwnProperty.call(UNIT_DISPLAY, key)) {
    return UNIT_DISPLAY[key];
  }
  return String(unitRaw).trim();
}
