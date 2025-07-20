import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Noir Élégant. Tous droits réservés.
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
