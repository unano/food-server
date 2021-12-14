import dotenv from 'dotenv';
import express from 'express';
import './db';
import session from 'express-session';
import passport from './authenticate';
import {loadUsers} from './seedData';
import {loadFoods} from './seedData';
import {loadFoodKinds} from './seedData';
import loglevel from 'loglevel';
import usersRouter from './api/users';
import foodsRouter from './api/food';
import foodKindsRouter from './api/foodKind';
import paymentRouter from './api/payment';

dotenv.config();

// create a write stream (in append mode) for logging

const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).end(`error, ${err.stack} `);
};

if (process.env.NODE_ENV === 'test') {
  loglevel.setLevel('warn');
 } else {
  loglevel.setLevel('info');
 }

if (process.env.SEED_DB === 'true' && process.env.NODE_ENV === 'development') {
  loadUsers();
  loadFoods();
  loadFoodKinds();
}

const app = express();

//Set up default helmet security
// setup the logger

const port = process.env.PORT;

//app.use(express.static('public'));
//configure body-parser
app.use(express.static('public'));
app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(session({
  secret: 'ilikecake',
  resave: true,
  saveUninitialized: true
}));

app.use('/api/payment',paymentRouter);
app.use('/api/users', usersRouter);
app.use('/api/foods', foodsRouter);
app.use('/api/foodKinds', foodKindsRouter);
app.use(errHandler);
let server = app.listen(process.env.PORT, () => {
  loglevel.info(`Server running at ${port}`);
});

module.exports = server;