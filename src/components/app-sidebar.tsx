"use client";

import {
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
  IconLock,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Applications",
      url: "/dashboard/application",
      icon: IconFolder,
    },
    {
      title: "Users",
      url: "/dashboard/user",
      icon: IconUsers,
    },
    {
      title: "Permission",
      url: "/dashboard/permission",
      icon: IconLock,
    },
    {
      title: "Role",
      url: "/dashboard/role",
      icon: IconLock,
    },
  ],
  navSecondary: [
    {
      title: "Setting",
      url: "/dashboard/setting",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Hunter Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
