const express = require('express');
const bodyPraser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const userRouter = require('./API/router/user');

app.use(bodyPraser.urlencoded({extended: false}));
app.use(bodyPraser.json());

mongoose.connect(
    'mongodb://localhost:27017/restapi',
    {useNewUrlParser: true, useCreateIndex: true},
    ()=>{
        console.log("berhasil connect database");
    }
);

app.use('/user', userRouter);

module.exports = app;