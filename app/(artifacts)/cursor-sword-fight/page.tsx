"use client";

import {
  Button,
  Column,
  Grid,
  Tag,
  TextInput,
  Breadcrumb,
  BreadcrumbItem,
} from "@carbon/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CursorSwordFightPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Enter your name, then duel.");
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("room");
    if (r) setRoom(r);
  }, []);

  // Game engine mount lives outside React state; everything below runs once.
  useEffect(() => {
    if (!joined) return;
    let disposed = false;

    (async () => {
      const { startGame } = await import("./game");
      if (disposed) return;
      startGame({
        canvas: canvasRef.current!,
        room: room.trim() || "the-court",
        playerName: name.trim() || "Nameless Fencer",
        onStatus: (s: string) => setStatus(s),
      });
    })();

    return () => {
      disposed = true;
    };
  }, [joined, room, name]);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/cursor-sword-fight?room=${encodeURIComponent(
          room.trim() || "the-court"
        )}`
      : "";

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    setStatus("Link copied. Send it to your opponent.");
  }, [shareUrl]);

  return (
    <main>
      <Grid narrow style={{ paddingTop: "2rem" }}>
        <Column lg={12} md={6} sm={4}>
          <Breadcrumb noTrailingSlash style={{ marginBottom: "1rem" }}>
            <BreadcrumbItem href="/">Chrysalis</BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>Cursor Sword Fight</BreadcrumbItem>
          </Breadcrumb>
          <h1
            style={{
              fontSize: "2.625rem",
              fontWeight: 300,
              margin: "0 0 0.5rem 0",
            }}
          >
            Cursor Sword Fight
          </h1>
          <Tag type="magenta" style={{ marginBottom: "1.5rem" }}>
            published 2026-09-05
          </Tag>
        </Column>
      </Grid>

      <Grid style={{ paddingBottom: "1rem" }}>
        <Column lg={8} md={6} sm={4}>
          <p
            style={{
              fontSize: "1.25rem",
              fontWeight: 300,
              lineHeight: 1.5,
              marginBottom: "1.5rem",
            }}
          >
            Your cursor is a sword. Everyone on the page can see it, and you can
            clash. Click to lunge, land hits to score. Rooms are shared by link.
          </p>
        </Column>
      </Grid>

      {!joined ? (
        <Grid style={{ paddingBottom: "4rem" }}>
          <Column lg={6} md={4} sm={4}>
            <div
              style={{
                border: "1px solid var(--cds-border-subtle)",
                padding: "1.5rem",
              }}
            >
              <TextInput
                id="fighter-name"
                labelText="Your name"
                placeholder="e.g. Ali"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                style={{ marginBottom: "1rem" }}
              />
              <TextInput
                id="room-name"
                labelText="Room"
                placeholder="the-court"
                value={room}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRoom(e.target.value)
                }
                style={{ marginBottom: "1.5rem" }}
              />
              <Button
                onClick={() => setJoined(true)}
                disabled={name.trim().length === 0}
              >
                Draw sword
              </Button>
            </div>
          </Column>
        </Grid>
      ) : (
        <>
          <Grid narrow>
            <Column lg={12} md={6} sm={4}>
              <p
                style={{
                  marginBottom: "0.5rem",
                  fontFamily: "var(--cds-code-01, monospace)",
                }}
              >
                {status}
              </p>
            </Column>
            <Column lg={12} md={6} sm={4}>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  margin: "0.5rem 0 1rem 0",
                  flexWrap: "wrap" as const,
                }}
              >
                <Button kind="secondary" onClick={copyLink} size="sm">
                  Copy invite link
                </Button>
                <Button
                  kind="ghost"
                  onClick={() => {
                    window.location.href = "/cursor-sword-fight";
                  }}
                  size="sm"
                >
                  Leave room
                </Button>
              </div>
            </Column>
          </Grid>
          <div
            style={{
              position: "relative",
              height: "70vh",
              minHeight: 320,
              border: "1px solid var(--cds-border-subtle)",
              cursor: "none",
              overflow: "hidden",
              touchAction: "none",
            }}
          >
            <canvas
              ref={canvasRef}
              style={{ display: "block", width: "100%", height: "100%" }}
            />
          </div>
        </>
      )}
    </main>
  );
}
