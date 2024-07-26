const mongoose = require('mongoose');

const qualificationSchema = mongoose.Schema({
    degree:[
        {
            degreeName:{
                type:String
            },
            year:{
                type:Number
            }
        }
    ],
    skills:[
        {
            skillName:{
                type:String,
                enum:['Software engineering, Full stack development, Deveps, cloud engineering, data science, ']
            }
        }
    ]
})
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
    },
    about:{
        type:String
    },
    qualification:[]
})

const instructorModel = mongoose.model('instructor', instructor)
module.exports = instructorModel