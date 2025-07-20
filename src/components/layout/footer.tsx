import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="w-full flex flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 md:flex-row max-w-7xl mx-auto">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} prime_panier. Tous droits réservés.
        </p>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Conditions
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
}
