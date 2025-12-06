import { db } from "./db";

let currentIncidentId: string | null = null;

/*
  START RECORDING
*/
export function startRecording(name: string): string {
  if (currentIncidentId) {
    console.log("Recorder: Already recording", currentIncidentId);
    return currentIncidentId;
  }

  const id = db.incidents.create(name);
  currentIncidentId = id;

  console.log("Recorder: START", id);
  return id;
}

/*
  STOP RECORDING
*/
export function stopRecording(reason = "completed") {
  if (!currentIncidentId) return;

  db.incidents.close(currentIncidentId, reason);

  console.log("Recorder: STOP", currentIncidentId, reason);
  currentIncidentId = null;
}

/*
  CHECK STATUS
*/
export function isRecording(): boolean {
  return currentIncidentId !== null;
}

/*
  RECORD AN EVENT
*/
export function recordEvent(ev: any) {
  if (!currentIncidentId) return;

  try {
    db.incidents.appendEvent(currentIncidentId, {
      ts: Date.now(),
      event: ev
    });
  } catch (e) {
    console.error("Recorder: error writing event", e);
  }
}

/*
  GET CURRENT INCIDENT ID
*/
export function getActiveIncidentId(): string | null {
  return currentIncidentId;
}
