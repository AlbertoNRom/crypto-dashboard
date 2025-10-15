'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Home, ArrowLeft, Heart } from 'lucide-react';
import { AppNavbar } from '@/components/navbar';

export const DonationCancelledPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-warning" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Donación Cancelada
                </h1>
                <p className="text-foreground-600">
                  No se ha procesado ningún pago. Puedes intentar de nuevo cuando gustes.
                </p>
              </div>

              <div className="bg-default-50 dark:bg-default-900/20 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-center gap-2 text-foreground-600">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm">Tu apoyo sigue siendo muy valioso para nosotros</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full"
                >
                  <a href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Volver al Inicio
                  </a>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <a href="/dashboard" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Ir al Dashboard
                  </a>
                </Button>
              </div>

              <div className="mt-6">
                <p className="text-xs text-foreground-500">
                  Si experimentaste algún problema, no dudes en contactarnos.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonationCancelledPage;