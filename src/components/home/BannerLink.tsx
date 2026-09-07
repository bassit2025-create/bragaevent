"use client";

import type { ReactNode } from "react";
import type { Banner } from "@prisma/client";

export function BannerLink({
  banner,
  children,
}: {
  banner: Banner;
  children: ReactNode;
}) {
  function handleClick() {
    // Fire-and-forget click tracking; navigation proceeds regardless.
    fetch(`/api/banners/${banner.id}/click`, { method: "POST" }).catch(
      () => {}
    );
  }

  return (
    <a
      href={banner.destinationUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      aria-label={`${banner.projectName} — ${banner.name}`}
    >
      {children}
    </a>
  );
}
