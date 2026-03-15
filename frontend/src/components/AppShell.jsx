import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AppShell({ children, title, subtitle }) {
  const { logout, user } = useAuth();

  return (
    <main className="page-shell">
      <section className="hero-panel app-shell__hero">
        <div>
          <p className="eyebrow">Secure Banking</p>
          <h1>{title}</h1>
          <p className="hero-copy">{subtitle}</p>
        </div>

        <div className="app-shell__actions">
          <span className="user-chip">{user?.email || "Signed in"}</span>
          <button className="auth-btn auth-btn--secondary" onClick={logout}>
            Log out
          </button>
        </div>
      </section>

      <nav className="nav-panel">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-link${isActive ? " nav-link--active" : ""}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/send-money"
          className={({ isActive }) =>
            `nav-link${isActive ? " nav-link--active" : ""}`
          }
        >
          Send Money
        </NavLink>
        <NavLink
          to="/statement"
          className={({ isActive }) =>
            `nav-link${isActive ? " nav-link--active" : ""}`
          }
        >
          Account Statement
        </NavLink>
      </nav>

      {children}
    </main>
  );
}

export default AppShell;
