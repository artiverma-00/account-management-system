import { useEffect, useState } from "react";

import {
  login,
  signup,
  getBalance,
  getStatement,
  transfer,
} from "../services/api";

/* ─── Auth Screen ─────────────────────────────────────────── */
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(form.name, form.email, form.password);
        setMode("login");
        setForm((f) => ({ ...f, name: "" }));
      } else {
        const { token } = await login(form.email, form.password);
        onAuth(token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">Banking App</p>
        <h1>{mode === "login" ? "Welcome back." : "Create an account."}</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <input
              className="auth-input"
              placeholder="Full name"
              value={form.name}
              onChange={set("name")}
              required
            />
          )}
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={set("email")}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={set("password")}
            required
          />
          {error && <p className="status-pill status-pill--error">{error}</p>}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="hero-copy" style={{ marginTop: "16px" }}>
          {mode === "login" ? "No account? " : "Already have one? "}
          <button
            className="link-btn"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </section>
    </main>
  );
}

/* ─── Dashboard Screen ────────────────────────────────────── */
function Dashboard({ token, onLogout }) {
  const [balance, setBalance] = useState(null);
  const [statement, setStatement] = useState([]);
  const [transfer_form, setTransferForm] = useState({
    receiverId: "",
    amount: "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [bal, stmt] = await Promise.all([
        getBalance(token),
        getStatement(token),
      ]);
      setBalance(bal.balance);
      setStatement(stmt || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleTransfer(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      const res = await transfer(
        token,
        transfer_form.receiverId,
        transfer_form.amount,
      );
      setMsg(res.message);
      setTransferForm({ receiverId: "", amount: "" });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">Dashboard</p>
        <h1>
          Balance:{" "}
          {balance !== null
            ? `₹${Number(balance).toLocaleString()}`
            : "Loading…"}
        </h1>
        <button
          className="auth-btn"
          style={{ marginTop: "16px" }}
          onClick={onLogout}
        >
          Log out
        </button>
      </section>

      <section className="detail-panel">
        {/* Transfer */}
        <div>
          <h2>Transfer</h2>
          <form onSubmit={handleTransfer} className="auth-form">
            <input
              className="auth-input"
              placeholder="Receiver ID"
              value={transfer_form.receiverId}
              onChange={(e) =>
                setTransferForm((f) => ({ ...f, receiverId: e.target.value }))
              }
              required
            />
            <input
              className="auth-input"
              type="number"
              placeholder="Amount"
              min="1"
              value={transfer_form.amount}
              onChange={(e) =>
                setTransferForm((f) => ({ ...f, amount: e.target.value }))
              }
              required
            />
            <button className="auth-btn" type="submit">
              Send
            </button>
          </form>
          {msg && (
            <p className="status-pill" style={{ marginTop: "10px" }}>
              {msg}
            </p>
          )}
          {error && (
            <p
              className="status-pill status-pill--error"
              style={{ marginTop: "10px" }}
            >
              {error}
            </p>
          )}
        </div>

        {/* Statement */}
        <div style={{ gridColumn: "span 2" }}>
          <h2>Recent Transactions</h2>
          {statement.length === 0 ? (
            <p className="timestamp">No transactions yet.</p>
          ) : (
            <ul className="highlight-list">
              {statement.slice(0, 10).map((tx) => (
                <li key={tx.id}>
                  <strong>
                    {tx.transaction_type === "credit" ? "+" : "-"}₹{tx.amount}
                  </strong>{" "}
                  — {tx.transaction_type} &nbsp;
                  <span className="timestamp">
                    {new Date(tx.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

/* ─── Root ────────────────────────────────────────────────── */
function HomePage() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("token") || "",
  );

  function handleAuth(t) {
    sessionStorage.setItem("token", t);
    setToken(t);
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    setToken("");
  }

  if (!token) return <AuthScreen onAuth={handleAuth} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}

export default HomePage;
