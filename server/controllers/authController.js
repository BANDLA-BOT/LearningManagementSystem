const Student = require('../models/users/studentModel.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//Register Controller

const register = async(req,res)=>{
    try {
         const { email, firstname, lastname,password} = req.body
          const user = await Student.findOne({email:email})
          if(user){
             return res.json({message:"User already exists with the email ID"})
          }
        const newUser = new Student({
            email,
            firstname,
            lastname,
            password,
        })
        await newUser.save()
        res.status(201).json({Message:"Student registered successfully", Student:newUser})
     } catch (error) {
        res.status(500).json({Message:"Internal server error", Error:error.message})
     }
}

//Login Controller

const login = async(req,res)=>{
    try {
        const {email, password} = req.body;
        const existUser = await Student.findOne({email:email, password:password})
        if(!existUser){
            return res.json({message:"User doesn't exists"})
        }
        const token = jwt.sign({id:existUser._id}, process.env.JWT_SECRET_KEY, {expiresIn:'15d'})
        res.status(200).json({message:"Student logged in successfully", student:existUser, Token:token})
    } catch (error) {
        res.status(500).json({Message:"Internal server error", Error:error.message})
    }
}

module.exports = {
    register,
    login
}