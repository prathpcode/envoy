import { DitherImage } from "@pixel3d/ui";

// A stand-in photo, drawn as an SVG: a laptop at sunset on the hack floor.
const scene = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a1d24"/><stop offset="0.7" stop-color="#9aa3b5"/><stop offset="1" stop-color="#f2e9dc"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d8d0c4"/>
    </radialGradient>
  </defs>
  <rect width="480" height="360" fill="url(#sky)"/>
  <circle cx="330" cy="170" r="70" fill="url(#sun)"/>
  <path d="M0 250 L90 200 L170 235 L260 190 L360 240 L480 205 L480 360 L0 360 Z" fill="#3a3f4a"/>
  <rect x="120" y="190" width="200" height="120" fill="#2b2e35"/>
  <rect x="132" y="202" width="176" height="96" fill="#cdd1d8"/>
  <rect x="96" y="310" width="248" height="16" fill="#141414"/>
  <circle cx="190" cy="250" r="18" fill="#ffffff"/>
  <rect x="236" y="236" width="40" height="28" fill="#4a4d55"/>
</svg>`)}`;

export default function DitherImageInks() {
  return (
    <>
      <div className="w-full max-w-64">
        <DitherImage src={scene} alt="A laptop covered in stickers at sunset" ink="pink" />
      </div>
      <div className="w-full max-w-64">
        <DitherImage src={scene} alt="The same laptop, in sky" ink="sky" />
      </div>
      <div className="w-full max-w-64">
        <DitherImage src={scene} alt="The same laptop, in lime, with chunkier dots" ink="lime" scale={5} />
      </div>
    </>
  );
}
