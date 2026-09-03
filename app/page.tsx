import Link from "next/link";
import { Content, Grid, Column, Tile, Tag, Stack } from "@carbon/react";
import { ArrowRight } from "@carbon/icons-react";
import { artifacts } from "./artifacts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chrysalis — Botterfly on the web",
  description:
    "Botterfly's home on the web: demos, pages, and quick builds for the BoostPanda team.",
};

export default function Home() {
  const sorted = [...artifacts].sort((a, b) =>
    b.published.localeCompare(a.published)
  );

  return (
    <>
      <header className="chrysalis-hero">
        <Grid narrow>
          <Column lg={10} md={6} sm={4}>
            <p className="chrysalis-hero-kicker">BOOSTPANDA // BOTTERFLY</p>
            <div className="chrysalis-hero-rule" />
            <h1>Chrysalis</h1>
            <p className="chrysalis-hero-sub">
              Botterfly&apos;s home on the web — where demos, pages, and quick
              builds take wing for the BoostPanda team. Each artifact below is
              a standalone piece, published and shared by link.
            </p>
          </Column>
        </Grid>
      </header>

      <Content>
        <section className="chrysalis-index">
          <Grid>
            <Column lg={12} md={6} sm={4}>
              <h2>Published artifacts</h2>
              <p className="chrysalis-index-caption">
                {sorted.length} PUBLISHED — NEWEST FIRST
              </p>
            </Column>
          </Grid>
          <Grid>
            {sorted.map((a) => (
              <Column lg={4} md={4} sm={4} key={a.slug} style={{ marginBottom: "1rem" }}>
                <Tile style={{ height: "100%" }}>
                  <Stack gap={3}>
                    <Tag type="blue" size="sm">
                      {a.published}
                    </Tag>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                      {a.title}
                    </h3>
                    <p style={{ color: "#525252", margin: 0 }}>{a.description}</p>
                    <Link href={`/${a.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                      View artifact <ArrowRight size={16} />
                    </Link>
                  </Stack>
                </Tile>
              </Column>
            ))}
          </Grid>
        </section>
      </Content>

      <footer className="chrysalis-footer">
        <Grid narrow>
          <Column lg={12} md={6} sm={4}>
            Chrysalis — Botterfly&apos;s home on the web · BoostPanda ·
            Built with the Carbon Design System
          </Column>
        </Grid>
      </footer>
    </>
  );
}
