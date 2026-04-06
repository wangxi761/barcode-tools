import { useEffect, useMemo, useRef, useState } from "react";
import { ToolHeader } from "../components/AppHeader.jsx";
import { BottomNav } from "../components/BottomNav.jsx";
import { loadMatcherBatch, normalizeBarcode } from "../features/barcode-matcher/store.js";

export function MatcherScanPage({ navigate }) {
  const batch = useMemo(() => loadMatcherBatch(), []);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("idle");
  const [cameraState, setCameraState] = useState("idle");
  const [cameraMessage, setCameraMessage] = useState("");
  const [items, setItems] = useState(
    batch.items.map((value, index) => ({
      value,
      originalIndex: index,
      status: "pending",
      matchedAt: "",
    }))
  );
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);
  const detectFrameRef = useRef(null);
  const lastScanAtRef = useRef(0);
  const scanLockRef = useRef(false);

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

  const stopCamera = (nextState = "idle") => {
    if (detectFrameRef.current) {
      window.cancelAnimationFrame(detectFrameRef.current);
      detectFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    detectorRef.current = null;
    scanLockRef.current = false;
    setCameraState(nextState);
  };

  const handleScanValue = (rawValue) => {
    const value = normalizeBarcode(rawValue);

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

  const handleScan = () => {
    handleScanValue(inputValue);
  };

  useEffect(() => () => stopCamera(), []);

  useEffect(() => {
    if (cameraState !== "active" || !videoRef.current || !detectorRef.current) {
      return undefined;
    }

    let cancelled = false;

    const scanFrame = async () => {
      if (cancelled || !videoRef.current || !detectorRef.current) {
        return;
      }

      const now = Date.now();

      if (
        videoRef.current.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA &&
        now - lastScanAtRef.current >= 250 &&
        !scanLockRef.current
      ) {
        lastScanAtRef.current = now;
        scanLockRef.current = true;

        try {
          const detectedBarcodes = await detectorRef.current.detect(videoRef.current);
          const detectedValue = detectedBarcodes.find((barcode) => normalizeBarcode(barcode.rawValue));

          if (detectedValue?.rawValue) {
            setCameraMessage("Barcode detected");
            setInputValue(detectedValue.rawValue);
            handleScanValue(detectedValue.rawValue);
            stopCamera();
            return;
          }
        } catch (error) {
          setCameraMessage(error instanceof Error ? error.message : "Unable to detect barcode.");
          stopCamera("error");
          return;
        } finally {
          scanLockRef.current = false;
        }
      }

      detectFrameRef.current = window.requestAnimationFrame(scanFrame);
    };

    detectFrameRef.current = window.requestAnimationFrame(scanFrame);

    return () => {
      cancelled = true;

      if (detectFrameRef.current) {
        window.cancelAnimationFrame(detectFrameRef.current);
        detectFrameRef.current = null;
      }
    };
  }, [cameraState, items]);

  const handleOpenCamera = async () => {
    if (cameraState === "active" || cameraState === "opening") {
            stopCamera();
            return;
    }

    if (!window.isSecureContext) {
      setCameraState("error");
      setCameraMessage("Camera requires HTTPS or localhost.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("error");
      setCameraMessage("This device does not support camera access.");
      return;
    }

    if (!("BarcodeDetector" in window)) {
      setCameraState("error");
      setCameraMessage("This browser does not support barcode recognition yet.");
      return;
    }

    setCameraState("opening");
    setCameraMessage("Opening camera...");

    try {
      const formats = typeof window.BarcodeDetector.getSupportedFormats === "function"
        ? await window.BarcodeDetector.getSupportedFormats()
        : [];

      const preferredFormats = formats.filter((format) =>
        ["code_128", "code_39", "code_93", "codabar", "ean_13", "ean_8", "itf", "upc_a", "upc_e"].includes(
          format
        )
      );

      detectorRef.current = new window.BarcodeDetector({
        formats: preferredFormats.length > 0 ? preferredFormats : undefined,
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraState("active");
      setCameraMessage("Point the camera at a barcode.");
    } catch (error) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      setCameraState("error");
      setCameraMessage(
        error instanceof Error ? error.message : "Unable to open the camera on this device."
      );
    }
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
          <button
            className={`camera-button ${cameraState === "active" ? "camera-button-active" : ""}`}
            type="button"
            aria-label={cameraState === "active" ? "Stop camera scan" : "Open camera scan"}
            onClick={handleOpenCamera}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {cameraState === "active" ? "stop_circle" : "photo_camera"}
            </span>
          </button>
        </form>

        {cameraState !== "idle" ? (
          <section className="camera-panel" aria-label="Camera scanner">
            <div className="camera-preview-shell">
              {cameraState === "active" || cameraState === "opening" ? (
                <>
                  <video
                    ref={videoRef}
                    className="camera-preview"
                    autoPlay
                    muted
                    playsInline
                  />
                  <div className="camera-overlay" aria-hidden="true">
                    <div className="camera-scan-line"></div>
                  </div>
                </>
              ) : (
                <div className="camera-placeholder">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    warning
                  </span>
                </div>
              )}
            </div>
            <div className={`camera-note ${cameraState === "error" ? "camera-note-error" : ""}`}>
              {cameraMessage}
            </div>
          </section>
        ) : null}

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
