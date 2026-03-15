import { useEffect, useState } from "react";

import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import { getStatement } from "../services/api";

function formatParty(label, fallbackId, currentUserId) {
  if (fallbackId === currentUserId) {
    return "You";
  }

  return label || fallbackId || "-";
}

function StatementPage() {
  const { token, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStatement() {
      setLoading(true);
      setError("");

      try {
        const data = await getStatement(token);

        if (isMounted) {
          setTransactions(data || []);
        }
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

    loadStatement();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <AppShell
      subtitle="Every credit and debit, shown in a table with clear visual status."
      title="Account Statement"
    >
      <section className="detail-panel detail-panel--single">
        <div>
          <h2>Transactions</h2>
          {loading ? <p className="timestamp">Loading statement...</p> : null}
          {error ? (
            <p className="status-pill status-pill--error">{error}</p>
          ) : null}
          {!loading && !error && transactions.length === 0 ? (
            <p className="timestamp">No transactions found.</p>
          ) : null}
          {!loading && !error && transactions.length > 0 ? (
            <div className="table-wrap">
              <table className="statement-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>From</th>
                    <th>To</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {new Date(transaction.created_at).toLocaleDateString(
                          "en-IN",
                          { day: "2-digit", month: "short" },
                        )}
                      </td>
                      <td>
                        <span
                          className={`transaction-type transaction-type--${transaction.transaction_type}`}
                        >
                          {transaction.transaction_type === "credit"
                            ? "Credit"
                            : "Debit"}
                        </span>
                      </td>
                      <td>₹{Number(transaction.amount).toLocaleString()}</td>
                      <td>
                        {formatParty(
                          transaction.sender_name,
                          transaction.sender_id,
                          user?.id,
                        )}
                      </td>
                      <td>
                        {formatParty(
                          transaction.receiver_name,
                          transaction.receiver_id,
                          user?.id,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}

export default StatementPage;
