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
**POST**: `/carts/new`
  - instantiate a new cart. If one already exists, return 500

**GET**: `/carts/`
  - retrieve information on the current active cart
  - gets the cart_id, the list of products and how many there are in the cart along with the total cost of the cart

**PUT**: `/carts/add/:productTitle`
  - Add (1) product to the cart
  - If no cart currently is active, create a new one
  - If there is not enough inventory to add the product to the cart, return a 500

**PUT**: `/carts/checkout/`
  - Complete the cart by subtracting the inventory amount of each product by the amount in the cart and deactivating the cart
  - If no cart is currently active, return 500
