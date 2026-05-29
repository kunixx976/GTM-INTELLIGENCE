import axios from "axios";

// Access the environment variable or fallback to localhost port 8000
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const websocketURL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/telemetry";
