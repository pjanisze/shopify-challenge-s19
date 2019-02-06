var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

/* New cart*/
router.post('/new', async function(req, res, next) {
  //verify no carts currently active (can be changed later when users are involved)
  var carts = await Cart.getActiveCarts();
  if(carts.length > 0){
    //there are active cart(s), cant create a new cart
    res.status(500).send("Cannot create a new cart since there are cart(s) currently active");
  }
  //else create a new cart and send the id
  var newCartId = await Cart.create();
  res.json({cartId: newCartId});
});

router.post('/', async function(req, res, next) {
  var
});

router.put('/add/:productId', async function(req, res, next) {
  //assert there are enough products to post them

  //create a new cart if there currently isnt an active one
  var carts = await Cart.getActiveCarts();
  var cartId;
  if(carts.length == 0){
    cartId = await Cart.create();
  } else {
    cartId = carts[0].id;
  }
  data = {
    cart_id: cartId,
    product_id: req.params.productId
  };
  var queryResult = await Cart.add(data);
  return res.status(200).send("Product added!");

});

module.exports = router;
