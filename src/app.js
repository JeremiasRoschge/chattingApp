import express from "express";
import morgan from "morgan";
import exphbs from 'express-handlebars';
import passport from "passport";
import path from "path";
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser'
const __filename = fileURLToPath(import.meta.url);
import flash from 'connect-flash'
import session from 'express-session'
import validator from 'express-validator'
import MySQLStore from 'express-mysql-session';
const __dirname = path.dirname(__filename);

import wordsRoutes from "./routes/chat.routes.js";
import indexRoutes from "./routes/index.routes.js";
import linksRoutes from "./routes/links.routes.js";
import signup from "./routes/authentication.routes.js";
import helpers from "./lib/handlebars.js"

import { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_DATABASE  } from './config.js'
import './lib/passport.js'

//Initialize
const app = express();
import './lib/passport.js'

const MySQLStoreSession = MySQLStore(session);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: helpers,
}));
app.set('view engine',  '.hbs')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(session({
  secret: 'jereapp',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStoreSession({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE,
    clearExpired: true,
    checkExpirationInterval: 900000, // 15 minutes
    expiration: 86400000, // 1 day
  }),
}));

app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

//global variables


app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  console.log('console.log in app.js', req.user)
  app.locals.user = req.user;
  next();
});


// Routes
//app.use("/", indexRoutes);
app.use("/", indexRoutes);
app.use("/links", linksRoutes);
app.use("/chat", wordsRoutes);
app.use('/auth', signup)

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
