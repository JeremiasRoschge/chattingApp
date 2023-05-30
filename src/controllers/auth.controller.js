import passport from "passport";
import { pool } from "../db.js";

export const showVerificationPage = (req, res) => {
    res.render("auth/verification.hbs"); // Renderiza la plantilla de verificación (puedes ajustar el nombre y la ubicación según tu estructura de archivos)
  };

export const verifyCode = async (req, res) => {
    const { code } = req.body;
    console.log(code)
    const user = req.user;
    console.log('ver', req.user)
  
    // Verificar el código
    if (code === user.verifycode) {
      // Actualizar el estado de verificación del usuario en la base de datos
      await pool.query("UPDATE users SET isVerified = true, verifycode = NULL WHERE id = ?", [user.id]);
  
      // Redireccionar al usuario a la página de inicio o a cualquier otra página que desees
      res.redirect("/profile");
    } else {
      // Código de verificación incorrecto, mostrar un mensaje de error o redireccionar a una página de error
      res.redirect("/error");
    }
  };

export const signupGet = async (req, res) => {
    res.render('auth/signup')
}



export const signupPost = passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/auth/signup',
    failureFlash: true

})

export const profile = async (req, res) => {
    res.send("profile");
  
}
export const signIn = async (req, res) => {
    res.render('auth/signin')
}

export const signInPost = (req, res, next) => { 
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/auth/signin',
        failureFlash: true
        })(req, res, next)

}

export const logout = (req, res) => {
    
        req.logOut();
        res.redirect("/auth/signin");  

    };
