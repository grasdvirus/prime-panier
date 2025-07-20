import { cn } from "@/lib/utils";

export function Marquee({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div
            className={cn(
                "relative flex w-full overflow-x-hidden bg-muted/50 text-muted-foreground rounded-lg p-2",
                className
            )}
            {...props}
        >
            <div className="animate-marquee whitespace-nowrap">
                <span className="mx-4 text-sm font-medium">Livraison gratuite pour les commandes de plus de 50€</span>
                <span className="mx-4 text-sm font-medium">Retours faciles sous 30 jours</span>
                <span className="mx-4 text-sm font-medium">Nouvelles collections chaque semaine</span>
                <span className="mx-4 text-sm font-medium">Inscrivez-vous et obtenez 10% de réduction</span>
                <span className="mx-4 text-sm font-medium">Suivez-nous sur les réseaux sociaux</span>
            </div>

            <div className="absolute top-0 animate-marquee2 whitespace-nowrap h-full flex items-center">
                <span className="mx-4 text-sm font-medium">Livraison gratuite pour les commandes de plus de 50€</span>
                <span className="mx-4 text-sm font-medium">Retours faciles sous 30 jours</span>
                <span className="mx-4 text-sm font-medium">Nouvelles collections chaque semaine</span>
                <span className="mx-4 text-sm font-medium">Inscrivez-vous et obtenez 10% de réduction</span>
                <span className="mx-4 text-sm font-medium">Suivez-nous sur les réseaux sociaux</span>
            </div>
        </div>
    </div>
  );
}
