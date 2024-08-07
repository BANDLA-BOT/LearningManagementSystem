const Instructor = require('../../models/users/instructorModel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const registerController = async(req,res)=>{
    try {
    const { firstname, lastname, email, password } = req.body
  
    if (!req.file) {
        return res.status(400).json({ message: "Profile picture is required" });
    }
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
const instructorPasswordResetLink = async(req,res)=>{
    try {
        const {email} = req.body
        const instructor = await Instructor.findOne({email})
        if(!student){
            return res.status(404).json({Message:"User not found"})
        }
        const resetToken = jwt.sign({id:instructor._id}, process.env.JWT_INSTRUCTOR_PASSWORD_RESET_KEY, {expiresIn:'10m'})
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
            subject:'Password reset link',
            text:`Please use the following link to reset your password: http://localhost:8000/api/instructor/auth/reset-password/${resetToken}`
        }
        transporter.sendEmail(mailOptions   , (error, info)=>{
            if(error){
                return res.status(500).send('Error while sending email')
            }
            res.send('Password reset email sent');

        })
    } catch (error) {
        res.status(500).json({Message:"Internal server error", Error:error.message})
    }
}
const instructorResetPassword = async(req,res)=>{
    try {
        const {token} = req.params
        const { newPassword } = req.body
        const decoded = jwt.verify(token, process.env.JWT_INSTRUCTOR_PASSWORD_RESET_KEY)
        const userId = decoded.id
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await Instructor.findByIdAndUpdate(userId, {password:hashedPassword})
        res.json({Message:"Password updated successfully"})
    } catch (error) {
        res.status(500).json({Message:"Internal server error", error:error.message})
    }
}
module.exports = {
    registerController,
    loginController,
    instructorPasswordResetLink,
    instructorResetPassword
}