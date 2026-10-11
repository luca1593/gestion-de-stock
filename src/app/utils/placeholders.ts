const SVG_NS = 'data:image/svg+xml,';

function encode(svg: string): string {
  return SVG_NS + encodeURIComponent(svg);
}

export const PLACEHOLDER_PERSON = encode(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="50" fill="#e9ecef"/>
    <circle cx="50" cy="38" r="16" fill="#adb5bd"/>
    <path d="M18 82c0-16 14-30 32-30s32 14 32 30" fill="#adb5bd"/>
  </svg>`
);

export const PLACEHOLDER_ARTICLE = encode(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="12" fill="#e9ecef"/>
    <rect x="28" y="30" width="44" height="32" rx="4" fill="#adb5bd"/>
    <rect x="32" y="70" width="36" height="4" rx="2" fill="#ced4da"/>
    <rect x="32" y="78" width="24" height="4" rx="2" fill="#ced4da"/>
  </svg>`
);
