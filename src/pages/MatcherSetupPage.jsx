import { useEffect, useState } from "react";
import { ToolHeader } from "../components/AppHeader.jsx";
import { BottomNav } from "../components/BottomNav.jsx";
import {
  extractBarcodesFromText,
  loadMatcherBatch,
  saveMatcherBatch,
} from "../features/barcode-matcher/store.js";

export function MatcherSetupPage({ navigate }) {
  const existingBatch = loadMatcherBatch();
  const [mode, setMode] = useState(existingBatch.source === "file" ? "file" : "manual");
  const [manualText, setManualText] = useState(
    existingBatch.source === "manual" ? existingBatch.items.join("\n") : ""
  );
  const [items, setItems] = useState(existingBatch.items);
  const [fileName, setFileName] = useState(existingBatch.fileName || "");
  const [source, setSource] = useState(existingBatch.source || "manual");

  useEffect(() => {
    if (mode === "manual") {
      setItems(extractBarcodesFromText(manualText));
      setSource("manual");
    }
  }, [manualText, mode]);

  const startScanning = () => {
    if (!items.length) {
      return;
    }

    saveMatcherBatch({
      items,
      source,
      fileName,
    });

    navigate("/tools/barcode-matcher/scan");
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);

    if (nextMode === "manual") {
      setSource("manual");
      setFileName("");
      setItems(extractBarcodesFromText(manualText));
      return;
    }

    setSource("file");

    if (!fileName) {
      setItems([]);
    }
  };

  const handleFileChange = async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    const content = await file.text();
    setSource("file");
    setFileName(file.name);
    setItems(extractBarcodesFromText(content));
  };

  const previewItems = items.slice(0, 5);
  const overflow = items.length - previewItems.length;

  return (
    <div className="app-shell">
      <ToolHeader title="Barcode Matcher" onBack={() => navigate("/")} />

      <main className="matcher-setup-main">
        <section className="page-heading">
          <h2 className="page-title">Barcode Matcher</h2>
          <div className="page-accent" aria-hidden="true"></div>
        </section>

        <section className="mode-switch" aria-label="Input mode">
          <button
            className={`mode-button ${mode === "manual" ? "is-active" : ""}`}
            type="button"
            onClick={() => handleModeChange("manual")}
          >
            Manual Input
          </button>
          <button
            className={`mode-button ${mode === "file" ? "is-active" : ""}`}
            type="button"
            onClick={() => handleModeChange("file")}
          >
            File Upload
          </button>
        </section>

        {mode === "manual" ? (
          <section className="panel-card input-panel">
            <textarea
              className="manual-textarea"
              placeholder={"Enter or paste barcodes here...\nOne barcode per line"}
              value={manualText}
              onChange={(event) => setManualText(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && items.length) {
                  event.preventDefault();
                  startScanning();
                }
              }}
            />
            <div className="panel-status">Input Ready</div>
          </section>
        ) : (
          <section className="panel-card input-panel">
            <label className="upload-zone" htmlFor="batch-file-input">
              <input
                id="batch-file-input"
                className="upload-input"
                type="file"
                accept=".txt,.csv,text/plain,text/csv"
                onChange={handleFileChange}
              />
              <span className="material-symbols-outlined upload-icon" aria-hidden="true">
                upload_file
              </span>
              <span className="upload-title">Choose a batch file</span>
              <span className="upload-copy">Supports txt or csv</span>
            </label>
            <p className="support-copy">{fileName || "No file selected"}</p>
          </section>
        )}

        <section className="panel-card batch-preview-panel">
          <div className="preview-header">
            <p className="section-kicker">Batch Preview</p>
            <span className="badge badge-neutral">{items.length} items</span>
          </div>

          {items.length ? (
            <ul className="batch-preview-list">
              {previewItems.map((item) => (
                <li key={item} className="batch-preview-item">
                  {item}
                </li>
              ))}
              {overflow > 0 ? (
                <li className="batch-preview-item batch-preview-item-muted">+{overflow} more</li>
              ) : null}
            </ul>
          ) : (
            <p className="support-copy preview-empty">Add barcodes to continue.</p>
          )}
        </section>
      </main>

      <div className="start-cta-wrap">
        <p className="cta-helper">
          {items.length
            ? "Batch ready. Tap Start Scanning to open the match screen."
            : "Enter at least one barcode, then tap Start Scanning."}
        </p>
        <button className="start-cta" type="button" disabled={!items.length} onClick={startScanning}>
          Start Scanning
        </button>
      </div>

      <BottomNav active="tools" />
    </div>
  );
}
