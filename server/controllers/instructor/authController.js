const Instructor = require('../../models/users/instructorModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerController = async(req,res)=>{
    try {
    const { firstname, lastname, email, password } = req.body
    const imgPath = `${req.file.destination}/${req.file.filename}`
    const instructor = await Instructor.findOne({email:email})
    if(instructor){
        return res.status(400).json ({message:"User already exist with same Email ID"})
    }
    const hashedPassword = bcrypt.hashSync(password, 10)
    const newInstructor = new Instructor({
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:hashedPassword,
        profilePic:imgPath
    })
    await newInstructor.save()
    res.status(201).json({message:"Registered successfully"})
    } catch (error) {
    res.status(500).json({message:"Internal server error", Error:error.message})
    }
}

const loginController = async(req,res)=>{
    try {
        const {email, password} = req.body
        const instructor = await Instructor.findOne({email:email})
        if(!instructor){
            return res.status(404).json({message:"User not found on this email"})
        }
        isPasswordValid = bcrypt.compareSync(password, instructor.password)
        if(!isPasswordValid){
            return res.status(400).json({message:"Incorrect password"})
        }
        const token = jwt.sign({id:instructor._id}, process.env.JWT_SECRET_KEY_INSTRUCTOR, {expiresIn:'15d'})
        res.status(201).json({
            message:"Logged in successfully",
            User:instructor,
            Token:token,
            login:true
        })
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}
module.exports = {
    registerController,
    loginController
}