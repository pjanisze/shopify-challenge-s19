'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('carts-products', {
    cart_id: {
      type: 'int',
      foreignKey: {
        name: 'cart_id_fk',
        table: 'carts',
        rules:{
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping:{
          cart_id: 'id'
        }
      }
    },
    product_id: {
      type: 'int',
      foreignKey: {
        name: 'product_id_fk',
        table: 'products',
        rules:{
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping:{
          product_id: 'id'
        }
      }
    },
    amount: {
      type: 'int'
    }
  });
};

exports.down = function(db) {
  return db.dropTable('carts-products');
};

exports._meta = {
  "version": 1
};
