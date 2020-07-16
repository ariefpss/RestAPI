const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    task: String ,
    user_id: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Todo', todoSchema);