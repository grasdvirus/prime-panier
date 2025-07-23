import { cn } from "@/lib/utils";
import { getMarquee } from "@/lib/marquee";

export async function Marquee() {
  const marqueeData = await getMarquee();
  const { messages } = marqueeData;

  if (!messages || messages.length === 0) return null;

  const MarqueeContent = () => (
    <>
      {messages.map((message, index) => (
        <span key={index} className="mx-4 text-sm font-medium">{message}</span>
      ))}
    </>
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div
            className={cn(
                "relative flex w-full overflow-x-hidden bg-muted/50 text-muted-foreground rounded-lg p-2"
            )}
        >
            <div className="animate-marquee whitespace-nowrap">
                <MarqueeContent />
            </div>

            <div className="absolute top-0 animate-marquee2 whitespace-nowrap h-full flex items-center">
                <MarqueeContent />
            </div>
        </div>
    </div>
  );
}
