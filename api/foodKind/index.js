import express from 'express';
import User from './foodKindModel';
import jwt from 'jsonwebtoken';
import passport from '../../authenticate';

const router = express.Router(); // eslint-disable-line

router.get('/', (req, res, next) => {
    User.find().then(foodKinds =>  res.status(200).json(foodKinds)).catch(next);
});
export default router;


