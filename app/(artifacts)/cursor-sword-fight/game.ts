// Cursor Sword Fight — canvas game + PeerJS mesh. No Phaser; requestAnimationFrame
// loop and 2D canvas cover it, and PeerJS handles rooms without our own backend.
import type { DataConnection, Peer } from "peerjs";

export type Fighter = {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  score: number;
  lunge: number; // frames remaining of lunge boost
  cooldown: number; // frames until can lunge again
  hue: number;
  lastSeen: number;
  hitTick?: number;
};

type NetMsg =
  | { t: "hello"; id: string; name: string }
  | { t: "state"; id: string; x: number; y: number; vx: number; vy: number; angle: number; lunge: number }
  | { t: "lunge"; id: string; vx: number; vy: number }
  | { t: "hit"; from: string; on: string; x: number; y: number; amount: number }
  | { t: "scores"; scores: Record<string, number> }
  | { t: "roster"; fighters: { id: string; name: string; hue: number }[] };

const LUNGE_IMPULSE = 14;
const FRICTION = 0.88;
const LUNGE_FRAMES = 10;
const COOLDOWN_FRAMES = 30;
const HIT_RADIUS = 46;
const HIT_ANGLE = Math.PI / 3; // must face the target within ~60 degrees

export function startGame(opts: {
  canvas: HTMLCanvasElement;
  room: string;
  playerName: string;
  onStatus: (s: string) => void;
}): () => void {
  const { canvas, room, playerName, onStatus } = opts;
  const ctx = canvas.getContext("2d")!;
  let raf = 0;
  let disposed = false;

  const me: Fighter = {
    id: Math.random().toString(36).slice(2, 10),
    name: playerName,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    score: 0,
    lunge: 0,
    cooldown: 0,
    hue: Math.floor(Math.random() * 360),
    lastSeen: performance.now(),
  };
  const fighters = new Map<string, Fighter>([[me.id, me]]);
  const sparks: { x: number; y: number; life: number; hue: number }[] = [];

  // ---- networking (star topology: first joiner hosts, late joiners connect) ----
  let peer: Peer | null = null;
  let isHost = false;
  const conns = new Set<DataConnection>();
  const scoreAuthority: Record<string, number> = {};

  function wireConn(conn: DataConnection) {
    conn.on("open", () => {
      conn.send({ t: "hello", id: me.id, name: me.name } as NetMsg);
      if (isHost) {
        const roster = [...fighters.values()].map((f) => ({
          id: f.id,
          name: f.name,
          hue: f.hue,
        }));
        conn.send({ t: "roster", fighters: roster } as NetMsg);
        conn.send({ t: "scores", scores: scoreAuthority } as NetMsg);
      }
    });
    conn.on("data", (raw: unknown) => handleMsg(raw as NetMsg, conn));
    conn.on("close", () => conns.delete(conn));
    conn.on("error", () => conns.delete(conn));
    conns.add(conn);
  }

  function broadcast(msg: NetMsg, except?: DataConnection) {
    for (const c of conns) if (c !== except && c.open) c.send(msg);
  }

  function handleMsg(msg: NetMsg, conn: DataConnection) {
    if (msg.t === "hello") {
      if (!fighters.has(msg.id)) {
        fighters.set(msg.id, {
          id: msg.id,
          name: msg.name,
          x: me.x + (Math.random() - 0.5) * 200,
          y: me.y + (Math.random() - 0.5) * 200,
          vx: 0,
          vy: 0,
          angle: 0,
          score: 0,
          lunge: 0,
          cooldown: 0,
          hue: Math.floor(Math.random() * 360),
          lastSeen: performance.now(),
        });
        // reply hello so they know about us too
        conn.send({ t: "hello", id: me.id, name: me.name });
      }
      return;
    }
    if (msg.t === "roster") {
      for (const r of msg.fighters) {
        if (r.id === me.id || fighters.has(r.id)) continue;
        fighters.set(r.id, {
          id: r.id,
          name: r.name,
          x: me.x + (Math.random() - 0.5) * 300,
          y: me.y + (Math.random() - 0.5) * 300,
          vx: 0,
          vy: 0,
          angle: 0,
          score: 0,
          lunge: 0,
          cooldown: 0,
          hue: r.hue,
          lastSeen: performance.now(),
        });
      }
      return;
    }
    if (msg.t === "state") {
      const f = fighters.get(msg.id);
      if (f) {
        f.x = msg.x;
        f.y = msg.y;
        f.vx = msg.vx;
        f.vy = msg.vy;
        f.angle = msg.angle;
        f.lunge = msg.lunge;
        f.lastSeen = performance.now();
      }
      if (isHost) broadcast(msg, conn);
      return;
    }
    if (msg.t === "lunge") {
      const f = fighters.get(msg.id);
      if (f) {
        f.vx = msg.vx;
        f.vy = msg.vy;
        f.lunge = LUNGE_FRAMES;
      }
      if (isHost) broadcast(msg, conn);
      return;
    }
    if (msg.t === "hit") {
      spawnSpark(msg.x, msg.y, fighters.get(msg.on)?.hue ?? 0);
      if (isHost) {
        scoreAuthority[msg.from] = (scoreAuthority[msg.from] ?? 0) + msg.amount;
        broadcast({ t: "scores", scores: scoreAuthority });
      }
      return;
    }
    if (msg.t === "scores") {
      for (const [id, s] of Object.entries(msg.scores)) {
        const f = fighters.get(id);
        if (f) f.score = s;
      }
      return;
    }
  }

  function spawnSpark(x: number, y: number, hue: number) {
    for (let i = 0; i < 14; i++) {
      sparks.push({
        x,
        y,
        life: 1,
        hue: hue + (Math.random() - 0.5) * 40,
      });
    }
  }

  async function initNet() {
    const { default: PeerCtor } = await import("peerjs");
    const hostId = `csf-${room.replace(/[^a-z0-9-]/gi, "").toLowerCase()}`;
    // Try to claim host id; if taken, we are a guest connecting to it.
    const host = new PeerCtor(hostId);
    peer = host;
    await new Promise<void>((resolve) => {
      const done = false;
      const check = () => {
        if (done) return;
      };
      host.on("open", () => {
        if (disposed) return;
        isHost = true;
        onStatus(`Hosting room "${room}". Share the link — swords assemble.`);
        resolve();
      });
      host.on("error", (err: { type?: string }) => {
        if (disposed) return;
        if (err?.type === "unavailable-id") {
          // someone already hosts; join as guest
          const guest = new PeerCtor();
          peer = guest;
          guest.on("open", () => {
            const conn = guest.connect(hostId, { reliable: false });
            conn.on("open", () => {
              onStatus(`Joined room "${room}". Click to lunge.`);
              resolve();
            });
            conn.on("error", () => {
              onStatus("Could not reach host. Try again in a moment.");
              resolve();
            });
          });
          guest.on("error", () => {
            onStatus("Network error joining room.");
            resolve();
          });
        } else {
          onStatus("Network error. You can still watch your own sword.");
          resolve();
        }
      });
      check();
    });
    host.on("connection", (conn: DataConnection) => wireConn(conn));
  }

  // ---- input ----
  const rect = () => canvas.getBoundingClientRect();
  me.x = rect().width / 2;
  me.y = rect().height / 2;

  function onMove(e: PointerEvent) {
    const r = rect();
    const nx = e.clientX - r.left;
    const ny = e.clientY - r.top;
    if (me.lunge > 0) return; // committed to the lunge vector
    me.vx = (nx - me.x) * 0.4;
    me.vy = (ny - me.y) * 0.4;
  }
  function onDown() {
    if (me.cooldown > 0) return;
    const speed = Math.hypot(me.vx, me.vy) || 1;
    me.vx = (me.vx / speed) * LUNGE_IMPULSE * 2.2;
    me.vy = (me.vy / speed) * LUNGE_IMPULSE * 2.2;
    me.lunge = LUNGE_FRAMES;
    me.cooldown = COOLDOWN_FRAMES;
    if (!isHost) {
      for (const c of conns) if (c.open) c.send({ t: "lunge", id: me.id, vx: me.vx, vy: me.vy });
    } else {
      broadcast({ t: "lunge", id: me.id, vx: me.vx, vy: me.vy });
    }
  }
  const arena = canvas.parentElement!;
  arena.addEventListener("pointermove", onMove);
  arena.addEventListener("pointerdown", onDown);
  arena.style.touchAction = "none"; // stop the page scrolling under the fight

  // ---- collision + scoring ----
  function checkHits() {
    for (const a of fighters.values()) {
      if (a.lunge <= 0 || a.lunge === LUNGE_FRAMES) continue; // only mid-lunge
      if (a.hitTick === undefined) a.hitTick = 0;
      a.hitTick++;
      if (a.hitTick % 3 !== 0) continue; // throttle hit checks
      for (const b of fighters.values()) {
        if (a.id === b.id) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist > HIT_RADIUS) continue;
        const facing = Math.atan2(a.vy, a.vx);
        const toB = Math.atan2(dy, dx);
        let diff = Math.abs(((toB - facing + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        if (diff > HIT_ANGLE) continue;
        const amount = 1;
        const f = fighters.get(a.id);
        if (f) f.score += amount;
        spawnSpark((a.x + b.x) / 2, (a.y + b.y) / 2, b.hue);
        const msg: NetMsg = { t: "hit", from: a.id, on: b.id, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, amount };
        if (isHost) {
          scoreAuthority[a.id] = (scoreAuthority[a.id] ?? 0) + amount;
          broadcast(msg);
          broadcast({ t: "scores", scores: scoreAuthority });
        } else {
          for (const c of conns) if (c.open) c.send(msg);
        }
      }
    }
  }

  // ---- render ----
  function draw() {
    const r = rect();
    if (canvas.width !== r.width || canvas.height !== r.height) {
      canvas.width = r.width;
      canvas.height = r.height;
    }
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // faint grid so movement reads
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const now = performance.now();
    for (const f of fighters.values()) {
      if (f.id !== me.id && now - f.lastSeen > 8000) {
        fighters.delete(f.id);
        continue;
      }
      // physics
      f.x += f.vx;
      f.y += f.vy;
      f.vx *= FRICTION;
      f.vy *= FRICTION;
      if (f.lunge > 0) f.lunge--;
      if (f.cooldown > 0) f.cooldown--;
      f.x = Math.max(0, Math.min(canvas.width, f.x));
      f.y = Math.max(0, Math.min(canvas.height, f.y));
      if (Math.hypot(f.vx, f.vy) > 0.5) f.angle = Math.atan2(f.vy, f.vx);

      // sword = line from cursor along movement direction; longer while lunging
      const len = f.lunge > 0 ? 60 : 42;
      const tx = f.x + Math.cos(f.angle) * len;
      const ty = f.y + Math.sin(f.angle) * len;
      ctx.strokeStyle = `hsl(${f.hue}, 70%, ${f.lunge > 0 ? 35 : 45}%)`;
      ctx.lineWidth = f.lunge > 0 ? 5 : 3;
      ctx.beginPath();
      ctx.moveTo(f.x - Math.cos(f.angle) * 10, f.y - Math.sin(f.angle) * 10);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      // guard: small circle at the cursor
      ctx.fillStyle = `hsl(${f.hue}, 60%, 55%)`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 7, 0, Math.PI * 2);
      ctx.fill();

      // name + score
      ctx.fillStyle = "#393939";
      ctx.font = "12px IBM Plex Sans, sans-serif";
      ctx.fillText(`${f.name} · ${f.score}`, f.x + 12, f.y - 12);
    }

    // sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life -= 0.05;
      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `hsla(${s.hue}, 80%, 55%, ${s.life})`;
      const spread = (1 - s.life) * 30;
      ctx.fillRect(
        s.x + (Math.random() - 0.5) * spread,
        s.y + (Math.random() - 0.5) * spread,
        3,
        3
      );
    }

    // broadcast my state ~20fps
    if (now - lastBroadcast > 50) {
      lastBroadcast = now;
      const msg: NetMsg = {
        t: "state",
        id: me.id,
        x: me.x,
        y: me.y,
        vx: me.vx,
        vy: me.vy,
        angle: me.angle,
        lunge: me.lunge,
      };
      if (isHost) broadcast(msg);
      else for (const c of conns) if (c.open) c.send(msg);
    }

    checkHits();
    raf = requestAnimationFrame(draw);
  }
  let lastBroadcast = 0;

  // ---- boot ----
  let cleanupNet = () => {};
  initNet().then(() => {
    if (disposed) return;
    raf = requestAnimationFrame(draw);
  });

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    canvas.parentElement?.removeEventListener("pointermove", onMove);
    canvas.parentElement?.removeEventListener("pointerdown", onDown);
    for (const c of conns) c.close();
    peer?.destroy();
  };
}