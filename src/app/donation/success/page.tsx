'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, Home, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppNavbar } from '@/components/navbar';

export const DonationSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Here you could verify the payment with Stripe if needed
    setIsLoading(false);
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground-600">Verificando tu donación...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  ¡Donación Exitosa!
                </h1>
                <p className="text-foreground-600">
                  Gracias por apoyar el desarrollo de CryptoDash. Tu contribución nos ayuda a seguir mejorando la plataforma.
                </p>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Heart className="h-5 w-5" />
                  <span className="font-semibold">Tu apoyo significa mucho para nosotros</span>
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

              {sessionId && (
                <div className="mt-6 p-3 bg-default-100 dark:bg-default-900/50 rounded-lg">
                  <p className="text-xs text-foreground-600">
                    ID de transacción: {sessionId.slice(-8)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccessPage;