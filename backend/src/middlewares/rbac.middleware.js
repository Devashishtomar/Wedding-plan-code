export const requirePermission = (requiredPermission, isDeleteAction = false) => {
    return (req, res, next) => {
        const memberContext = req.memberContext;

        if (!memberContext) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: No active wedding workspace found.'
            });
        }

        const role = memberContext.role;

        if (role === 'BRIDE' || role === 'GROOM' || role === 'PENDING') {
            return next();
        }

        if (isDeleteAction && req.query.view === 'PRIVATE') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only the Bride or Groom can delete items in the private view."
            });
        }

        if (memberContext[requiredPermission] === true) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: `Access denied. You do not have permission to perform this action (${requiredPermission}).`
        });
    };
};