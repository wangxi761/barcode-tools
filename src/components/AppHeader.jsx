export function HomeHeader() {
  return (
    <header className="topbar topbar-home">
      <div className="topbar-brand">
        <span className="material-symbols-outlined topbar-brand-icon" aria-hidden="true">
          qr_code_scanner
        </span>
        <h1 className="topbar-home-title">Scanner</h1>
      </div>
      <button className="avatar-button" type="button" aria-label="User profile">
        <span className="material-symbols-outlined" aria-hidden="true">
          account_circle
        </span>
      </button>
    </header>
  );
}

export function ToolHeader({ title, onBack }) {
  return (
    <header className="topbar topbar-tool">
      <button className="back-link" type="button" aria-label="Back" onClick={onBack}>
        <span className="material-symbols-outlined" aria-hidden="true">
          arrow_back
        </span>
      </button>
      <h1 className="topbar-tool-title">{title}</h1>
    </header>
  );
}
