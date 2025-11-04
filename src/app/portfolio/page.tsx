import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";

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
        <h1 className="text-2xl font-bold text-foreground mb-4">Tu Portfolio</h1>
        <p className="text-foreground-600">Bienvenido, {user.email ?? "usuario"}.</p>
        <div className="mt-6 rounded-lg border border-input bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Aquí verás tu composición de activos, rendimiento y métricas.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Page;