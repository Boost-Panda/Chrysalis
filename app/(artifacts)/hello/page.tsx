"use client";

import {
  Button,
  InlineNotification,
  Tag,
  Tile,
  TextInput,
  Stack,
  Grid,
  Column,
  Breadcrumb,
  BreadcrumbItem,
} from "@carbon/react";
import { useState } from "react";
import Link from "next/link";

export default function HelloPage() {
  const [name, setName] = useState("");
  const [greeted, setGreeted] = useState(false);

  return (
    <main>
      <Grid narrow style={{ paddingTop: "2rem" }}>
        <Column lg={12} md={6} sm={4}>
          <Breadcrumb noTrailingSlash style={{ marginBottom: "1rem" }}>
            <BreadcrumbItem href="/">Chrysalis</BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>Hello</BreadcrumbItem>
          </Breadcrumb>
          <h1 style={{ fontSize: "2.625rem", fontWeight: 300, margin: "0 0 0.5rem 0" }}>
            Hello, Chrysalis
          </h1>
          <Tag type="blue" style={{ marginBottom: "1.5rem" }}>
            published 2026-09-03
          </Tag>
        </Column>
      </Grid>
      <Grid>
        <Column lg={8} md={6} sm={4}>
          <p style={{ fontSize: "1.25rem", fontWeight: 300, lineHeight: 1.5, marginBottom: "2rem" }}>
            First artifact on Botterfly&apos;s home on the web. This page proves
            the Carbon Design System setup and the end-to-end publish flow:
            build locally, PR to main, merge, Vercel deploys, URL shared in
            Slack.
          </p>
        </Column>
      </Grid>
      <Grid style={{ paddingBottom: "4rem" }}>
        <Column lg={6} md={4} sm={4}>
          <Tile>
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
        </Column>
      </Grid>
    </main>
  );
}
