"use client";

import { useEffect, useRef, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Guard against React 18 Strict Mode's double useEffect invocation, which
    // would call worker.start() twice and cause the second call to deadlock.
    if (initialized.current) return;
    initialized.current = true;

    if (process.env.NEXT_PUBLIC_MOCK_API !== "true") {
      setReady(true);
      return;
    }

    import("@/mocks/browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => {
        setReady(true);
      });
    });
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
