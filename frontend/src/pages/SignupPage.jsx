import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

function SignupPage() {
  const { authLoading, isAuthenticated, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await signup(name, email, password);
      setSuccess(response.message || "Account created successfully.");
      window.setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (signupError) {
      setError(signupError.message);
    }
  }

  return (
    <AuthForm
      error={error}
      loading={authLoading}
      onSubmit={handleSubmit}
      submitLabel="Sign up"
      subtitle="Create your banking account to start tracking balance and transactions."
      title="Create an account."
    >
      <input
        className="auth-input"
        placeholder="Full name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
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
      {success ? <p className="status-pill">{success}</p> : null}
      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthForm>
  );
}

export default SignupPage;
