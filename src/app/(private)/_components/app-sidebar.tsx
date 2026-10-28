import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarNavMain } from "./sidebar/sidebar-nav-main";
import { SidebarBrand } from "./sidebar/sidebar-brand";
import { SidebarUserInfo } from "./sidebar/sidebar-user-info";
import { SidebarNavOther } from "./sidebar/sidebar-nav-other";

const AppSidebar = ({ role }: { role?: string | null }) => {
  return (
    <Sidebar variant="inset" role="navigation" aria-label="Sidebar">
      <SidebarHeader>
        <SidebarBrand role={role} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavMain />

        <SidebarNavOther />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserInfo />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
