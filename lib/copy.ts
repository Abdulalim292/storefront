// Catalog copy arrives from supplier sheets with en dashes and middle dots.
// Ranges read as "500 to 700", and meta strings split on their own lines.
export function cleanDash(text: string) {
  return text
    .replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, '$1 to $2')
    .replace(/\s*[\u2013\u2014]\s*/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function splitMeta(text: string) {
  return text
    .split('\u00b7')
    .map((part) => cleanDash(part))
    .filter(Boolean);
}
