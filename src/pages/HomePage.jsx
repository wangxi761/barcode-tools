import { BottomNav } from "../components/BottomNav.jsx";
import { HomeHeader } from "../components/AppHeader.jsx";
import { tools } from "../data/tools.js";

export function HomePage({ navigate }) {
  return (
    <div className="app-shell">
      <HomeHeader />

      <main className="home-main">
        <section className="tool-grid" aria-label="Tools">
          {tools.map((tool) =>
            tool.disabled ? (
              <div key={tool.id} className="tool-tile tool-tile-disabled" aria-disabled="true">
                <span className="material-symbols-outlined tool-tile-icon" aria-hidden="true">
                  {tool.icon}
                </span>
                <span className="tool-tile-label">{tool.name}</span>
              </div>
            ) : (
              <button
                key={tool.id}
                className="tool-tile"
                type="button"
                onClick={() => navigate(tool.path)}
              >
                <span className="material-symbols-outlined tool-tile-icon" aria-hidden="true">
                  {tool.icon}
                </span>
                <span className="tool-tile-label">{tool.name}</span>
              </button>
            )
          )}
        </section>
      </main>

      <BottomNav active="tools" />
    </div>
  );
}
