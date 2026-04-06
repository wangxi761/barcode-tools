import { useEffect, useMemo, useState } from "react";
import { HomePage } from "./pages/HomePage.jsx";
import { MatcherSetupPage } from "./pages/MatcherSetupPage.jsx";
import { MatcherScanPage } from "./pages/MatcherScanPage.jsx";

const getCurrentRoute = () => {
  const hash = window.location.hash.replace(/^#/, "") || "/";

  if (hash === "/" || hash === "") {
    return "/";
  }

  if (hash === "/tools/barcode-matcher") {
    return "/tools/barcode-matcher";
  }

  if (hash === "/tools/barcode-matcher/scan") {
    return "/tools/barcode-matcher/scan";
  }

  return "/";
};

export function App() {
  const [route, setRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(getCurrentRoute());

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigator = useMemo(
    () => ({
      go(path) {
        window.location.hash = path;
      },
    }),
    []
  );

  if (route === "/tools/barcode-matcher") {
    return <MatcherSetupPage navigate={navigator.go} />;
  }

  if (route === "/tools/barcode-matcher/scan") {
    return <MatcherScanPage navigate={navigator.go} />;
  }

  return <HomePage navigate={navigator.go} />;
}
