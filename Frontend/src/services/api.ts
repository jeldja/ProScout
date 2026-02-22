/**
 * Generic fetch client for the Flask backend.
 * Base URL: VITE_API_BASE_URL env var (defaults to /api for Vite proxy)
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function apiGet<T>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}
