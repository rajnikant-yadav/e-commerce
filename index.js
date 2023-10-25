require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')

const connectDB = require('./db/connect')
const cors = require('cors');
const app = express();
const mongoUrl= process.env.MONGO_URI || "mongodb://127.0.0.1:27017/E-Commerce-Server"
connectDB(mongoUrl)
//standard middleware to take input from the client side
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



const port = process.env.PORT || 5001

// const start = async () =>{
//     try {
//         // await connectDB(mongoUrl)
//         app.listen(port,()=>console.log(`Server is listening on port ${port}...`))
//     } catch (error) {
//         console.log(error);
//     }
// }

// start();

app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`)
})