import { useState } from "react";

import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import { transfer } from "../services/api";

function SendMoneyPage() {
  const { token } = useAuth();
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await transfer(token, receiverId, amount);
      setMessage(data.message || "Transfer successful");
      setReceiverId("");
      setAmount("");
    } catch (transferError) {
      setError(transferError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      subtitle="Move funds securely to another account using their receiver ID."
      title="Send Money"
    >
      <section className="detail-panel detail-panel--single">
        <div>
          <h2>Transfer Funds</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              className="auth-input"
              placeholder="Receiver ID"
              value={receiverId}
              onChange={(event) => setReceiverId(event.target.value)}
              required
            />
            <input
              className="auth-input"
              type="number"
              min="1"
              placeholder="Amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Money"}
            </button>
          </form>
          {message ? (
            <p className="status-pill transfer-feedback">{message}</p>
          ) : null}
          {error ? (
            <p className="status-pill status-pill--error transfer-feedback">
              {error}
            </p>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}

export default SendMoneyPage;
