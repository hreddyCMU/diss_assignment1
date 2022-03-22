const mysql  = require("mysql");
const express = require("express");
const app = express();



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


//=================================API end point for adding a book to books table
// app.get("/addBook",(req,res) =>{
//     let sql = 'INSERT INTO books SET ?';
//     let book = {
//         isbn: "978-0321815736",
//         title: "Software Architecture in Practice",
//         author: "Bass, L.",
//         description: "seminal book on software architecture",
//         genre: "non-fiction",
//         price: 12.90,
//         quantity: 106
//         };
//         if(! "isbn" in book || ! "title" in book || ! "author" in book || ! "description" in book || !"genre" in book || !"price" in book || !"quantity" in book){
//             res.status(err.statusCode || 500).json({
//                 statusCode: 400,
//                 message : "Missing parameters in the input"
//             });
//         }
//         else if(price in book){
//             let priceAsString = book["price"].toString().split(".");
//             if (priceAsString.length != 2 || priceAsString[1].length !=2){
//                 res.status(err.statusCode || 500).json({
//                     statusCode: 400,
//                     message : "Invalid book price"
//                 });
//             }

//         }
//         let query = db.query(sql,book, (err,res1) => {
//                 if(err) {
//                     if (err.code.localeCompare('ER_DUP_ENTRY') == 0){
//                         console.log("Entry exits");
//                         res.status(err.statusCode || 500).json({
//                                 statusCode: 422,
//                                 message : "This ISBN already exists in the system"
//                             });
//                     }
//                 }
//                 else{
//                     res.json({"success":200});
//                 }
//                 console.log(res);
//             });
// });





app.listen('3000', () => {
    console.log("Server up on port 3000");
});




