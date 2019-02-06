const db = require("./db");

exports.create = async (data) => {
	var sql = "INSERT INTO `products` SET ?";
	var results = await new Promise (( resolve, reject) => db.query(sql, data, (err, results) => {
		if(err) reject(err);
		console.log("New Product: " + data.title);
		resolve(results);
	}));
	return results.insertId;
};

exports.getAll = async (minInventory = 0) => {
	var sql = "SELECT * FROM `products` WHERE inventory_count >= ?";
	var results = await new Promise((resolve, reject) => db.query(sql, minInventory, (err, results) => {
		if(err) reject(err);
		console.log("Retrieved all products");
		resolve(results);
	}));
	return results;
};


exports.get = async (title) => {
	try{
		var sql = "SELECT * FROM `products` WHERE `title` = ? LIMIT 1";
		var results = await new Promise((resolve, reject) =>  db.query(sql, title, (err, results) => {
			if(err) reject(err);
			resolve(results);
		}));
		console.log("prod: %j", results);
		return results[0];
	} catch(err){
		throw err;
	}
}
exports.getById = async (id) => {
	try{
		var sql = "SELECT * FROM `products` WHERE `id` = ?";
		var results = await new Promise((resolve, reject) =>  db.query(sql, id, (err, results) => {
			if(err) reject(err);
			resolve(results);
		}));
		console.log("prod: %j", results);
		return results[0];
	} catch(err){
		throw err;
	}
}

exports.purchase = async (title) => {

	console.log("entering");
	var product = await exports.get(title);
	console.log("leaving");

	if(product == null || product.inventory_count <= 0){
		console.log("Trying to buy item: " + title + ", NO INVENTORY OR DOES NOT EXIST");
		return null;
	}
	var sql = "UPDATE products SET inventory_count = inventory_count - 1 WHERE title = ? AND inventory_count > 0";
	var results = await new Promise ((resolve, reject) => db.query(sql, title, (err, results) => {
		if(err) reject(err);
		console.log("Purchased product: %j", results);
		resolve(results);
	}));
	return results;
}
