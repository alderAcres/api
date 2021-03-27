function requireUser(req, res, next) {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
      });
    }
  
    next();
}

function requireAdminUser (req, res, next) {
  if (!req.user.admin) {
    next({
      name: "InsufficientPrivileges",
      message: "Only admin users can perform this action"
    });
  }

  next();
}
  
module.exports = {
    requireUser,
    requireAdminUser
}