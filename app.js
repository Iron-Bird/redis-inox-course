const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./userRoute')

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', userRouter);

_mongo_connection();

function _mongo_connection() {
    mongoose.connect('mongodb://localhost:27017/redis');
    mongoose.connection.on('error', () => console.log('Error with DB!!!'))
}

app.listen(5000, () => {
    console.log('App is running on port 5000')
});