const mongoose = require('mongoose');

const instructor = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    profilePic:{
        type:String
    }
})

const instructorModel = mongoose.model('instructor', instructor)
module.exports = instructorModel