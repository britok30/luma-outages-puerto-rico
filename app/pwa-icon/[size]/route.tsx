import { ImageResponse } from "next/og";

const SIZES = [192, 512] as const;

export const dynamicParams = false;
export const generateStaticParams = () => SIZES.map((size) => ({ size: String(size) }));

/** Home-screen / notification icons for the web app manifest (same mark as apple-icon). */
export async function GET(_: Request, { params }: { params: Promise<{ size: string }> }) {
  const size = Number((await params).size);
  // Maskable icons get cropped to a circle, so keep the mark inside the safe zone.
  const mark = Math.round(size * 0.4);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a1a3f" }}>
        <div style={{ width: mark, height: mark, background: "#e92228" }} />
      </div>
    ),
    { width: size, height: size }
  );
}
