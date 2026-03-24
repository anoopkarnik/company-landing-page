
import { CancellationRefundPoliciesProps } from "@/lib/ts-types/legal";
import { companyLegalName, lastUpdated, siteName, supportEmailAddress, websiteUrl } from "../appDetails";

export const cancellationRefundPolicies:CancellationRefundPoliciesProps = {
    supportEmailAddress,
    siteName,
    companyLegalName,
    websiteUrl,
    lastUpdated
}