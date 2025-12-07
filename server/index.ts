import express from "express"
import cors from "cors"
import http from "http"
import WebSocket, { WebSocketServer } from "ws"
import router from "./routes"
import type { TelemetryPacket, Alert } from "../shared/schema"

import {
  initManDown,
  processTelemetry,
  checkManDown
} from "./manDownMonitor"

const app = express()
app.use(cors())
app.use(express.json())
app.use("/", router)

const server = http.createServer(app)

// JEDEN JEDYNY WebSocket serwer
const wss = new WebSocketServer({ server, path: "/ws" })

const clients = new Set<WebSocket>()

wss.on("connection", ws => {
  console.log("CLIENT CONNECTED")
  clients.add(ws)
  ws.on("close", () => clients.delete(ws))
})

// forward broadcast
function broadcast(data: any) {
  const json = JSON.stringify(data)
  for (const c of clients) {
    try { c.send(json) } catch {}
  }
}

// WebSocket to simulator
const simulatorWS = new WebSocket("wss://niesmiertelnik.replit.app/ws")

simulatorWS.on("open", () => console.log("✓ Simulator WS connected"))

simulatorWS.on("message", (raw: WebSocket.RawData) => {
  try {
    const msg = JSON.parse(raw.toString())

    // always forward EVERYTHING
    broadcast(msg)

    if (msg.type === "tag_telemetry") {
      processTelemetry(msg as TelemetryPacket)
    }

  } catch (e) {
    console.error("WS parse error", e)
  }
})

simulatorWS.on("error", e => console.error("Simulator error", e))

// man down loop
initManDown(broadcast)
setInterval(checkManDown, 1000)

server.listen(5001, () => {
  console.log("Backend running at http://localhost:5001")
})
