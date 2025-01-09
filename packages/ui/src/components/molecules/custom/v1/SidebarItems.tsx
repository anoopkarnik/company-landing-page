import { sidebarHeaderSubItemsProps, sidebarListProps } from "@repo/ts-types/home/v1";
import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../shadcn/collapsible"
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarMenuAction,

} from "../../../organisms/shadcn/sidebar";
import { usePathname } from 'next/navigation'
import { cn } from "../../../../lib/utils";


const SidebarItems = ({ items, redirect }: sidebarListProps) => {
    const pathname = usePathname();
    return (
        <SidebarContent>
            {Object.keys(items).map((key) => (
                <SidebarGroup key={key}>
                    <SidebarGroupLabel>{key}</SidebarGroupLabel>
                    <SidebarMenu>
                        {items[key]?.map((item: any) => (
                            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip={item.title} 
                                    className={cn("cursor-pointer",pathname===item.url && "bg-sidebar-accent")}>
                                        <div onClick={() => redirect(item.url)}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </div>
                                    </SidebarMenuButton>
                                    {item.items?.length ? (
                                        <>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                    <ChevronRight />
                                                    <span className="sr-only">Toggle</span>
                                                </SidebarMenuAction>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items.map((subItem: sidebarHeaderSubItemsProps) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild className={cn("cursor-pointer",
                                                                pathname===subItem.url && "bg-sidebar-accent")}>
                                                                <div onClick={(e) => { e.stopPropagation(); redirect(subItem.url); }}>
                                                                    <span>{subItem.title}</span>
                                                                </div>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </>
                                    ) : null}
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </SidebarContent>
    );
};

export default SidebarItems;
