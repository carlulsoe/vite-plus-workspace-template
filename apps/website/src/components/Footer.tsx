import { siteConfig } from "../config/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__inner">
        <p>{siteConfig.description}</p>
        <p>{siteConfig.footerTagline}</p>
      </div>
    </footer>
  );
}
