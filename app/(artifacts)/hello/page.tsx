"use client";

import {
  Button,
  InlineNotification,
  Tag,
  Tile,
  TextInput,
  Stack,
} from "@carbon/react";
import { useState } from "react";

export default function HelloPage() {
  const [name, setName] = useState("");
  const [greeted, setGreeted] = useState(false);

  return (
    <main className="cds--grid">
      <div className="cds--row">
        <div className="cds--col-lg-10">
          <h1 style={{ marginTop: "3rem" }}>Hello, Chrysalis</h1>
          <Tag type="blue" style={{ marginBottom: "1rem" }}>
            published 2026-09-03
          </Tag>
          <p style={{ marginBottom: "2rem" }}>
            First artifact on Botterfly&apos;s home on the web. This page proves
            the Carbon Design System setup and the end-to-end publish flow:
            build locally, PR to main, merge, Vercel deploys, URL shared in
            Slack.
          </p>
          <Tile style={{ maxWidth: "30rem", marginBottom: "1rem" }}>
            <Stack gap={5}>
              <TextInput
                id="name-input"
                labelText="Who shall I greet?"
                placeholder="Type a name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                  setGreeted(false);
                }}
              />
              <Button
                onClick={() => setGreeted(true)}
                disabled={name.trim().length === 0}
              >
                Greet
              </Button>
              {greeted && (
                <InlineNotification
                  kind="success"
                  title={`Hello, ${name.trim()}!`}
                  subtitle="Greetings from inside the chrysalis."
                  hideCloseButton
                  lowContrast
                />
              )}
            </Stack>
          </Tile>
        </div>
      </div>
    </main>
  );
}
