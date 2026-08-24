import fs from "node:fs/promises";
import path from "node:path";

export async function getMarkDataUri(): Promise<string> {
  const buf = await fs.readFile(path.join(process.cwd(), "public", "mark-og.png"));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export function buildOgElement(markSrc: string) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#05070D",
        backgroundImage:
          "radial-gradient(circle at 82% 8%, rgba(58,84,196,0.35) 0%, rgba(5,7,13,0) 55%), radial-gradient(circle at 6% 100%, rgba(212,175,55,0.22) 0%, rgba(5,7,13,0) 55%)",
        padding: "72px 88px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={128} height={128} alt="" />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontFamily: "Inter",
              fontWeight: 700,
              color: "#F5F6FA",
              letterSpacing: 2,
            }}
          >
            GENESIS <span style={{ color: "#E6C264", marginLeft: 14 }}>PRO</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontFamily: "Inter",
              fontWeight: 500,
              color: "#7C93E8",
              letterSpacing: 8,
              marginTop: 6,
            }}
          >
            LTD
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
        <div
          style={{
            display: "flex",
            fontSize: 54,
            fontFamily: "Inter",
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.15,
          }}
        >
          Trade With Confidence.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 54,
            fontFamily: "Inter",
            fontWeight: 700,
            color: "#E6C264",
            lineHeight: 1.15,
            marginTop: 4,
          }}
        >
          Grow With Purpose.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontFamily: "Inter",
            fontWeight: 400,
            color: "#9198AB",
            marginTop: 22,
          }}
        >
          A modern financial brokerage platform
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: 6,
          borderRadius: 999,
          backgroundImage: "linear-gradient(90deg, #F0D98C 0%, #D4AF37 45%, #3A54C4 100%)",
        }}
      />
    </div>
  );
}
