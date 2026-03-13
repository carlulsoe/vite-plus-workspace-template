import { siteConfig } from "../config/site";

export default function Footer() {
  return (
    <footer className="pb-8 pt-4">
      <div className="mx-auto flex w-[min(1120px,calc(100%-2rem))] flex-col justify-between gap-3 border-t border-black/8 py-4 text-sm text-ink-soft sm:flex-row">
        <p className="m-0">{siteConfig.description}</p>
        <p className="m-0">{siteConfig.footerTagline}</p>
      </div>
    </footer>
  );
}
