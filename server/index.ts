import express from "express"
import cors from "cors"
import http from "http"
import WebSocket, { WebSocketServer } from "ws"
import router from "./routes"
import type { TelemetryPacket, Alert } from "../shared/schema"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/", router)


const server = http.createServer(app)
const wss = new WebSocketServer({ server })

const clients = new Set<WebSocket>()

const simulatorWS = new WebSocket("wss://niesmiertelnik.replit.app/ws")

simulatorWS.on("open", () => {
  console.log("✓ Simulator WS connected")
})

simulatorWS.on("message", (data: WebSocket.RawData) => {
  try {
    const msg = JSON.parse(data.toString())

    if (msg.type === "tag_telemetry") {
      broadcast(msg as TelemetryPacket)
    }

    if (msg.type === "alert") {
      broadcast(msg as Alert)
    }

  } catch (e) {
    console.error("WS parse error", e)
  }
})

simulatorWS.on("error", err => {
  console.error("Simulator WS error", err)
})

function broadcast(data: any) {
  const json = JSON.stringify(data)
  for (const client of clients) {
    try {
      client.send(json)
    } catch {}
  }
}

wss.on("connection", ws => {
  clients.add(ws)
  ws.on("close", () => clients.delete(ws))
})

const PORT = 5001
server.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})
