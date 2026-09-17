"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  RotateCcw,
  TriangleAlert,
  Users,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

type NavItem = {
  title: string;
  url: string;
  Icon: typeof LayoutDashboardIcon;
};

const mainItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", Icon: LayoutDashboardIcon },
];

const adminItems: NavItem[] = [
  { title: "Akun Pengguna", url: "/akun-pengguna", Icon: Users },
];

function NavList({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <SidebarMenu>
      {items.map(({ title, url, Icon }) => (
        <SidebarMenuItem key={title}>
          <SidebarMenuButton
            tooltip={title}
            isActive={pathname === url || pathname.startsWith(`${url}/`)}
            render={<Link href={url} />}
          >
            <Icon />
            <span>{title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function SidebarNavMain() {
  const pathname = usePathname();

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const isAdmin =
    (session?.user as { role?: string } | undefined)?.role === "admin";

  if (isPending) {
    return (
      <>
        <SidebarGroup>
          <SidebarGroupLabel>Utama</SidebarGroupLabel>
          <NavList items={mainItems} pathname={pathname} />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenu>
        </SidebarGroup>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SidebarGroup>
          <SidebarGroupLabel>Utama</SidebarGroupLabel>
          <NavList items={mainItems} pathname={pathname} />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <div
                className="flex cursor-pointer items-center justify-center gap-2 py-2 text-xs text-muted-foreground"
                onClick={() => refetch()}
              >
                <TriangleAlert className="size-4 shrink-0" />
                <span>Menu gagal dimuat</span>

                <RotateCcw className="size-3 shrink-0" />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </>
    );
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Utama</SidebarGroupLabel>
        <NavList items={mainItems} pathname={pathname} />
      </SidebarGroup>

      {isAdmin && (
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <NavList items={adminItems} pathname={pathname} />
        </SidebarGroup>
      )}
    </>
  );
}
