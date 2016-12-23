var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});
var bamazon = {
    questions: [{
        type: 'input',
        name: 'id',
        message: "Type the item number of the product you would like to buy:",
    }, {
        type: 'input',
        name: 'quantity',
        message: "Type the quantity of the item you would like to buy:",
    }],
    getInventory: function() {
        connection.query("SELECT * FROM products", function(error, results) {

            if (error) throw err;
            for (var i = 0; i < results.length; i++) {
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
                console.log("Item: " + results[i].id + " | Name: " + results[i].product_name + " | Department: " + results[i].department_name + " | Price: " + results[i].price + " | Quantity left: " + results[i].quantity);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            };
            bamazon.sellProducts();
        });
    },

    sellProducts: function() {
        inquirer.prompt(bamazon.questions).then(function(answers) {
            var id = answers.id;
            var quantity = answers.quantity;
            bamazon.buyProduct(id, quantity);
        });
    },

    buyProduct: function(id, quantity) {
        var stock;
        var totalPrice;

        connection.query("SELECT * FROM products WHERE ID = ?", [id], function(err, results) {
            if (err) throw err;
            stock = results[0].quantity;
            item = results[0].product_name;
            price = results[0].price;

            if (quantity <= stock) {
                stock -= quantity;
                price *= quantity;

                connection.query("UPDATE products SET ? WHERE ?", [{
                        quantity: stock
                    }, {
                        id: id
                    }],
                    function(err, results) {
                        console.log("~~~~~~Receipt~~~~~~")
                        console.log("Product: " + item + " | Amount purchased: " + quantity + " | Total Price: " + "$" + price);
                        bamazon.getInventory();
                    });
            } else {
                console.log("Sorry, we do not have that amount in stock.")
                bamazon.getInventory();
            }
        });
    },
};
bamazon.getInventory();
