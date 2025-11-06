"use client";

import { Coffee, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupportCryptoCoffeeProps {
  currency?: string;
  qrSrc?: string; // Imagen del QR
  link?: string; // Enlace a tu página de apoyo
}

export const SupportCryptoCoffee = ({
  currency = "USDC",
  qrSrc,
  link,
}: SupportCryptoCoffeeProps) => {
  // Componente simplificado: sin selector de importe.

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 group shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <Coffee className="h-5 w-5 text-primary" aria-hidden />
            Invítame a un Crypto Café
          </CardTitle>
          <Badge className="bg-transparent text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 text-xs px-2 py-0">
            ¡Gracias!
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {link && (
          <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Apóyame con un tip</div>
              <Button
                type="button"
                size="sm"
                onClick={() => window.open(link!, "_blank", "noopener,noreferrer")}
              >
                <ExternalLink className="h-4 w-4 mr-1" aria-hidden /> Abrir página de apoyo
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Moneda aceptada: {currency}</div>
          </div>
        )}

        <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
          <div className="text-sm text-muted-foreground mb-2">Escanea el QR con tu wallet</div>
          {qrSrc ? (
            <div className="flex items-center justify-center">
              <Image
                src={qrSrc}
                alt="Código QR para enviar tu crypto café"
                width={200}
                height={200}
                className="rounded-lg border border-border/50"
              />
            </div>
          ) : (
            <div className="h-48 rounded-lg border border-dashed border-border/50 bg-card/50 flex items-center justify-center text-xs text-muted-foreground">
              Añade la prop <code className="font-mono">qrSrc</code>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div className="text-xs text-muted-foreground">¡Gracias por tu apoyo!</div>
        </div>
      </CardContent>
    </Card>
  );
};
