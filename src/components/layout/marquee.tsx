import { cn } from "@/lib/utils";

export function Marquee({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex w-full overflow-x-hidden border-b border-border/40 bg-background py-2",
        className
      )}
      {...props}
    >
      <div className="animate-marquee whitespace-nowrap">
        <span className="mx-4 text-sm font-medium text-muted-foreground">Livraison gratuite pour les commandes de plus de 50€</span>
        <span className="mx-4 text-sm font-medium text-muted-foreground">Retours faciles sous 30 jours</span>
        <span className="mx-4 text-sm font-medium text-muted-foreground">Nouvelles collections chaque semaine</span>
        <span className="mx-4 text-sm font-medium text-muted-foreground">Inscrivez-vous et obtenez 10% de réduction</span>
        <span className="mx-4 text-sm font-medium text-muted-foreground">Suivez-nous sur les réseaux sociaux</span>
      </div>

      <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
        <span className="mx-4 text-sm font-medium text-muted-foreground">Livraison gratuite pour les commandes de plus de 50€</span>
        <span className="mx-4 text-sm font-medium text-muted-foreground">Retours faciles sous 30 jours</span>
        <span className="mx-4 text-sm font-medium text-muted-foreground">Nouvelles collections chaque semaine</span>
        <span className="mx-4 text-sm font-medium text-muted-foreground">Inscrivez-vous et obtenez 10% de réduction</span>
        <span className="mx-4 text-sm font-medium text-muted-foreground">Suivez-nous sur les réseaux sociaux</span>
      </div>
    </div>
  );
}
