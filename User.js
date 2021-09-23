const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    knowRedis: {
        type: Boolean,
        required: true
    }
});

module.exports = model('User', UserSchema);