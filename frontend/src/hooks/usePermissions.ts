import { useQuery } from "@tanstack/react-query";
import { useEvent } from "@/contexts/EventContext";

export const usePermissions = () => {
    const { viewMode } = useEvent();

    // Read from the global cache we established in AppLayout
    const { data: weddingRes } = useQuery<any>({ queryKey: ['wedding-me'] });
    const memberContext = weddingRes?.data?.memberContext || weddingRes?.memberContext;

    if (!memberContext) {
        return { loading: true, canManageEvents: false, canEditBudget: false, isCouple: false, isPrivateView: false };
    }

    const isCouple = memberContext.role === 'BRIDE' || memberContext.role === 'GROOM';
    const isPrivateView = viewMode === 'individual';

    return {
        loading: false,
        isCouple,
        isPrivateView,
        role: memberContext.role,
        side: memberContext.side,
        // Strict RBAC evaluations
        canManageEvents: isCouple || memberContext.canManageEvents === true,
        canEditBudget: isCouple || memberContext.canManageBudget === true,
        canEditGuests: isCouple || memberContext.canEditGuests === true,
        canEditCombinedView: isCouple || memberContext.canEditCombinedView === true,
        canViewPrivate: isCouple || memberContext.canViewPrivate === true,
    };
};