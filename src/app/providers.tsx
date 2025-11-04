"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import SplashCursor from "@/components/ui/splash-cursor";

interface CursorEffectContextValue {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}

const CursorEffectContext = createContext<CursorEffectContextValue | null>(null);

export const useCursorEffect = () => {
  const ctx = useContext(CursorEffectContext);
  if (!ctx) {
    throw new Error("useCursorEffect must be used within Providers");
  }
  return ctx;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("cursorEnabled");
      if (saved !== null) setEnabled(saved === "1");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cursorEnabled", enabled ? "1" : "0");
    } catch {}
  }, [enabled]);

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <CursorEffectContext.Provider value={{ enabled, setEnabled }}>
        {children}
        {mounted && enabled && (
          <div className="pointer-events-none fixed inset-0 z-10">
            <SplashCursor key={enabled ? "on" : "off"} TRANSPARENT={true} />
          </div>
        )}
      </CursorEffectContext.Provider>
    </NextThemesProvider>
  );
}