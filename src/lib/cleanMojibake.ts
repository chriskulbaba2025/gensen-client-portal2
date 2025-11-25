export function cleanMojibake(html: string) {
  return html
    .replace(/Â /g, "")              // common broken prefix
    .replace(/Â/g, "")               // stray lone byte
    .replace(/â/g, "’")
    .replace(/â/g, "“")
    .replace(/â/g, "”")
    .replace(/â/g, "–")
    .replace(/â/g, "—")
    .replace(/â¦/g, "…")
    .replace(/â¢/g, "•")
    .replace(/ï¬/g, "fi");
}
