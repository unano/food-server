import express from 'express';
import User from './foodModel';
import jwt from 'jsonwebtoken';
import passport from '../../authenticate';

const router = express.Router(); // eslint-disable-line

router.get('/', (req, res, next) => {
    User.find().then(foods =>  res.status(200).json(foods)).catch(next);
});

router.get('/:foodKindId', (req, res, next) => {
    const foodKindId = req.params.foodKindId;
    User.findByFoodKindId(foodKindId).then(
        food => res.status(200).json(food)
    ).catch(next);});

export default router;


