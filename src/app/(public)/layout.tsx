import { SiteFooter } from "./_components/layout/site-footer";
import { SiteHeader } from "./_components/layout/site-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Lewati ke konten
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
