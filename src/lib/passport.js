import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import helpers from "./helpers.js";
import { pool } from "../db.js";
import nodemailer from "nodemailer";


passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
      const user = rows[0][0];
      if (user && await helpers.matchPassword(password, user.password)) {
          done(null, user, req.flash('success', 'Welcome ' + user.username));
      } else {
          done(null, false, req.flash('message', 'Incorrect Password'));
      }
  } else {
      return done(null, false, req.flash('message', 'The Username does not exist.'));
  }
}));

// Configurar transporte de correo electrónico
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "go to mailtrap and obtain your user",
    pass: "pass"
  }
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { fullname, email } = req.body;
      let newUser = {
        fullname,
        username,
        password,
        email,
        isVerified: false,
      };
      newUser.password = await helpers.encryptPassword(password);

      // Generar código de verificación
      const verifyCode = Math.random().toString(36).slice(-8);
      newUser.verifyCode = verifyCode;

      // Enviar correo electrónico con el código de verificación
      const mailOptions = {
        from: "jroschge@escuelasproa.edu.ar",
        to: email,
        subject: "Verification Code",
        text: `Your verification code is: ${verifyCode}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      const result = await pool.query("INSERT INTO users SET ?", { ...newUser, isVerified: false });
      newUser.id = result[0].insertId;
      return done(null, newUser);
    }
  )
);


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async function(id, done) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
      if (rows.length > 0) {
        const user = rows[0];
        user.isVerified = Boolean(user.isVerified); // Asegura que isVerified sea un valor booleano
        done(null, user);
      } else {
        // Usuario no encontrado en la base de datos, redireccionar a la página de inicio de sesión
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  });
