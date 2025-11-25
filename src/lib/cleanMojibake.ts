export function cleanMojibake(html: string) {
  return html
    .replace(/â/g, "’")
    .replace(/â/g, "“")
    .replace(/â/g, "”")
    .replace(/â¢/g, "•")
    .replace(/â/g, "–")
    .replace(/â/g, "—")
    .replace(/â¦/g, "…")
    .replace(/ï¬/g, "fi")
    .replace(/Â/g, "");
}
