const jwt = require('jsonwebtoken');
const adminModel = require('../../models/users/adminModel.js')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')



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
const sendOTP = async (req,res)=>{
    try {
        const { email } = req.body
        const admin = await adminModel.findOne({email})
        if(!admin){
            return res.json({Message:"No user exists with this email ID"}).status(404)
        }
        const resetToken = jwt.sign({id:admin._id}, process.env.ADMIN_PASSWORD_RESET_KEY, {expiresIn:'10m'})
        const transporter = nodemailer.createTestAccount({
            service:'gmail',
            auth:{
                 user:process.env.EMAIL_USER,
                 pass:process.env.EMAIL_PASS
                },
            secure:true,
        })
        const mailOptions = {
            from:process.env.EMAIL_USER,
            to:email,
            subject:"Password reset link",
            text:`Please use the following link to reset your password: http://localhost:8000/api/admin/auth/reset-password/${resetToken}`
        }
        transporter.sendEmail(mailOptions, (error, info)=>{
            if(error){
                return res.json ({Message:"Error while sending email"})
            }
            res.send('Password reset email sent to your email')
        })

    } catch (error) {
        res.status(500).json({Message:"Internal server error", error:error.message})
    }
}
const verifyAndUpdate = async(req,res)=>{
    try {
        const {token} = req.params
        const { newPassword } = req.body
        const decoded = jwt.verify(token, process.env.ADMIN_PASSWORD_RESET_KEY)
        const userId = decoded.id
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await adminModel.findByIdAndUpdate(userId, {password:hashedPassword})
        res.json({Message:"Password updated successfully"})
    } catch (error) {
        res.status(500).json({Message:"Internal server error", error:error.message})
    }
}
module.exports = {login, register, verifyAndUpdate, sendOTP}