import express from 'express';
const stripe = require("stripe")(process.env.REACT_APP_PAY_KEY);
const { v4: uuidv4 } = require('uuid');

const router = express.Router(); // eslint-disable-line



router.post("/", (req,res) => {
  const{product, token} = req.body;
  console.log("PRODUCT", product);
  console.log("PRICE", product.price);
  const idempontencyKey = uuidv4();

  
  return stripe.customers.create({
      email: token.email,
      source: token.id
  }).then(customer =>{
      stripe.charges.create({
          amount:product.price*100,
          currency:'usd',
          customer:customer.id,
          receipt_email: token.email,
          description: `purchase of ${product.name}`,
      }),{idempontencyKey};
  })
  .then(result =>res.status(200).json(result))
  .catch(err =>console.log(err));
});
  
export default router;