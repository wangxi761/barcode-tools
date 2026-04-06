import { useMemo, useState } from "react";
import { ToolHeader } from "../components/AppHeader.jsx";
import { BottomNav } from "../components/BottomNav.jsx";
import { loadMatcherBatch, normalizeBarcode } from "../features/barcode-matcher/store.js";

export function MatcherScanPage({ navigate }) {
  const batch = useMemo(() => loadMatcherBatch(), []);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("idle");
  const [items, setItems] = useState(
    batch.items.map((value, index) => ({
      value,
      originalIndex: index,
      status: "pending",
      matchedAt: "",
    }))
  );

  const matchedCount = items.filter((item) => item.status === "matched").length;
  const displayItems = useMemo(
    () =>
      [...items].sort((left, right) => {
        if (left.status === right.status) {
          return left.originalIndex - right.originalIndex;
        }

        return left.status === "matched" ? -1 : 1;
      }),
    [items]
  );

  const handleScan = () => {
    const value = normalizeBarcode(inputValue);

    if (!value || !items.length) {
      return;
    }

    const matchedIndex = items.findIndex((item) => item.value === value);

    if (matchedIndex === -1) {
      setStatus("miss");
      return;
    }

    if (items[matchedIndex].status === "matched") {
      setStatus("already");
      return;
    }

    const nextItems = items.map((item, index) =>
      index === matchedIndex ? { ...item, status: "matched", matchedAt: "Just now" } : item
    );

    setItems(nextItems);
    setStatus("matched");
    setInputValue(value);
  };

  const statusConfig =
    status === "matched"
      ? {
          className: "status-chip status-chip-matched",
          icon: "check_circle",
          label: "Success",
        }
      : status === "miss"
        ? {
            className: "status-chip status-chip-miss",
            icon: "close",
            label: "No Match",
          }
        : status === "already"
          ? {
              className: "status-chip status-chip-matched",
              icon: "check_circle",
              label: "Matched",
            }
          : {
              className: "status-chip status-chip-idle",
              icon: "radio_button_unchecked",
              label: "Waiting",
            };

  return (
    <div className="app-shell">
      <ToolHeader title="Barcode Matcher" onBack={() => navigate("/tools/barcode-matcher")} />

      <main className="scanner-main">
        <form
          className="scan-input-row"
          onSubmit={(event) => {
            event.preventDefault();
            handleScan();
          }}
        >
          <div className="scan-input-wrap">
            <input
              className="scan-input"
              name="scan-input"
              type="text"
              inputMode="text"
              autoComplete="off"
              spellCheck="false"
              placeholder="Scan or type barcode"
              aria-label="Barcode input"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            {inputValue ? (
              <button
                className="scan-clear-button"
                type="button"
                aria-label="Clear barcode input"
                onClick={() => setInputValue("")}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            ) : null}
          </div>
          <button className="camera-button" type="submit" aria-label="Simulate camera scan">
            <span className="material-symbols-outlined" aria-hidden="true">
              photo_camera
            </span>
          </button>
        </form>

        <section className="status-row" aria-label="Batch status">
          <div className="status-summary">
            <h2 className="section-kicker">Batch Items ({items.length})</h2>
            <span className="badge badge-success">
              {matchedCount}/{items.length} Matched
            </span>
          </div>
          <div className={statusConfig.className}>
            <span className="material-symbols-outlined" aria-hidden="true">
              {statusConfig.icon}
            </span>
            <span>{statusConfig.label}</span>
          </div>
        </section>

        <p className="support-copy scan-support-copy">
          {items.length
            ? batch.source === "file"
              ? `Loaded from file${batch.fileName ? `: ${batch.fileName}` : ""}.`
              : "Loaded from manual input."
            : "No batch loaded. Go back and set up a batch first."}
        </p>

        <section className="scan-list-wrap" aria-label="Batch list">
          {items.length ? (
            <ul className="scan-list" aria-live="polite">
              {displayItems.map((item) => {
                const matched = item.status === "matched";

                return (
                  <li
                    key={item.value}
                    className={`scan-list-item ${
                      matched ? "scan-list-item-matched" : "scan-list-item-pending"
                    }`}
                  >
                    <div className="scan-list-item-main">
                      <span className="scan-dot" aria-hidden="true"></span>
                      <span className="scan-value">{item.value}</span>
                    </div>
                    <div className="scan-list-meta">
                      <span className="scan-meta-text">{matched ? item.matchedAt : "Pending"}</span>
                      {matched ? (
                        <span className="material-symbols-outlined" aria-hidden="true">
                          check_circle
                        </span>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="scan-empty">No barcodes ready for matching.</div>
          )}
        </section>
      </main>

      <BottomNav active="tools" />
    </div>
  );
}
