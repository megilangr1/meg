import Link from "next/link";
import { GlobeIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [{ title: "Web Utama", url: "/", Icon: GlobeIcon }];

export function SidebarNavOther() {
  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupLabel>Lainnya</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(({ title, url, Icon }) => (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton tooltip={title} render={<Link href={url} />}>
              <Icon />
              <span>{title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
