import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// KV Store endpoints for Energy State
app.get("/make-server-2b74d895/sync", async (c) => {
  try {
    const data = await kv.get("energy_state");
    return c.json({ data: data || null });
  } catch (error) {
    console.error("Error loading state:", error);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-2b74d895/sync", async (c) => {
  try {
    const { state } = await c.req.json();
    await kv.set("energy_state", state);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error saving state:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Health check endpoint
app.get("/make-server-2b74d895/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);