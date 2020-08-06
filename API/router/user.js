const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const chekAuth = require('../middleware/chekAuth');
const User = require('../model/user');
const { restart } = require('nodemon');


// CREATE
router.post('/signup', (req, res, _next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1){
                return res.status(409).json({
                    message: 'email telah ada!!'
                });
            }else{
                const passwordHash = bcrypt.hashSync(req.body.password, 10);
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: passwordHash
                });
                
                user.save((err) => {
                    if (err) return res.status(500).json(err);
                    return res.json(user);
                });
            }
        });
});

// READ
router.get('/', (req, res, next) => {
    User.find()
        .select('_id email password')
        .exec()
        .then(docs => {
            const respons = {
                count: docs.length,
                user: docs.map(doc => {
                    return{
                        _id: doc._id,
                        email: doc.email,
                        password: doc.password
                    };
                })
            };
            console.log(docs);
            res.status(200).json(respons);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// UPDATE
router.put('/update/:userid', chekAuth, (req, res, _next) => {
    User.findByIdAndUpdate({_id: req.params.userid}, {$set:{email: req.body.email}})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'data user berhasil di update'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
});

// DELETE
router.delete('/delete/:userid', chekAuth, (req, res, _next) => {
    User.findByIdAndRemove({_id: req.params.userid})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'user berhasil dihapus'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// login user
router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1){
                return res.status(401).json({
                    message: 'login gagal'
                });
            };
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({message: 'login gagal'});
                }
                
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userid: user[0]._id
                    },
                    process.env.JWT_KEY, {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: 'login berhasil',
                        token: token
                    });
                }
                
                return res.status(401).json({message: 'login gagal'})
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

module.exports = router;