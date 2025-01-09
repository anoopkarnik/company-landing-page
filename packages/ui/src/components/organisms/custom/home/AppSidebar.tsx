import {
    Sidebar,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../../shadcn/sidebar";
import { sidebarProps } from "@repo/ts-types/home/v1";
import { CompanyLogoName } from "../../../molecules/custom/v1/CompanyLogoName";
import SidebarItems from "../../../molecules/custom/v1/SidebarItems";
import SidebarFooterItems from "../../../molecules/custom/v1/SidebarFooterItems";
import SidebarUser  from "../../../molecules/custom/v1/SidebarUser";
import ProgressWithCredits from "../../../molecules/custom/v1/ProgressWithCredits";
import { UpgradeToProButton } from "../../../molecules/custom/v1/UpgradeToProButton";
import NotificationSheet from "./NotificationSheet";

export function AppSidebar({name,quote,logo,darkLogo,homePath,items,footerItems,pricingList,
    logoutFunction,documentationLink,supportEmailAddress,githubUsername,githubRepositoryName,redirect,connections,
    maxTrialCredits,maxProCredits,showCredits,userDetails}:sidebarProps) {
        
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <CompanyLogoName logo={logo} darkLogo={darkLogo} name={name} quote={quote} homePath={homePath}/>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarItems items={items} redirect={redirect}/>
            <SidebarFooterItems footerItems={footerItems}/>
            <SidebarFooter className="p-0">
                <NotificationSheet />
            </SidebarFooter>

            <SidebarFooter>
                {userDetails?.access === "TRIAL" ? <UpgradeToProButton />:null}
                {showCredits && <ProgressWithCredits creditsUsed={userDetails?.creditsUsed} maxTrialCredits={maxTrialCredits}
                 maxProCredits={maxProCredits} access={userDetails?.access}/>}
                <SidebarUser logoutFunction={logoutFunction} pricingList={pricingList}
                      documentationLink={documentationLink} supportEmailAddress={supportEmailAddress} githubUsername={githubUsername} 
                      githubRepositoryName={githubRepositoryName} connections={connections}/>
            </SidebarFooter>
        </Sidebar>
    );
}
  