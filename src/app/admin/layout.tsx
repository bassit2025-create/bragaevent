import type { Metadata } from "next";

// The admin area is private and must never be indexed or listed.
export const metadata: Metadata = {
  title: {
    default: "Braga Event Admin",
    template: "%s · Braga Event Admin",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
