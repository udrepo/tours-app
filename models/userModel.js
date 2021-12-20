const mongoose = require('mongoose');
const validator = require("validator");


const userSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: [true, "Enter a user name"]
    },
    email:{
        type: 'string',
        required: [true, "Enter a email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: {
        type: 'string'
    },
    password: {
        type: 'string',
        required: [true, "Enter a password"],
        minLength: 8
    },
    passwordConfirm: {
        type: 'string',
        required: [true, "Please confirm your password"]
    },
})

const User = mongoose.model('User', userSchema);

module.exports = User;