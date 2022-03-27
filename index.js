const mysql  = require("mysql");
const express = require("express");
const app = express();

let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: "database1.cpdmkc3lyqh2.us-east-1.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "admin123",
    database: "myfirstdb"
});

db.connect((err) => {
    if(err){
        console.log(err);
        return;
    }
    console.log("Database connected");
});

app.get('/',(req,res) =>  res.send("helo hari!"));

// let sql = 'CREATE TABLE dummy(id int AUTO_INCREMENT, title VARCHAR(255), PRIMARY KEY (id))';
// db.query(sql,(err,result) => {
//     if(err) throw err;
//     console.log(result);
// });

// let post = {title : "Title1 ahriiii"};
// let sql2 = 'INSERT INTO dummy SET ?';
// let query = db.query(sql2,post, (err,res) => {
//     if(err) throw err;
//     console.log(res);
// });

// let sql3 = 'SELECT * FROM dummy';
// let query2 = db.query(sql3, (err,res) => {
//     if(err) throw err;
//     console.log(res);
// });


//===========================Create books table
// app.get("/createBooksTable",(req,res) =>{
//     let sql = 'CREATE TABLE books(isbn VARCHAR(255), title VARCHAR(255),author VARCHAR(255),description VARCHAR(255),genre VARCHAR(255),price FLOAT(8),quantity int, PRIMARY KEY (isbn))';
//     db.query(sql,(err,result) => {
//             if(err) throw err;
//             console.log(result);
//         });
//     res.send("Table creation done!");
// });

//===========================Create customer table
// app.get("/createCustomerTable",(req,res) =>{
//     let sql = 'CREATE TABLE customers(id int AUTO_INCREMENT,userId VARCHAR(255), name VARCHAR(255),phone VARCHAR(255),address VARCHAR(255),address2 VARCHAR(255),city VARCHAR(255),state VARCHAR(255), zipcode VARCHAR(255), PRIMARY KEY (id))';
//     db.query(sql,(err,result) => {
//             if(err) throw err;
//             console.log(result);
//         });
//     res.send("Table creation done!");
// });


//=================================API end point for adding a book to books table===========================
app.post("/books",(req,res) =>{
    let body = req.body;
    let sql = 'INSERT INTO books SET ?';
    let book = {
        isbn: req.body.ISBN,
        title: req.body.title,
        author: req.body.Author,
        description: req.body.description,
        genre: req.body.genre,
        price: req.body.price,
        quantity: req.body.quantity
        };
        if(! ("ISBN" in req.body) || ! ("title" in req.body) || ! ("Author" in req.body) || ! ("description" in req.body) || !("genre" in req.body) || !("price" in req.body) || !("quantity" in req.body)){
            res.status(400).json({
                statusCode: 400,
                message : "Missing parameters in the input"
            });
        }
        else if("price" in book){
            let priceAsString = req.body["price"].toString().split(".");
            if (priceAsString.length != 2 || ! (priceAsString[1].length ==2 || priceAsString[1].length ==1 || priceAsString[1].length ==0)  ){
                res.status(400).json({
                    statusCode: 400,
                    message : "Invalid book price"
                });
                console.log(priceAsString.length, priceAsString[1].length,priceAsString);
            
            }

            else{
                let query = db.query(sql,book, (err,res1) => {
                    if(err) {
                        if (err.code.localeCompare('ER_DUP_ENTRY') == 0){
                            console.log("Entry exits");
                            res.status(422).json({
                                    statusCode: 422,
                                    message : "This ISBN already exists in the system"
                                });
                        }
                    }
                    else{
                        res.status(200).json({...req.body, "success":200});
                    }
                });
            }

        }
});


//=================================API end point for updating a book to books table===========================
app.put('/books/:isbn',(req,res) =>{
    let sql = `SELECT * FROM books WHERE isbn = '${req.params.isbn}'`;
    let body = req.body;
    let query = db.query(sql, (err,result) => {
        if(err) {
            res.status(500).json({
                statusCode: 500,
                message : "Server error. Try again!"
            });
        }
        else{
            if(result.length == 0){
                res.status(404).json({
                    statusCode: 404,
                    message : "ISBN not found"
                });
            }
            else{
                let book = {
                    isbn: req.body.ISBN,
                    title: req.body.title,
                    author: req.body.author,
                    description: req.body.description,
                    genre: req.body.genre,
                    price: req.body.price,
                    quantity: req.body.quantity
                    };
                    if(! ("title" in req.body) || ! ("Author" in req.body) || ! ("description" in req.body) || !("genre" in req.body) || !("price" in req.body) || !("quantity" in req.body)){
                        res.status(400).json({
                            statusCode: 400,
                            message : "Missing parameters in the input"
                        });
                    }
                    else if("price" in book){
                        let priceAsString = book["price"].toString().split(".");
                        if (priceAsString.length != 2 || ! (priceAsString[1].length ==2 || priceAsString[1].length ==1 || priceAsString[1].length ==0)  ){
                            res.status(400).json({
                                statusCode: 400,
                                message : "Invalid book price"
                            });
                        
                        }
            
                        else{
                            let fsql = `UPDATE books SET title = '${req.body.title}', author = '${req.body.Author}', description = '${req.body.description}', genre = '${req.body.genre}', price = '${req.body.price}', quantity = '${req.body.quantity}' where isbn = '${req.params.isbn}'`;

                            let query = db.query(fsql,(err,res1) => {
                                if(err) {
                                        console.log(err.message);
                                        res.status(500).json({
                                                statusCode: 500,
                                                message : "Server error. Try again!"
                                            });
                                }
                                else{
                                    res.status(200).json({...book, "success":200});
                                }
                            });
                        }
            
                    }
            }
        }
    });
});

