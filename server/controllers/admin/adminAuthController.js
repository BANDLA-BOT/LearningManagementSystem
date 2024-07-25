const jwt = require('jsonwebtoken');
const adminModel = require('../../models/users/adminModel.js')
const bcrypt = require('bcryptjs')
const register = async(req, res)=>{
    const {firstname, lastname, email, password} = req.body
    try {
        let user = await adminModel.findOne({email});
        if(user){
            return res.status(200).json({message:"User already exists with email ID"})
        }
        const hashedPassword = bcrypt.hashSync(password, 10)
        user = new adminModel({
            firstname,
            lastname,
            email,
            password:hashedPassword
        })
        await user.save()
        res.status(201).json({message:"Registered as admin", Admin:user})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}
const login = async(req,res)=>{
    const {email, password} = req.body
    try {
        const user = await adminModel.findOne({email})
        if(!user){
            return res.json({message:"Invalid credentials"})
        }
        const isPasswordValid = bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.json({message:"Password is incorrect"})
        }
        const token = jwt.sign({_id:user._id}, process.env.ADMIN_ACCESS_KEY, {expiresIn:"15d"})
        res.json({message:"Logged in Successfully ", user:user, token:token})
    } catch (error) {
        
    }
}
module.exports = {login, register}