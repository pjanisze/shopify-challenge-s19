var express = require('express');
var router = express.Router();
var Product = require('../models/product');
/* GET All products listing. */
router.get('/', async function(req, res, next) {
  var getOnlyAvailableInventory = req.query.availableProducts;
  var minInventory = getOnlyAvailableInventory ? 1 : 0;
  var products = await Product.getAll(minInventory);
  res.json(products);
});

/* GET a single product listing. */
router.get('/:product', async function(req, res, next) {
  var title = req.params.product;
  var product = await Product.get(title);
  res.json(product);

});

router.put('/:product/buy', async function(req, res, next){
  var title = req.params.product;
  var results = await Product.purchase(title);
  res.json(results);

});

router.post('/create', async function(req, res, next) {
  var data = req.body;
  var productId = await Product.create(data);
  res.json({ id: productId});
});



module.exports = router;