//=================================API end point for retrieving a book from books table===========================
app.get('/books/isbn/:isbn',(req,res) =>{
    let sql = `SELECT * FROM books WHERE isbn = '${req.params.isbn}'`;
    let query = db.query(sql, (err,result) => {
        if(err) throw err;
        else{
            if(result.length == 0){
                res.status(404).json({
                    statusCode: 404,
                    message : "ISBN not found"
                });
            }
            else{
                res.status(200).json({
                    statusCode: 200,
                    message : result[0]
                });
            }
        }
    });
});

//=================================API end point for retrieving a book from books table===========================

app.get('/books/:isbn',(req,res) =>{
    let sql = `SELECT * FROM books WHERE isbn = '${req.params.isbn}'`;
    let query = db.query(sql, (err,result) => {
        if(err) throw err;
        else{
            if(result.length == 0){
                res.status(404).json({
                    statusCode: 404,
                    message : "ISBN not found"
                });
            }
            else{
                res.status(200).json({
                    statusCode: 200,
                    message : result[0]
                });
            }
        }
    });
});

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  
const states = ["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FM","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MH","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP","OH","OK","OR","PW","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY"];

//=================================API end point for adding a customer to customer table===========================
app.post("/customers",(req,res) =>{
    console.log("in customers");
    console.log(req.body);
    let body = req.body;
    let sql = 'INSERT INTO customers SET ?';
    let book = {
        userid: req.body.userId,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode
        };
        let sql2 = `SELECT * FROM customers WHERE userId = '${req.body.userId}'`;
        console.log(sql2)
    let query = db.query(sql2, (err,result) => {
        if(err){
            res.status(400).json({
                statusCode: 404,
                message : "Illegal, missing or malformed input"
            });
        }
        else{
            if(result.length != 0){
                res.status(422).json({
                    statusCode: 422,
                    message : "This user ID already exists in the system"
                });
            }
            else{

                if(! ("userId" in req.body) || ! ("name" in req.body) || ! ("phone" in req.body) || ! ("address" in req.body) || !("city" in req.body) || !("state" in req.body) || !("zipcode" in req.body)){
                    res.status(400).json({
                        statusCode: 400,
                        message : "Missing parameters in the input"
                    });
                }
                else if(! validateEmail(req.body.userId) || req.body.state.length != 2 || states.indexOf(req.body.state) == -1){
                    res.status(400).json({
                        statusCode: 400,
                        message : "Invalid state or userid, please check them!"
                    });
                }
        
                    else{
                        if (! ("phone" in req.body)){
                            req.body = {...req.body, "address2" : ""};
                        }
                        let query = db.query(sql,req.body, (err,res1) => {
                            if(err) {
                                if (err.code.localeCompare('ER_DUP_ENTRY') == 0){
                                    console.log("Entry exits");
                                    res.status(422).json({
                                            statusCode: 422,
                                            message : "This user ID already exists in the system"
                                        });
                                }
                            }
                            else{
                                res.status(200).json({...req.body, "success":200});
                            }
                        });
                    }

            }
            
        }
    });
});

//=================================API end point for retrieving a customer from customer table based on id===========================
app.get('/customers/:id',(req,res) =>{
    let sql = `SELECT * FROM customers WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err,result) => {
        if(err){
            res.status(400).json({
                statusCode: 404,
                message : "Illegal, missing or malformed input"
            });
        }
        else{
            if(result.length == 0){
                res.status(404).json({
                    statusCode: 404,
                    message : "Customer not found"
                });
            }
            else{
                res.status(200).json({
                    statusCode: 200,
                    message : result[0]
                });
            }
        }
    });
});


//=================================API end point for retrieving a customer from customer table based on userid===========================
app.get('/customers',(req,res) =>{
    let sql = `SELECT * FROM customers WHERE userId = '${req.query.userId}'`;
    let query = db.query(sql, (err,result) => {
        if(err){
            console.log("err",err);
            res.status(400).json({
                statusCode: 404,
                message : "Illegal, missing or malformed input"
            });
        }
        else{
            if(result.length == 0){
                res.status(404).json({
                    statusCode: 404,
                    message : "Customer not found"
                });
            }
            else{
                res.status(200).json({
                    statusCode: 200,
                    message : result[0]
                });
            }
        }
    });
});


app.get('/customerall',(req,res) =>{
    let sql = `SELECT * FROM customers `;
    console.log(sql);
    let query = db.query(sql, (err,result) => {
        if(err){
            console.log("err",err);
            res.status(400).json({
                statusCode: 404,
                message : "Illegal, missing or malformed input"
            });
        }
        else{
            if(result.length == 0){
                res.status(404).json({
                    statusCode: 404,
                    message : "Customer not found"
                });
            }
            else{
                res.status(200).json({
                    statusCode: 200,
                    message : result
                });
            }
        }
    });
});



app.listen('3000', () => {
    console.log("Server up on port 3000");
});




