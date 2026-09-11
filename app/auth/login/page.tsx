"use client";

import { Button, Column, Grid, InlineNotification, TextInput, Tile } from "@carbon/react";
import { useEffect, useState } from "react";

// Magic-link login for the BoostPanda-gated artifacts. The proxy decides who
// gets in; this page only collects the email and hands it to Supabase.
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(new URLSearchParams(window.location.search).get("error"));
  }, []);

  const sendLink = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? `request failed (${res.status})`);
      }
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "could not send the link");
    } finally {
      setSending(false);
    }
  };

  return (
    <main>
      <Grid narrow style={{ paddingTop: "4rem" }}>
        <Column lg={6} md={4} sm={4}>
          <Tile style={{ maxWidth: "26rem" }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 300, margin: "0 0 1rem 0" }}>
              Sign in
            </h1>
            {sent ? (
              <p style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                Check your inbox — a sign-in link is on its way to{" "}
                <strong>{email}</strong>. It expires in one hour.
              </p>
            ) : (
              <>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                  This page is limited to BoostPanda email addresses. Enter yours
                  and we&apos;ll send a one-time sign-in link — no password.
                </p>
                <TextInput
                  id="login-email"
                  labelText="Email"
                  placeholder="you@boostpanda.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ marginBottom: "1rem" }}
                />
                <Button
                  kind="primary"
                  onClick={sendLink}
                  disabled={sending || !email.includes("@")}
                  style={{ maxWidth: "100%" }}
                >
                  {sending ? "Sending…" : "Send sign-in link"}
                </Button>
              </>
            )}
            {error && (
              <InlineNotification
                kind="error"
                title="Sign-in failed"
                subtitle={
                  error === "not-boostpanda"
                    ? "Only @boostpanda.com addresses can access this page."
                    : error
                }
                hideCloseButton
                lowContrast
                style={{ marginTop: "1rem" }}
              />
            )}
          </Tile>
        </Column>
      </Grid>
    </main>
  );
}