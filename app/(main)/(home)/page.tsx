import { HomeServer } from "./home-server";

/**
 * Homepage - Server Component
 * Fast initial load with server-side data fetching
 * Revalidate every 60 seconds for better performance
 */

export const revalidate = 60; // ISR: Cache for 60 seconds

export default function HomePage() {
  return <HomeServer />;
}
