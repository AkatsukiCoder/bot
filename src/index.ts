import express from "express";
import {
  assignRobots,
  assignRobotsByCostEfficiency,
} from "./assigner";
import type { Inventory } from "./types";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/assign", (req, res) => {
  const { inventory, requestedHours } = req.body as {
    inventory?: Inventory;
    requestedHours?: number;
  };

  if (!inventory || typeof requestedHours !== "number") {
    return res.status(400).json({ error: "Invalid request payload." });
  }

  try {
    const strategy1 = assignRobots(inventory, requestedHours);
    const strategy2 = assignRobotsByCostEfficiency(inventory, requestedHours);

    return res.json({ strategy1, strategy2 });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Unknown server error." });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Backend API listening on http://localhost:${port}`);
  });
}

export default app;
