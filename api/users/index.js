import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import passport from '../../authenticate';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    User.find().then(users =>  res.status(200).json(users)).catch(next);
});

// register
router.post('/', async (req, res, next) => {
  if (!req.body.phoneNumber || !req.body.password) {
    res.status(400).json({
      code: 400,
      msg: 'Please pass phone number and password.'
  });
  }
  if (req.query.action === 'register') {
    var reg=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
    const user = await User.findByPhoneNumber(req.body.phoneNumber).catch(next);
      if (user) {
        res.status(400).json({
          code: 400,
          msg: 'Phone number is used.'
      });
      }
      else{
        var result=reg.test(req.body.password);
        if(result){
          await User.create(req.body).catch(next);
          res.status(201).json({
            code: 201,
            msg: 'Successful created new user.',
          });}
        else{
          res.status(401).json({
            code: 401,
            msg: 'Password is at least 5 characters long and contain at least one number and one letter.'
        });
        }
      }
    } else {
      const user = await User.findByPhoneNumber(req.body.phoneNumber).catch(next);
      if (!user) return res.status(401).json({ code: 401, msg: 'Authentication failed. User not found.' });
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.sign(user.username, process.env.SECRET);
          // return the information including token as JSON
          res.status(200).json({
            success: true,
            token: 'BEARER ' + token,
          });
        } else {
          res.status(401).json({
            code: 401,
            msg: 'Authentication failed. Wrong password.'
        });
      }
    });
    }
});

router.post('/phoneNumberVerify', (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;
  User.findByPhoneNumber(phoneNumber)
    .then(phoneNumbers => phoneNumbers ? res.status(400).send({code: 400, msg: "phone number used" }) : res.status(201).send({code: 201, msg: "phone number not used" })).catch(next);
});

router.get('/:phoneNumber', (req, res, next) => {
  const phoneNumber = req.params.phoneNumber;
  User.findByPhoneNumber(phoneNumber).then(
    user => res.status(200).json(user)
  ).catch(next);
});

router.put('/changeName', async (req, res, next) => {
  User.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, { username: req.body.username })
  .then(res.status(201).json({ code: 201, msg: 'name update success.' })).catch(next);
});

router.put('/changePhone', async (req, res, next) => {
  User.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, { phoneNumber: req.body.phoneNumberC })
  .then(res.status(201).json({ code: 201, msg: 'phone update success.' })).catch(next);
});

router.put('/changeAddress', async (req, res, next) => {
  User.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, { address: req.body.address })
  .then(res.status(201).json({ code: 201, msg: 'address update success.' })).catch(next);
});

router.post('/:phone/order', async (req, res, next) => {
  const money = req.body.money;
  const date = req.body.date;
  const phone = req.params.phone;
  const user = await User.findByPhoneNumber(phone).catch(next);
  await user.order.push({ orderTime: date, totalMoney: money});  
  await user.save();
  res.status(201).json(user);
});

export default router;
