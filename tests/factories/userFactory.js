const mongoose = require('mongoose');
const User = new mongoose.model('User')
//setup.js is necessary because test will run sepearately.That's why it has no connection with server files,So we have to connect with mongoose again in test file.
module.exports = ()=>{
    return new User({}).save();
}