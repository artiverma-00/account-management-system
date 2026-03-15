function StatusCard({ label, value }) {
  return (
    <article className="status-card">
      <span className="status-card__label">{label}</span>
      <strong className="status-card__value">{value}</strong>
    </article>
  );
}

export default StatusCard;
