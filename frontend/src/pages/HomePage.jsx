import { useEffect, useState } from "react";

import StatusCard from "../components/StatusCard";
import { getSystemSummary } from "../services/api";

function HomePage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      try {
        const data = await getSystemSummary();

        if (isMounted) {
          setSummary(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      }
    }

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">Full-Stack JavaScript Starter</p>
        <h1>React frontend with a Node.js Express backend.</h1>
        <p className="hero-copy">
          This starter gives you a clean split between UI and API, wired for
          local development with a Vite proxy and an Express JSON endpoint.
        </p>

        <div className="status-grid">
          <StatusCard
            label="Frontend"
            value={summary?.stack.frontend || "Loading..."}
          />
          <StatusCard
            label="Backend"
            value={summary?.stack.backend || "Connecting..."}
          />
          <StatusCard
            label="Language"
            value={summary?.stack.language || "JavaScript"}
          />
        </div>
      </section>

      <section className="detail-panel">
        <div>
          <h2>API status</h2>
          <p className={`status-pill ${error ? "status-pill--error" : ""}`}>
            {error || summary?.status || "Checking backend..."}
          </p>
        </div>

        <div>
          <h2>Included highlights</h2>
          <ul className="highlight-list">
            {(summary?.highlights || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Endpoint</h2>
          <code className="endpoint-code">GET /api/system</code>
          <p className="timestamp">
            {summary
              ? `Updated ${summary.timestamp}`
              : "Waiting for response..."}
          </p>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
