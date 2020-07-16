const express = require('express');
const bodyPraser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const userRouter = require('./API/router/user');
const todoRouter = require('./API/router/todo');

app.use(bodyPraser.urlencoded({extended: false}));
app.use(bodyPraser.json());

mongoose.connect(
    'mongodb://localhost:27017/admin',
    {useNewUrlParser: true, useCreateIndex: true},
    ()=>{
        console.log("berhasil connect database");
    }
);

app.use('/user', userRouter);
app.use('/todo', todoRouter);

module.exports = app;