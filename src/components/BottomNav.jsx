export function BottomNav({ active = "tools" }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <a className={`bottom-nav-item ${active === "tools" ? "is-active" : ""}`} href="#/">
        <span className="material-symbols-outlined" aria-hidden="true">
          grid_view
        </span>
        <span>Tools</span>
      </a>
      <a className="bottom-nav-item" href="#history" aria-disabled="true">
        <span className="material-symbols-outlined" aria-hidden="true">
          history
        </span>
        <span>History</span>
      </a>
      <a className="bottom-nav-item" href="#settings" aria-disabled="true">
        <span className="material-symbols-outlined" aria-hidden="true">
          settings
        </span>
        <span>Settings</span>
      </a>
    </nav>
  );
}
