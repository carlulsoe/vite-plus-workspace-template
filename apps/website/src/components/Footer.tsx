import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="pb-8 pt-4">
      <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">
        <Separator className="bg-black/8" />
        <div className="flex flex-col justify-between gap-3 py-4 text-sm text-ink-soft sm:flex-row sm:items-center">
          <p className="m-0">{siteConfig.description}</p>
          <Badge
            variant="outline"
            className="rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-ink-muted"
          >
            {siteConfig.footerTagline}
          </Badge>
        </div>
      </div>
    </footer>
  );
}
