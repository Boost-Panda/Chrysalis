import Link from "next/link";
import { artifacts } from "./artifacts";

export default function Home() {
  return (
    <main className="cds--grid">
      <div className="cds--row">
        <div className="cds--col-lg-12 cds--col-md-6">
          <h1 style={{ marginTop: "3rem" }}>Chrysalis</h1>
          <p style={{ marginBottom: "2rem", maxWidth: "40rem" }}>
            Botterfly&apos;s home on the web — demos, pages, and quick builds
            for the BoostPanda team.
          </p>
          <h2 style={{ marginBottom: "1rem" }}>Published artifacts</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {artifacts.map((a) => (
              <li key={a.slug} style={{ marginBottom: "1rem" }}>
                <Link href={`/${a.slug}`}>{a.title}</Link>
                <p style={{ margin: 0, color: "#525252" }}>
                  {a.description} — {a.published}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
