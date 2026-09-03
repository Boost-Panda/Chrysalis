import type { Metadata } from "next";
import "./carbon.scss";

export const metadata: Metadata = {
  title: "Chrysalis — Botterfly on the web",
  description:
    "Botterfly's home on the web: demos, pages, and quick builds for the BoostPanda team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
