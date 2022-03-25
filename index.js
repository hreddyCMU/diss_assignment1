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
app.post("/addBook",(req,res) =>{
    console.log(req.body.body);
    let body = req.body.body;
    let sql = 'INSERT INTO books SET ?';
    let book = {
        isbn: body.isbn,
        title: body.title,
        author: body.author,
        description: body.description,
        genre: body.genre,
        price: body.price,
        quantity: body.quantity
        };
        if(! ("isbn" in book) || ! ("title" in book) || ! ("author" in book) || ! ("description" in book) || !("genre" in book) || !("price" in book) || !("quantity" in book)){
            res.status(400).json({
                statusCode: 400,
                message : "Missing parameters in the input"
            });
        }
        else if("price" in book){
            let priceAsString = book["price"].toString().split(".");
            console.log(book,body);
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
                        res.status(200).json({...book, "success":200});
                    }
                });
            }

        }
});


//=================================API end point for updating a book to books table===========================
app.put('/books/isbn/:isbn',(req,res) =>{
    let sql = `SELECT * FROM books WHERE isbn = '${req.params.isbn}'`;
    let body = req.body.body;
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
                    isbn: body.ISBN,
                    title: body.title,
                    author: body.author,
                    description: body.description,
                    genre: body.genre,
                    price: body.price,
                    quantity: body.quantity
                    };
                    if(! ("title" in book) || ! ("author" in book) || ! ("description" in book) || !("genre" in book) || !("price" in book) || !("quantity" in book)){
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
                            console.log(priceAsString.length, priceAsString[1].length,priceAsString);
                        
                        }
            
                        else{
                            let fsql = `UPDATE books SET title = '${body.title}', author = '${body.author}', description = '${body.description}', genre = '${body.genre}', price = '${body.price}', quantity = '${body.quantity}' where isbn = '${req.params.isbn}'`;

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



app.post("/customers",(req,res) =>{
    console.log(req.body.body);
    let body = req.body.body;
    let sql = 'INSERT INTO customers SET ?';
    let book = {
        userid: body.userId,
        name: body.name,
        phone: body.phone,
        address: body.address,
        address2: body.address2,
        city: body.city,
        state: body.state,
        zipcode: body.zipcode
        };
        let sql2 = `SELECT * FROM customers WHERE userId = '${req.body.body.userId}'`;
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

                if(! ("userId" in req.body.body) || ! ("name" in req.body.body) || ! ("phone" in req.body.body) || ! ("address" in req.body.body) || !("address2" in req.body.body) || !("city" in req.body.body) || !("state" in req.body.body) || !("zipcode" in req.body.body)){
                    res.status(400).json({
                        statusCode: 400,
                        message : "Missing parameters in the input"
                    });
                }
        
                    else{
                        let query = db.query(sql,req.body.body, (err,res1) => {
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
                                res.status(200).json({...req.body.body, "success":200});
                            }
                        });
                    }

            }
            
        }
    });
});

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




