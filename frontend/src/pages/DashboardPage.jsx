import { useEffect, useState } from "react";

import AppShell from "../components/AppShell";
import StatusCard from "../components/StatusCard";
import { useAuth } from "../context/AuthContext";
import { getBalance, getStatement } from "../services/api";

function DashboardPage() {
  const { token, user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [statement, setStatement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const [balanceData, statementData] = await Promise.all([
          getBalance(token),
          getStatement(token),
        ]);

        if (!isMounted) {
          return;
        }

        setBalance(balanceData.balance ?? 0);
        setStatement(statementData || []);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <AppShell
      subtitle="Overview of your account, current balance, and latest activity."
      title="Dashboard"
    >
      <section className="detail-panel detail-panel--dashboard">
        <StatusCard
          label="Current Balance"
          value={
            loading ? "Loading..." : `₹${Number(balance || 0).toLocaleString()}`
          }
        />
        <StatusCard
          label="Transactions"
          value={loading ? "..." : String(statement.length)}
        />
        <StatusCard label="Account" value={user?.email || "Signed in"} />
      </section>

      <section className="detail-panel detail-panel--single">
        <div>
          <h2>Latest Activity</h2>
          {loading ? (
            <p className="timestamp">Loading account data...</p>
          ) : null}
          {error ? (
            <p className="status-pill status-pill--error">{error}</p>
          ) : null}
          {!loading && !error && statement.length === 0 ? (
            <p className="timestamp">No transactions yet.</p>
          ) : null}
          {!loading && !error && statement.length > 0 ? (
            <ul className="highlight-list">
              {statement.slice(0, 5).map((transaction) => (
                <li key={transaction.id}>
                  <strong>
                    {transaction.transaction_type === "credit" ? "+" : "-"}₹
                    {transaction.amount}
                  </strong>{" "}
                  {transaction.transaction_type} on{" "}
                  {new Date(transaction.created_at).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}

export default DashboardPage;
