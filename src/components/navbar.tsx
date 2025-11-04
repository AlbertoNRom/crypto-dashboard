"use client";

import {
  LogOut,
  Menu,
  Settings,
  TrendingUp,
  User as UserIcon,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeSwitch } from "@/components/theme-switch";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
type AuthUser = { email: string | null; avatarUrl?: string };
import { createClient } from "@/lib/supabase/client";
import { useCursorEffect } from "@/app/providers";

export const AppNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { enabled: cursorEnabled, setEnabled: setCursorEnabled } = useCursorEffect();

  useEffect(() => {
    setMounted(true);

    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const meta = (user?.user_metadata ?? {}) as Record<string, any>;
      const avatar = meta.avatar_url ?? meta.picture;
      setUser(user ? { email: user.email ?? null, avatarUrl: avatar } : null);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      const u = session?.user;
      const meta = (u?.user_metadata ?? {}) as Record<string, any>;
      const avatar = meta.avatar_url ?? meta.picture;
      setUser(u ? { email: u.email ?? null, avatarUrl: avatar } : null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const menuItems = [
    { name: "Market", href: "/market", icon: TrendingUp },
    { name: "Portfolio", href: "/portfolio", icon: Wallet },
  ];

  if (!mounted) return null;

  return (
    <nav className="w-full border-b border-primary/20 bg-gradient-to-r from-background via-background to-primary/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center animate-fade-in">
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden mr-2 hover:bg-primary/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-primary" />
              ) : (
                <Menu className="h-5 w-5 text-primary" />
              )}
            </Button>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <TrendingUp className="h-8 w-8 text-primary group-hover:animate-pulse transition-all duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                CryptoDash
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div
            className="hidden sm:flex items-center space-x-2 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {menuItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 group relative overflow-hidden"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                <span className="relative z-10 font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div
            className="flex items-center space-x-3 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
          {/* Theme toggle */}
          <div className="p-1 rounded-lg hover:bg-primary/10 transition-all duration-300">
            <ThemeSwitch />
          </div>

          {/* Cursor effect switch */}
          <div className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-primary/10 transition-all duration-300">
            <label
              htmlFor="cursor-toggle"
              id="cursor-toggle-label"
              className="text-sm text-foreground"
            >
              Cursor
            </label>
            <Switch
              id="cursor-toggle"
              checked={cursorEnabled}
              onCheckedChange={(v) => setCursorEnabled(Boolean(v))}
              className="h-5 w-9 border border-input data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80"
            />
          </div>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-all duration-300 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    <Avatar className="h-8 w-8 relative z-10 group-hover:scale-110 transition-transform duration-300">
                      <AvatarImage
                        src={user.avatarUrl || ""}
                        alt={user.email ?? ""}
                      />
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Conectado como
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 group"
              >
                <Link href="/auth" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Iniciar Sesión</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-2 bg-gradient-to-b from-background to-primary/5 border-t border-primary/20 backdrop-blur-xl">
            {menuItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300 group relative overflow-hidden"
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                <span className="font-medium relative z-10">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
