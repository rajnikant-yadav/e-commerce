const mongoose = require('mongoose');

// const connectDB = (url) =>{
//     return mongoose.connect(url);
// }

// module.exports = connectDB;


const connectDB= async (databaseUrl)=>{
    try{
// const DB_Option={
//     dbName: "todo",
//      }
await mongoose.connect(databaseUrl)
console.log("Mongodb Connected Successfully..");
    } catch(err){
        console.log(err)
    }
}
module.exports=connectDB