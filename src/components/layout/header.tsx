'use client';

import Link from 'next/link';
import { Menu, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstantSearch } from '@/components/search/instant-search';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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

const adminUser = { email: 'grasdvirus@gmail.com', name: 'Admin' };
const guestUser = { email: 'guest@example.com', name: 'Guest' };

export function Header() {
  const { user, login } = useAuth();
  const isAdmin = user?.email === adminUser.email;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="hidden items-center gap-2 md:flex">
            <span className="text-lg font-bold tracking-tighter">
              prime_panier
            </span>
          </Link>
          <div className="hidden md:block">
            <InstantSearch />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
             <Button variant="outline" asChild>
                <Link href="/admin"><Shield className="mr-2" /> Admin</Link>
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
              <DropdownMenuLabel>
                {user ? `Connecté en tant que ${user.name}` : 'Non connecté'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => login(adminUser)}>
                <Shield className="mr-2" /> Se connecter (Admin)
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => login(guestUser)}>
                <User className="mr-2" /> Se connecter (Invité)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => login(null)}>
                <LogOut className="mr-2" /> Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
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
