require('dotenv').config();// to use .env...secure garxa
const express = require('express');
const connectToDatabase = require('./database');
const Book = require('./model/bookModel');
const fs = require ('fs'); // file system module to handle file operations
const { multer, storage } = require('./middleware/multerConfig');
const upload = multer({ storage: storage }); // multer lai storage ko barema janakari dinu parcha

const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*'
})); // to allow cross-origin requests
app.use(express.json()); 
 const mongoose= require('mongoose');
// const ConnectionString = "mongodb+srv://bipanasharma28:1234@cluster0.etku8k1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// //app.listen(portnumber,callback)

app.use(express.json())//express le json handle garna sakdaina....so this function is for it to use json and understand

connectToDatabase();
//app.get("/path",(request,respond))
app.get("/", (req,res) => { //abc= request, add= respond
    res.send('Hello World');
})

app.post("/book",upload.single('imageUrl'), async(req,res) =>{// pahila call ani middle ware ko kam
   // console.log(req.body);
   let fileName;
   if(!req.file) {
    fileName ="1753266667770-rose.jpg"   }
   else{
    fileName ="http://localhost:3000/" + req.file.filename;
   }

   const{ bookName, bookPrice, isbnNumber, authorName, publishedAt, publication, description} = req.body
   await Book.create({
bookName,
bookPrice,
isbnNumber,
authorName,
publishedAt,
publication,
description,
imageUrl:fileName

  })
  res.status(201).json({//respond back to client
    message: "Book Create Sucessfully"
  })  
    
})
// all read
app.get("/book", async (req, res) => {
    const books = await Book.find() // return array ma garxa 
    res.status(200).json({
        message: "Books fetched successfully",
        data: books
    })
})  

// single read
app.get("/book/:id", async (req, res) => {
    const id = req.params.id
    const book = await Book.findById(id) // return object garxa

    if (!book) {
        res.status(404).json({
            message: "Nothing found"
        })
    } else {
        res.status(200).json({
            message: "Single Book Fetched Successfully",
            data: book
        })
    }
})

// delete operation  
app.delete("/book/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        // Delete image file only if it's stored locally (not external link)
        if (book.imageUrl && book.imageUrl.startsWith("http://localhost:3000/")) {
            const localHostUrlLength = "http://localhost:3000/".length;
            const imagePath = book.imageUrl.slice(localHostUrlLength);

            fs.unlink(`storage/${imagePath}`, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                } else {
                    console.log("Image file deleted successfully");
                }
            });
        }

        // Delete book from DB
        await Book.findByIdAndDelete(id);

        res.status(200).json({
            message: "Book Deleted Successfully",
        });

    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});

// update operation 
app.patch("/book/:id", upload.single('imageUrl'), async (req, res) => {// Patch is used for update operation
    // patch le kunai pani field update garna sakxa

    const id = req.params.id // kun book update garney id ho yo
    const { bookName, bookPrice, authorName, publishedAt, publication, isbnNumber, description } = req.body
    const oldDatas = await Book.findById(id)// old file lai upload garna
    let fileName;
    if (req.file)
    {
        const oldImagePath = oldDatas.imageUrl; // purano file ko naam
console.log(oldImagePath);
     const localHostUrlLength = "http://localhost:3000/".length; 
     const newOldImagePath = oldImagePath.slice(localHostUrlLength)

     fs.unlink('storage/${newOldImagePath}',(err) =>
     {
if (err) {
console.log(err)
}
else {
    console.log("file delete successfully")
}
     })
    fileName="http://localhost:3000/" + req.file.fileName
}
    await Book.findByIdAndUpdate(id, {
        bookName: bookName,
        bookPrice: bookPrice,
        authorName: authorName,
        publication: publication,
        publishedAt: publishedAt,
        isbnNumber: isbnNumber,
        description: description
    })
    res.status(200).json({ // res.status(200) le 200 ko status code return garxa
        message: "Book Updated Successfully"
    })
})

app.use(express.static("./storage/"))
app.listen(3000, () => {//yo last ma rakhni......process.env.PORT(write this in 3000)
console.log('Nodejs is running on port 3000');
})