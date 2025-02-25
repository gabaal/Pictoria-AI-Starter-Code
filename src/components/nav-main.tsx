/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  CreditCardIcon,
  FrameIcon,
  ImageIcon,
  ImagesIcon,
  LayersIcon,
  Settings2Icon,
  SquareTerminalIcon,
  type LucideIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: SquareTerminalIcon,
  },
  {
    title: "Generate Image",
    url: "/image-generation",
    icon: ImageIcon,
  },
  {
    title: "My Models",
    url: "/models",
    icon: FrameIcon,
  },
  {
    title: "Train Model",
    url: "/model-training",
    icon: LayersIcon,
  },
  {
    title: "My Images",
    url: "/gallery",
    icon: ImagesIcon,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCardIcon,
  },
  {
    title: "Settings",
    url: "/account-settings",
    icon: Settings2Icon,
  },
];
export function NavMain() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => (
          <Link
            href={item.url}
            key={item.title}
            className={cn(
              "rounded-none",
              pathname === item.url
                ? "text-primary bg-primary/5"
                : "text-muted-foreground"
            )}
          >
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
