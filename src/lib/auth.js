
export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();

    }
    return res.redirect('/auth/signin')
}


export const isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/profile')
}

export const ensureVerified = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isVerified === true) {
    console.log(req.user.isVerified);
    res.render("profile");
  } else {
    // Usuario no autenticado o no verificado, redireccionar a la página de inicio de sesión
    res.redirect("/auth/signup");
  }
  };