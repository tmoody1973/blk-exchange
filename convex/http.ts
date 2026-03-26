import { httpRouter } from "convex/server";

const http = httpRouter();

// Clerk webhook endpoint — for MVP, user creation is handled by
// the getOrCreate mutation on first app load (convex/players.ts).
// This file establishes the HTTP router for Convex.
// Add webhook handlers here for production user sync.

export default http;
