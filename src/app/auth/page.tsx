"use client";

import { Eye, EyeOff, Lock, Mail, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useReducer } from "react";
import { AppNavbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

// Tipos para el estado y acciones del reducer
interface AuthState {
  isVisible: boolean;
  isLoading: boolean;
  email: string;
  password: string;
  name: string;
  selected: "login" | "signup";
}

type AuthAction =
  | { type: "TOGGLE_VISIBILITY" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_SELECTED"; payload: "login" | "signup" }
  | { type: "RESET_FORM" };

// Estado inicial
const initialState: AuthState = {
  isVisible: false,
  isLoading: false,
  email: "",
  password: "",
  name: "",
  selected: "login",
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "TOGGLE_VISIBILITY":
      return { ...state, isVisible: !state.isVisible };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_SELECTED":
      return { ...state, selected: action.payload };
    case "RESET_FORM":
      return { ...initialState, selected: state.selected };
    default:
      return state;
  }
};

const Page = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();
  const supabase = createClient();

  const toggleVisibility = () => dispatch({ type: "TOGGLE_VISIBILITY" });

  const handleAuth = async () => {
    if (!state.email || !state.password) {
      alert("Por favor completa todos los campos");
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      if (state.selected === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: state.email,
          password: state.password,
        });

        if (error) throw error;

        router.push("/market");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: state.email,
          password: state.password,
          options: {
            data: {
              name: state.name,
            },
          },
        });

        if (error) throw error;

        if (data.user && !data.session) {
          alert("¡Registro exitoso! Revisa tu email para confirmar tu cuenta.");
        } else {
          router.push("/market");
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Botón de Google deshabilitado por ahora; se eliminará el handler para evitar warnings.

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {/* Encabezado / Logo */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-inherit mb-4"
            >
              <TrendingUp
                className="h-10 w-10 text-primary"
                aria-hidden="true"
              />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                CryptoDash
              </h1>
            </Link>
            <p className="text-foreground-600">
              {state.selected === "login"
                ? "Bienvenido de vuelta"
                : "Crea tu cuenta gratuita"}
            </p>
          </div>

          <Card className="w-full">
            <CardContent className="p-6">
              <div
                className="flex mb-6"
                role="tablist"
                aria-label="Seleccionar acción"
              >
                <button
                  type="button"
                  role="tab"
                  className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
                    state.selected === "login"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  aria-selected={state.selected === "login"}
                  onClick={() =>
                    dispatch({ type: "SET_SELECTED", payload: "login" })
                  }
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  role="tab"
                  className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
                    state.selected === "signup"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  aria-selected={state.selected === "signup"}
                  onClick={() =>
                    dispatch({ type: "SET_SELECTED", payload: "signup" })
                  }
                >
                  Registrarse
                </button>
              </div>

              <div className="space-y-4">
                {state.selected === "signup" && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Ingresa tu nombre"
                        value={state.name}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_NAME",
                            payload: e.target.value,
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="Ingresa tu email"
                      type="email"
                      value={state.email}
                      onChange={(e) =>
                        dispatch({ type: "SET_EMAIL", payload: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      placeholder="Ingresa tu contraseña"
                      type={state.isVisible ? "text" : "password"}
                      value={state.password}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_PASSWORD",
                          payload: e.target.value,
                        })
                      }
                      className="pl-10 pr-10"
                    />
                    <button
                      className="absolute right-3 top-3 focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {state.isVisible ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <Button               
                  className={`appearance-none w-full h-10 px-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all active:scale-95 border-2 focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring disabled:pointer-events-none disabled:opacity-50 ${isDark ? "bg-white text-black border-white hover:bg-white/90" : "bg-black text-white border-black hover:bg-black/90"}`}
                  onClick={handleAuth}
                  disabled={state.isLoading}
                  aria-busy={state.isLoading}
                >
                  {state.isLoading ? (
                    "Cargando..."
                  ) : (
                    <>
                      {state.selected === "login" ? (
                        <Lock className="h-4 w-4 mr-2" />
                      ) : (
                        <User className="h-4 w-4 mr-2" />
                      )}
                      {state.selected === "login"
                        ? "Iniciar Sesión"
                        : "Crear Cuenta"}
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-4">
                  <span aria-hidden className="flex-1 border-t" />
                  <span className="text-xs uppercase text-muted-foreground">
                    o continúa con
                  </span>
                  <span aria-hidden className="flex-1 border-t" />
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent border-2 border-muted-foreground text-muted-foreground hover:bg-transparent"
                  disabled
                  aria-disabled
                  title="Autenticación con Google próximamente"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    aria-label="Google logo"
                  >
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
                  Google (deshabilitado)
                </Button>

                {state.selected === "login" && (
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
            {state.selected === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() =>
                    dispatch({ type: "SET_SELECTED", payload: "signup" })
                  }
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() =>
                    dispatch({ type: "SET_SELECTED", payload: "login" })
                  }
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

export default Page;
