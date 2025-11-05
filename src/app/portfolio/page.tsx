import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AppNavbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";
import { PortfolioClient } from "@/components/portfolio-client";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Accede a tu cartera en CryptoDash",
};

export const dynamic = "force-dynamic";

const Page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?redirect=/portfolio");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-6">Tu Portfolio</h1>
        {/* Server-side fetch of current holdings */}
        {/* For user-specific data, avoid caching */}
        <HoldingsSection />
      </main>
    </div>
  );
};

export default Page;

async function HoldingsSection() {
  // Construir URL absoluta desde headers (SSR) y reenviar cookie para mantener sesión
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3001";
  const url = `${proto}://${host}/api/portfolio/holdings`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      cookie: hdrs.get("cookie") ?? "",
    },
  });
  if (!res.ok) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-destructive">
        No se pudieron cargar tus holdings.
      </div>
    );
  }
  const data = await res.json();
  const initialHoldings = (data?.holdings ?? []) as Array<{ id: string; portfolioId: string; cryptoId: string; amount: string }>;
  return <PortfolioClient initialHoldings={initialHoldings} />;
}