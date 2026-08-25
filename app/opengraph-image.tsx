import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getClientsWithoutService } from "@/lib/stats";
import { parseLumaTimestamp } from "@/lib/time";

export const alt = "Apagón Puerto Rico — clientes sin luz ahora mismo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 300;

const font = (file: string) => readFile(path.join(process.cwd(), "app/fonts", file));
const fmt = (n: number) => n.toLocaleString("en-US");

export default async function OpenGraphImage() {
  const [bold, regular, outage] = await Promise.all([
    font("EudoxusSans-Bold.ttf"),
    font("EudoxusSans-Regular.ttf"),
    getClientsWithoutService(),
  ]);

  const totals = outage?.totals;
  const without = totals?.totalClientsWithoutService ?? null;
  const pct = totals?.totalPercentageWithoutService ?? null;
  const worst = outage
    ? [...outage.regions].sort((a, b) => b.percentageClientsWithoutService - a.percentageClientsWithoutService)[0]
    : null;
  const when = parseLumaTimestamp(outage?.timestamp);
  const stamp = when
    ? new Intl.DateTimeFormat("es-PR", {
        timeZone: "America/Puerto_Rico",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      }).format(when) + " AST"
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#0a1a3f",
          color: "#f8f8f5",
          fontFamily: "Eudoxus",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 26, letterSpacing: 4, color: "#a9c4de" }}>
          <div style={{ width: 16, height: 16, background: "#e92228", marginRight: 18 }} />
          APAGÓN PUERTO RICO · EN VIVO
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 200, fontWeight: 700, lineHeight: 0.95, letterSpacing: -8 }}>
            {without === null ? "—" : fmt(without)}
          </div>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#87cefa", letterSpacing: -2, marginTop: 8 }}>
            clientes sin luz
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 30, color: "#a9c4de" }}>
          <div style={{ display: "flex" }}>
            {pct !== null && `${pct}% de ${fmt(totals!.totalClients)} clientes`}
            {worst && ` · ${worst.name} ${worst.percentageClientsWithoutService}%`}
          </div>
          <div style={{ display: "flex", fontSize: 24 }}>{stamp ? `LUMA · ${stamp}` : "apagonpuertorico.com"}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Eudoxus", data: bold, weight: 700, style: "normal" },
        { name: "Eudoxus", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
