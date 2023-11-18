require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const connectDB = require('./db/connect')
const usersApiRouter = require('./routes/users.routes')
const productsApiRouter = require('./routes/products.routes')
const notFound = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler');
const cors = require('cors');
const app = express();
const mongoUrl= process.env.MONGO_URI || "mongodb://127.0.0.1:27017/E-Commerce-Server"
const port = process.env.PORT || 5001

// Connecting MongoDb
connectDB(mongoUrl)

//standard middleware to take input from the client side
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello Test');
});

app.use('/api/auth',usersApiRouter);
app.use('/api/product',productsApiRouter);

//error handing middlewares
app.use(notFound);//custom 404 page (middleware)
app.use(errorHandlerMiddleware);//custom error handler for handling all the errors


app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`)
})