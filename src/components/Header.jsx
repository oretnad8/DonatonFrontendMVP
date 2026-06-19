export default function Header() {
  return (
    <header className="app-header">
      <div className="app-avatar">
        <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
          <circle cx="20" cy="20" r="20" fill="#c0573e" />
          <circle cx="20" cy="15" r="7" fill="#fff" />
          <path d="M7 38c0-7.18 5.82-11 13-11s13 3.82 13 11" fill="#fff" />
        </svg>
        <span className="app-avatar-badge">VOL</span>
      </div>
      <span className="app-brand">DONATON</span>
      <button className="app-bell" type="button" aria-label="Notificaciones">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>
    </header>
  );
}
