'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { AppNavbar } from '@/components/navbar';

export const AuthPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selected, setSelected] = useState('login');
  const router = useRouter();
  const supabase = createClient();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleAuth = async () => {
    if (!email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      if (selected === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

        if (error) throw error;

        router.push('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) throw error;

        if (data.user && !data.session) {
          alert('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Error en la autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message || 'Error en la autenticación con Google');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center gap-2 text-inherit mb-4">
              <TrendingUp className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                CryptoDash
              </span>
            </Link>
            <p className="text-foreground-600">
              {selected === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta gratuita'}
            </p>
          </div>

          <Card className="w-full">
            <CardContent className="p-6">
              <div className="flex mb-6 border-b">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
                    selected === 'login'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setSelected('login')}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
                    selected === 'signup'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setSelected('signup')}
                >
                  Registrarse
                </button>
              </div>

              <div className="space-y-4">
                {selected === 'signup' && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nombre completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Ingresa tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="Ingresa tu email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      placeholder="Ingresa tu contraseña"
                      type={isVisible ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      className="absolute right-3 top-3 focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  className="w-full font-semibold"
                  onClick={handleAuth}
                  disabled={isLoading}
                >
                  {isLoading ? 'Cargando...' : (selected === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      o continúa con
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleAuth}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" aria-label="Google logo">
                    <title>Google</title>
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>

                {selected === 'login' && (
                  <div className="text-center">
                    <Link href="/auth/reset-password" className="text-primary">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            {selected === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => setSelected('signup')}
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => setSelected('login')}
                >
                  Inicia sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;