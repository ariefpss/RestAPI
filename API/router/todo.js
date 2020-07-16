const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const chekAuth = require('../middleware/chekAuth');
const Todo = require('../model/todo');

//menambahkan TODO list
router.post('/addtask', chekAuth, (req, res, next) => {
    Todo.find()
        .exec()
        .then(() => {
            const todo = new Todo({
                _id: new mongoose.Types.ObjectId(),
                user_id: req.userData.userid,
                task: req.body.task
            });

            todo.save((err) => {
                if (err) return res.status(500).json(err);
                return res.json(todo);
            });           
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

//mengambil/menampilkan task TODO List
router.get('/swtask', chekAuth, (req, res, next) => {
    Todo.find({user_id: req.userData.userid})
        .select('_id user_id task')
        .exec()
        .then(docs => {
            const respons = {
                count: docs.length,
                todo: docs.map(doc => {
                    return{
                        _id: doc._id,
                        user_id: doc.user_id,
                        task: doc.task
                    };
                })
            };
            res.status(200).json(respons);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

//menghapus task TODO List
router.delete('/rmtask', chekAuth, (req, res, next) => {
    Todo.deleteOne({task: req.body.task})
        .exec()
        .then(() => {
            res.status(200).json({message: 'task berhasil di hapus !!'});
        })
        .catch(() => {
            res.status(500).json({error: 'task tidak ada di TODO List !!'});
        })
})

module.exports = router;