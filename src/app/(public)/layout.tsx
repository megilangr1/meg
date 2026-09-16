import { SiteFooter } from "./_components/layout/site-footer";
import { SiteHeader } from "./_components/layout/site-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
