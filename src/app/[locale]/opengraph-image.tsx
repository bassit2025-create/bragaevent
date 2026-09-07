import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { isRtlLocale } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadArabicFont() {
  // Satori (which powers ImageResponse) can't render Arabic glyphs with
  // the default bundled font, so we fetch a proper Arabic font at
  // request time and embed it. Cached by the platform after first hit.
  const css = await (
    await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@700"
    )
  ).text();
  const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!fontUrl) return null;
  const fontData = await (await fetch(fontUrl)).arrayBuffer();
  return fontData;
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const rtl = isRtlLocale(locale);

  const arabicFontData = rtl ? await loadArabicFont() : null;

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
          direction: rtl ? "rtl" : "ltr",
          textAlign: rtl ? "right" : "left",
          fontFamily: arabicFontData ? "Noto Sans Arabic" : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            [rtl ? "right" : "left"]: -80,
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
            [rtl ? "left" : "right"]: -60,
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
            letterSpacing: rtl ? 0 : 2,
            marginBottom: 24,
          }}
        >
          BRAGA{" "}
          <span style={{ display: "flex", color: "#FF5A3C", marginInlineStart: 8 }}>
            EVENT
          </span>
        </span>

        <span
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 700,
            color: "#faf6ef",
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          {t("titlePrefix")} {t("titleHighlight")}
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
          {t("subtitle")}
        </span>
      </div>
    ),
    {
      ...size,
      fonts: arabicFontData
        ? [{ name: "Noto Sans Arabic", data: arabicFontData, weight: 700 }]
        : undefined,
    }
  );
}
