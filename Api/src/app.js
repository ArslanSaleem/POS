const express = require("express");
let fs = require("fs");
let path = require('path');
let cors = require('cors');
const {DatabaseConnectivity, Inventory} = require('./database_schema');
let bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const formidable = require('formidable');

let db = new DatabaseConnectivity('../pos.db');
let inventory = new Inventory(db.db);
inventory.createSchema();

const app = express();
app.use(cors());
app.use(bodyParser.json());
//app.use(formidable());

const imageRootPath = path.join(__dirname, "../public/images");
let imageIndx = 0;
fs.readdir(imageRootPath, (err, files) => {
  imageIndx = files.length
});

// get all todos
app.get('/pos/inventory/get', (req, res) => {
  let category = "category" in req.query? req.query["category"] : null
  inventory.getAllItems(category, function(rows) {

      let items = {};
      for (const row of rows){
        if (!(row.category in items)){
           items[row.category] = []
        }
        items[row.category].push(row)
      }
      res.status(200).send({
        success: 'true',
        message: 'inventory data',
        data:items
    })
  });
});

app.post('/pos/category/add', (req, res) => {
  let formFields = {};
  var form = new formidable.IncomingForm();
  form.on('field', function (name, fields){
      formFields[name] = fields;
    });
    form.on('end', function() {
      inventory.addCategory(formFields);
      res.status(200).send({
                success: 'true',
                message: 'add successfully'
      });
  });
   form.parse(req);

});

app.post('/pos/order/place', (req, res) => {
  inventory.insertOrder(req.body);
  res.status(200).send({
        success: 'true',
        message: 'Order Placed'
  });
});

app.get('/pos/categories/get', (req, res) => {
  inventory.getAllCategories(function(categories) {
      res.status(200).send({
        success: 'true',
        message: 'Category Data',
        data: categories
    });
  });
});

app.get('/pos/sales/get', (req, res) => {
  inventory.getAllSales(function(sales) {
      res.status(200).send({
        success: 'true',
        message: 'Sales Data',
        data: sales
    });
  });
});

app.get("/getImage", (req, res) => {
  let image = req.query.image;
  res.sendFile(path.join(imageRootPath, image));
});

app.post('/pos/inventory/add', async function(req, res) {

   let formFields = {};
   var form = new formidable.IncomingForm();
   // specify that we want to allow the user to upload multiple files in a single request
   form.multiples = false;

    // store all uploads in the /uploads directory
    form.uploadDir = imageRootPath;

   // every time a file has been uploaded successfully,
   // rename it to it's orignal name
    form.on('file', function(field, file) {
        let splitFileName = file.name.split('.');
        let extension = "." + splitFileName[splitFileName.length-1];
        let filePath = path.join(imageRootPath, "image_"+imageIndx + extension);
        fs.rename(file.path, filePath, function(err){
          if (err) throw err;
          let fileHostURL = "http://127.0.0.1:8080/getImage?image="+ "image_"+imageIndx + extension;
          let formData = formFields;
          formData.image = fileHostURL;
          inventory.insertItemInInventory(formData);
          imageIndx += 1
        });
   });
    form.on('field', function (name, fields){
      formFields[name] = fields;
    });
    form.on('end', function() {
      res.status(200).send({
                success: 'true',
                message: 'add successfully'
      });
  });
   form.parse(req);
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
