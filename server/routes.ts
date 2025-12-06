import express from "express"
import type { Building } from "../shared/schema"

const router = express.Router()

function apiGet(path: string) {
  return fetch(`https://niesmiertelnik.replit.app/api/v1${path}`).then(r => r.json())
}

router.get("/proxy/building", async (req, res) => {
  try {
    const data = await apiGet("/building")
    res.json(data)
  } catch (e) {
    res.status(500).json({ error: "proxy building failed" })
  }
})

router.get("/firefighters", async (req, res) => {
  try {
    const data = await apiGet("/firefighters")
    res.json(data)
  } catch {
    res.status(500).json({ error: "firefighters fetch failed" })
  }
})

router.get("/beacons", async (req, res) => {
  try {
    const data = await apiGet("/beacons")
    res.json(data)
  } catch {
    res.status(500).json({ error: "beacons fetch failed" })
  }
})

export default router
