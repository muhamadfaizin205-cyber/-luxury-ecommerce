/**
 * Root page — renders the client-side SPA shell.
 * All routing (home / plp / pdp / cart / account) is handled
 * client-side via the <LuxeApp> component for a seamless,
 * app-like experience without full page reloads.
 */
import LuxeApp from "@/components/LuxeApp";

export default function HomePage() {
  return <LuxeApp />;
}
