import Image from "next/image";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarBrand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
          <Image
            src="/brand/logo-icon-clear.png"
            alt="Logo MeGGi"
            width={32}
            height={32}
            className="size-8 dark:invert"
          />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">MeGGi.dev</span>
            <span className="truncate text-xs">Admin</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
