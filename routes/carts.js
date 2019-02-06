var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');

/* New cart*/
router.post('/new', async function(req, res, next) {
  //verify no carts currently active (can be changed later when users are involved)
  var carts = await Cart.getActiveCarts();
  if(carts != undefined){
    //there are active cart(s), cant create a new cart
    res.status(500).send("Cannot create a new cart since there are cart(s) currently active");
    return;
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
  var products = await Cart.getCart(carts.id);
  if(products == undefined) products = [];
  cartCost = 0;
  for(var i in products){
    console.log(product);
    console.log(products[i]);
    var product = await Product.getById(products[i].product_id);
    var productCost = product.price;
    cartCost += products[i].amount * productCost
  }

  var response = {
    "cartId": carts.id,
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
    return;
  }
  var productInventory = product.inventory_count;
  if(productInventory == 0){
    res.status(500).send("No inventory on product");
    return;
  }

  var productId = product.id;
  //create a new cart if there currently isnt an active one
  var carts = await Cart.getActiveCarts();
  var cartId;
  if(carts == undefined){
    cartId = await Cart.create();
  } else {
    cartId = carts.id;
  }

  var curAmount = await Cart.getProductAmount(cartId, productId);
  if(productInventory - curAmount <= 0){
    res.status(500).send("Not enough inventory to add product");
    return;
  }
  data = {
    cart_id: cartId,
    product_id: productId
  };
  var queryResult = await Cart.add(data);
  res.status(200).send("Product added!");
  return;

});

router.put('/checkout', async function(req, res, next) {
  var carts = await Cart.getActiveCarts();
  if(carts == undefined){
    //there are no active cart(s)
    res.status(500).send("No active carts!");
    return;
  }
  var products = await Cart.getCart(carts.id);
  console.log(products);
  for(var i in products){
    var product = await Product.getById(products[i].product_id);
    console.log("\n\n\n");
    for(var j = 0; j < products[i].amount; j++){
      console.log(j);
      console.log(product);
      console.log(products);
      await Product.purchase(product.title);
    }
  }
  Cart.deactivate(carts.id);
  res.status(200).send("Cart checkedout!");

});



module.exports = router;
