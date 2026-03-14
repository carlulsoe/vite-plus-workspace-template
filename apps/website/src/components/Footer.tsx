import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="pb-12 pt-8 reveal-up [animation-delay:600ms]">
      <div className="section-container">
        <Separator className="bg-black/5 dark:bg-white/5" />
        <div className="flex flex-col justify-between gap-6 py-8 text-sm text-ink-soft sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p className="font-bold text-ink">{siteConfig.name}</p>
            <p className="m-0 text-ink-muted">{siteConfig.description}</p>
          </div>
          <Badge variant="outline" className="badge-section w-fit">
            {siteConfig.footerTagline}
          </Badge>
        </div>
      </div>
    </footer>
  );
}
