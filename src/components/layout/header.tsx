'use client';

import Link from 'next/link';
import { Menu, User, LogOut, Shield, LogIn, MessageCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InstantSearch } from '@/components/search/instant-search';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
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
import { Separator } from '../ui/separator';

export function Header() {
  const { user, logout } = useAuth();
  const isAdmin = user?.email === 'grasdvirus@gmail.com';

  const UserMenu = ({ inSheet = false }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={inSheet ? "ghost" : "ghost"} size={inSheet ? "lg" : "icon"} className={inSheet ? "w-full justify-start" : ""}>
          <User className="mr-2 h-5 w-5" />
          <span className={inSheet ? "" : "sr-only"}>Profil</span>
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
  );

  return (
    <header className="sticky top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="w-full flex h-16 max-w-7xl items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tighter">
              prime_panier
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/collections">
                  <Package className="mr-2 h-4 w-4" /> Collections
                </Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/contact">
                  <MessageCircle className="mr-2 h-4 w-4" /> Contact
                </Link>
            </Button>
            {isAdmin && (
              <Button variant="outline" asChild>
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" /> Admin
                </Link>
              </Button>
            )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <InstantSearch />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <CartSheet />
            <UserMenu />
          </div>

          <div className="flex items-center gap-2 md:hidden">
              <CartSheet />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Ouvrir le menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <InstantSearch />
                  </div>
                  <Separator />
                   <div className="flex flex-col gap-2 p-4">
                      <SheetClose asChild>
                          <Button variant="ghost" asChild className="justify-start text-base">
                            <Link href="/collections">
                              <Package className="mr-2 h-4 w-4" /> Collections
                            </Link>
                          </Button>
                      </SheetClose>
                       <SheetClose asChild>
                          <Button variant="ghost" asChild className="justify-start text-base">
                            <Link href="/contact">
                              <MessageCircle className="mr-2 h-4 w-4" /> Contact
                            </Link>
                          </Button>
                      </SheetClose>
                      {isAdmin && (
                        <SheetClose asChild>
                          <Button variant="ghost" asChild className="justify-start text-base">
                              <Link href="/admin">
                                <Shield className="mr-2 h-4 w-4" /> Admin
                              </Link>
                          </Button>
                        </SheetClose>
                      )}
                   </div>
                   <div className="mt-auto p-4">
                      <Separator className="mb-4" />
                      <UserMenu inSheet={true} />
                   </div>
                </SheetContent>
              </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
    