function AuthForm({
  children,
  error,
  onSubmit,
  submitLabel,
  title,
  subtitle,
  loading,
}) {
  return (
    <main className="page-shell page-shell--auth">
      <section className="hero-panel">
        <p className="eyebrow">Banking App</p>
        <h1>{title}</h1>
        <p className="hero-copy">{subtitle}</p>

        <form onSubmit={onSubmit} className="auth-form">
          {children}
          {error ? (
            <p className="status-pill status-pill--error">{error}</p>
          ) : null}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : submitLabel}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AuthForm;
