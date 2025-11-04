'use client';

import { AppNavbar } from "@/components/navbar";

export default function PortfolioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Algo salió mal</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {error.message || "No se pudo cargar el portfolio."}
          </p>
          <button
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
            type="button"
            onClick={() => reset()}
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}