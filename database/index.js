const mongoose= require('mongoose');
const ConnectionString = process.env.URL
async function connectToDatabase(){
   await mongoose.connect(ConnectionString)
    console.log("connected to mongodb");
}
module.exports = connectToDatabase;