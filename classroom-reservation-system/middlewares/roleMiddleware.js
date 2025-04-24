module.exports = function permit(...allowedRoles) {
    return (req, res, next) => {
        const { type_user } =req.user;

        if (!allowedRoles.includes(type_user)) {
            return res.status(403).json({ error: 'Acesso negado' });
        }
        next();
    };
};