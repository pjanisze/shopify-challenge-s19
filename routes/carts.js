var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');

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

//get current cart
router.get('/', async function(req, res, next) {
  var carts = await Cart.getActiveCarts();
  if(carts.length == 0){
    //there are no active cart(s)
    res.json({});
  }
  var products = await Cart.getCart(carts[0].id);

  cartCost = 0;
  for(var i in products){
    var product = Product.getById(products[i].product_id);
    var productCost = product.price;
    cartCost += product.amount * productCost
  }

  var response = {
    "cartId": carts[0].id,
    "products": products,
    "totalCost": cartCost
  };
  res.json(response);
});

router.put('/add/:product', async function(req, res, next) {
  //assert there are enough products to post them
  var product = await Product.get(req.params.product);
  if(product == undefined){
    res.status(500).send("Product does not exist");
  }
  var productInventory = product.inventory_count;
  var productId = product.id;
  //create a new cart if there currently isnt an active one
  var carts = await Cart.getActiveCarts();
  var cartId;
  if(carts.length == 0){
    cartId = await Cart.create();
  } else {
    cartId = carts[0].id;
  }

  var curAmount = await Cart.getProductAmount(cartId, productId);
  if(productInventory - curAmount <= 0){
    res.status(500).send("Not enough inventory to add product");
  }
  data = {
    cart_id: cartId,
    product_id: productId
  };
  var queryResult = await Cart.add(data);
  res.status(200).send("Product added!");

});

router.put('/checkout', async function(req, res, next) {
  var carts = await Cart.getActiveCarts();
  if(carts.length == 0){
    //there are no active cart(s)
    res.status(500).send("No active carts!");
  }
  var products = await Cart.getCart(carts[0].id);

  for(var i in products){
    var product = await Product.getById(products[i].product_id);
    for(var i = 0; i < products[i].amount; i++){
      await Product.purchase(product.title);
    }
  }
  Cart.deactivate(carts[0].id);
  res.status(200).send("Cart checkedout!");

});



module.exports = router;
