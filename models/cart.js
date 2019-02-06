const db = require("./db");

exports.create = async () => {
	var sql = "INSERT INTO carts SET active = true";
	var results = await new Promise (( resolve, reject) => db.query(sql, (err, results) => {
		if(err) reject(err);
		resolve(results);
	}));
	console.log("New Cart: " +  results.insertId);
	return results.insertId;
};

exports.getActiveCarts = async () => {
	var sql = "SELECT * FROM carts WHERE active = true";
	var results = await new Promise (( resolve, reject) => db.query(sql, (err, results) => {
		if(err) reject(err);
		resolve(results);
	}));
	return results[0];
}

exports.getCart = async (id) => {
	var sql = "SELECT * FROM carts_products WHERE cart_id = ?";
	var results = await new Promise (( resolve, reject) => db.query(sql, id, (err, results) => {
		if(err) reject(err);
		resolve(results);
	}));
	return results;
}

//data
// cartId
// productId
exports.add = async (data) => {
	var sql = "SELECT COUNT(*) AS count FROM carts_products WHERE cart_id = ? AND product_id = ? "

	var results = await new Promise (( resolve, reject) => db.query(sql, [data.cart_id, data.product_id], (err, results) => {
		if(err) reject(err);
		resolve(results);
	}));

	console.log(results[0].count);

	var sql =  results[0].count > 0 ? "UPDATE carts_products SET amount = amount + 1 WHERE cart_id = ? AND product_id = ?" :
	 																	"INSERT INTO carts_products SET cart_id = ?, product_id = ? , amount = 1";
	var results = await new Promise (( resolve, reject) => db.query(sql, [data.cart_id, data.product_id], (err, results) => {
		if(err) reject(err);
		resolve(results);
	}));
	console.log("Inserted product into cart");
	return true;
}

exports.getProductAmount = async (cartId, productId) => {
	var sql = "SELECT amount FROM carts_products WHERE cart_id = ? AND product_id = ?";
	var results = await new Promise (( resolve, reject) => db.query(sql, [cartId, productId], (err, results) => {
		if(err) reject(err);
		resolve(results);
	}));
	if(results.length == 0){
		return 0;
	}else{
		return results[0];
	}
}

exports.deactivate = async (cartId) => {
	var sql = "UPDATE carts SET active = false WHERE id = ?";
	var results = await new Promise (( resolve, reject) => db.query(sql, cartId, (err, results) => {
		if(err) reject(err);
		resolve(results);
	}));
	return true;
}
