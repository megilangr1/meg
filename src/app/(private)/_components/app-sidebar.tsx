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

const AppSidebar = () => {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarBrand />
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
