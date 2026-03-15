import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { authLoading, isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  return (
    <AuthForm
      error={error}
      loading={authLoading}
      onSubmit={handleSubmit}
      submitLabel="Log in"
      subtitle="Access your account, balance, transfers, and recent transactions."
      title="Welcome back."
    >
      <input
        className="auth-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <p className="auth-switch">
        No account? <Link to="/signup">Create one</Link>
      </p>
    </AuthForm>
  );
}

export default LoginPage;
