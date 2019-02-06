# Shopify Backend Development Internship Challenge 2019

## Tools
 - mySQL database
 - Node.js

## Build Setup

#### Requirements:
`.env`:
 ```
 DB_URL=${db_url}
 DB_PORT=${db_port}
 DB=${db_name}
 DB_USER=${db_user}
 DB_PASSWORD=${db_password}
 ```

#### Initialization
```
npm i
db-migrate up
npm start
```

## Documentation
### Endpoints
**GET**: `/products/`
 	- Retrieve all the products listed in the database.
	- Options: `?availableProducts=true` - get only products with inventory > 0

**GET**: `/products/:productTitle`
	- retrieve price, id, and inventory_count of product

**PUT**: `/products/:productTitle/buy`
	- purchase product
	- returns null if inventory == 0

**POST**: `/products/create`
	- create a new product
	- requires json body:
		```
		{
			"title": ...,
			"price": ...,
			"inventory_count": ...
		}
		```
