'use client';

import Link from 'next/link';
import { Menu, User, LogOut, Shield, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstantSearch } from '@/components/search/instant-search';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CartSheet } from '@/components/cart/cart-sheet';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, logout } = useAuth();
  const isAdmin = user?.email === 'grasdvirus@gmail.com';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="w-full flex h-16 max-w-7xl items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tighter">
              prime_panier
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <InstantSearch />
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" asChild>
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" /> Admin
                </Link>
              </Button>
            )}
            <CartSheet />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuLabel>
                      Connecté en tant que {user.displayName || user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={logout}>
                      <LogOut className="mr-2 h-4 w-4" /> Se déconnecter
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Non connecté</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/login" passHref>
                      <DropdownMenuItem>
                        <LogIn className="mr-2 h-4 w-4" /> Se connecter
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/signup" passHref>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" /> S'inscrire
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <InstantSearch />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
