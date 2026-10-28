"use client";

import {
  ChevronsUpDown,
  Loader2,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/shared/logout-button";

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((part) => part.charAt(0))
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

export function SidebarUserInfo() {
  const { isMobile } = useSidebar();

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem className="border-t">
          <SidebarMenuButton
            aria-label="Memuat sesi"
            className="flex items-center justify-center gap-2 py-2"
          >
            <Loader2 className="size-4 shrink-0 animate-spin" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (error || !session?.user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem className="border-t">
          <div
            className="flex cursor-pointer items-center justify-center gap-2 py-2 text-xs text-destructive"
            onClick={() => refetch()}
          >
            <TriangleAlert className="size-4 shrink-0" />
            <span>Terjadi kesalahan!</span>

            <RotateCcw className="size-3 shrink-0" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <DropdownMenu>
        <SidebarMenuItem className="pt-2 border-t">
          <SidebarMenuButton
            render={<DropdownMenuTrigger className="cursor-pointer" />}
            className="py-8"
          >
            <Avatar className="size-8 rounded-lg">
              {session.user.image && (
                <AvatarImage src={session.user.image} alt={session.user.name} />
              )}
              <AvatarFallback className="rounded-lg">
                {initials(session.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {session.user.name}
              </span>
              <span className="truncate text-xs">{session.user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>

        <DropdownMenuContent
          className="w-(--anchor-width) min-w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  {session.user.image && (
                    <AvatarImage
                      src={session.user.image}
                      alt={session.user.name}
                    />
                  )}
                  <AvatarFallback className="rounded-lg">
                    {initials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session.user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer p-0 hover:bg-transparent">
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenu>
  );
}
