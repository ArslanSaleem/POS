const sqlite3 = require('sqlite3')
const Promise = require('bluebird');

class Inventory {
    constructor(db) {
      this.db = db
    }

    createSchema() {
      const categorySchema = `
      CREATE TABLE IF NOT EXISTS category(
          id INTEGER constraint category_pk primary key autoincrement,
          name VARCHAR(255),
          attributes BLOB
          );`

      const inventorySchema = `
      CREATE TABLE IF NOT EXISTS inventory (
          id INTEGER
          primary key autoincrement,
          category INTEGER references category,
          item_name TEXT,
          image TEXT,
          quantity INTEGER,
          price FLOAT,
          attributes BLOB
          );`

      const orderSchema = `
      CREATE TABLE IF NOT EXISTS saleorder (
          id INTEGER constraint order_pk
          primary key autoincrement,
          date DATETIME default CURRENT_TIMESTAMP not null,
          customer_name TEXT default null,
          total DOUBLE,
          timestamp DOUBLE
          );`

      const cartSchema = `
      CREATE TABLE IF NOT EXISTS cart (
          id INTEGER constraint cart_pk primary key autoincrement,
          price DOUBLE not null,
          item INTEGER constraint  item references inventory,
          order_no INTEGER constraint order_no references saleorder,
          quantity INTEGER default 1,
          attributes BLOB
          );
      `;
      this.db.run(categorySchema);
      this.db.run(inventorySchema);
      this.db.run(orderSchema);
      this.db.run(cartSchema);
    }
    addCategory(category){
      let attributes = category.attributes;
      const stmt = this.db.prepare(`INSERT INTO category (name, attributes) VALUES ('${category.name}', json(?))`);
      stmt.run(attributes);
      stmt.finalize();
    }
    getAllCategories(callback){
      const sql = `SELECT * from category`;
      let db_instance = this.db;
      return new Promise(function (resolve, reject) {
            db_instance.all(sql, (err, rows) => {
                if (err) {
                console.error(err.message);
                }
                resolve(rows)
            })
        }).then((rows) => callback(rows));
    }

    getAllItems(category_id=null, callback){
      let sql = '';
      if (category_id === null) {
        sql = `SELECT * from inventory`;
      }else{
        sql = `SELECT * from inventory where inventory.category=${category_id}`;
      }
      let db = this.db;
      return new Promise(function (resolve, reject) {
            db.all(sql, (err, rows) => {
                if (err) {
                console.error(err.message);
                }
                resolve(rows)
            })
        }).then((rows) => callback(rows));
    }

    insertOrder(itemList){
      const insertOrder = `INSERT INTO saleorder (customer_name, total, timestamp) VALUES ("", ${itemList.total_price}, ${Date.now()})`;
      this.db.run(insertOrder);
      const getOrderId = `SELECT MAX(id) as max_id from saleorder`;
      this.db.all(getOrderId, (err, rows) => {
                if (err) {
                   console.error(err.message);
                }
                for (var i = 0; i < itemList.items.length; i++) {
                    let attributes = JSON.stringify(itemList.items[i].attributes)
                    const stmt = this.db.prepare(`insert into cart(price, item, order_no, quantity,attributes) values (${itemList.items[i].price}, ${itemList.items[i].item}, ${rows[0].max_id}, ${itemList.items[i].quantity}, json(?))`);
                    stmt.run(attributes);
                    stmt.finalize();
                }
      });
    }
    insertItemInInventory(item){
      let attributes = item.attributes;
      const stmt = this.db.prepare(`INSERT INTO inventory (category, image, quantity, price, item_name, attributes) VALUES (${item.category},
                   '${item.image}', ${item.quantity}, ${item.price}, '${item.item_name}', json(?))`);
      stmt.run(attributes);
      stmt.finalize();
    }
    getAllSales(callback){
      const sql = `SELECT cart.order_no, saleorder.date, saleorder.total, cart.item, cart.price, cart.attributes, cart.quantity
            FROM saleorder
            INNER JOIN cart ON saleorder.id=cart.order_no;`;
      let db_instance = this.db;
      return new Promise(function (resolve, reject) {
            db_instance.all(sql, (err, rows) => {
                if (err) {
                console.error(err.message);
                }
                resolve(rows)
            })
        }).then((rows) => callback(rows));
    }
  }

class DatabaseConnectivity {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('Connected to database')
      }
    })
  }
}

module.exports.DatabaseConnectivity = DatabaseConnectivity;
module.exports.Inventory = Inventory;
