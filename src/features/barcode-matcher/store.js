const STORAGE_KEY = "barcode-matcher-batch";

export const normalizeBarcode = (value) => value.trim().toUpperCase();

export const isBarcodeMatch = (left, right) => {
  const normalizedLeft = normalizeBarcode(left);
  const normalizedRight = normalizeBarcode(right);

  if (!normalizedLeft || !normalizedRight) {
    return false;
  }

  return normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft);
};

export const extractBarcodesFromText = (text) => {
  const seen = new Set();

  return text
    .split(/[\r\n,;\t]+/)
    .map(normalizeBarcode)
    .filter((value) => {
      if (!value || seen.has(value)) {
        return false;
      }

      seen.add(value);
      return true;
    });
};

export const saveMatcherBatch = (payload) => {
  const batch = {
    items: payload.items || [],
    source: payload.source || "manual",
    fileName: payload.fileName || "",
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(batch));
};

export const loadMatcherBatch = () => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      items: [],
      source: "manual",
      fileName: "",
      savedAt: "",
    };
  }

  try {
    const parsed = JSON.parse(raw);

    return {
      items: Array.isArray(parsed.items) ? parsed.items.map(normalizeBarcode).filter(Boolean) : [],
      source: parsed.source || "manual",
      fileName: parsed.fileName || "",
      savedAt: parsed.savedAt || "",
    };
  } catch {
    return {
      items: [],
      source: "manual",
      fileName: "",
      savedAt: "",
    };
  }
};
