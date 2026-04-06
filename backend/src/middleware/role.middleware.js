export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden, Not allowed!" });
        }
        next();
    };
};
//above si the dynamic checking of the roles... as there are something which should be done by admin, some by analyst.. instead to creating multiple functions for to check for each role, this is a dynamic handling of multiple roles.
