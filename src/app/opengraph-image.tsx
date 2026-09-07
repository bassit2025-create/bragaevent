import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#171310",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "#FF5A3C",
            opacity: 0.35,
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "#2952E3",
            opacity: 0.3,
            filter: "blur(60px)",
          }}
        />

        <span
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#faf6ef",
            letterSpacing: 2,
            marginBottom: 24,
          }}
        >
          BRAGA{" "}
          <span style={{ display: "flex", color: "#FF5A3C" }}>EVENT</span>
        </span>

        <span
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "#faf6ef",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          O que acontece em Braga?
        </span>

        <span
          style={{
            display: "flex",
            fontSize: 28,
            color: "rgba(250,246,239,0.7)",
            marginTop: 24,
            maxWidth: 780,
          }}
        >
          Concertos, festas, cultura e muito mais — tudo o que está a
          acontecer na cidade.
        </span>
      </div>
    ),
    { ...size }
  );
}
