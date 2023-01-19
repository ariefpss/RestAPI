const express = require('express');
const bodyPraser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const userRouter = require('./API/router/user');

app.use(bodyPraser.urlencoded({extended: false}));
app.use(bodyPraser.json());

mongoose
    .connect('mongodb://127.0.0.1:27017/restapi',{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connect to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

mongoose.set('strictQuery', false);

app.use('/user', userRouter);

module.exports = app;