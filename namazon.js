var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "", //Your password
    database: "bamazon"
})

var options = [];
var availability = [];
var product = "";
var amount = 0;
var price = [];


connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    preload();
})


var preload = function() {

connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    for (var i = 0;i < res.length; i++) {
      var title = "";
      title += res[i].product_name;
      options.push(title);
      availability.push(res[i].quantity);
      price.push(parseFloat(res[i].price));
    }
    startProcess();
});

}


var startProcess = function() {
  inquirer.prompt({

    /* Pass your questions in here */
    name: "product",
    type: "rawlist",
    message: "Please choose the ID of the product you would like to purchase.",
    choices: options

  }).then(function(answer) {
      // Use user feedback for... whatever!!
      product += answer.product;
      sellProcess();
  });
}

var sellProcess = function() {
    inquirer.prompt({
      name: "quantity",
      type: "input",
      message: "Great choice! How many would you like to buy?"
    }).then(function(answer) {
      amount = answer.quantity;
      orderProcess();
    });
}

var orderProcess = function() {



  var stockNumber = options.indexOf(product);
  var inStock = availability[stockNumber];

  if (amount > inStock) {
    console.log("Insufficient quantity! Starting new order process");
    options = [];
    product = "";
    amount = 0;
    availability = [];
    price = [];
    preload();
  } else {
    var newStock = inStock-amount;
    console.log("Your order total is: " + parseFloat(amount * price[stockNumber]));
    var query = 'UPDATE products SET quantity=? WHERE product_name=?';
    connection.query(query, [newStock, product], function(err, res) {
      options = [];
      product = "";
      amount = 0;
      availability = [];
      price = [];
      preload();
    });
  }
}
