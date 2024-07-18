const studentModel = require("../models/users/studentModel")

const sendOTP = async(req,res,next)=>{
    try {
        const {email} = req.body
        
        const student = await studentModel.find({email})
        if(!student){
            return res.status(404).json({message:"No user found with this email ID"})
        }
        else{
            let otp = ''
            let numbers = '1234567890'
            let len = numbers.length
            for(let i=0; i<6; i++){
                otp += numbers[Math.floor(Math.random()*len)]
            }
            req.otp = otp
            next()
        }
    } catch (error) {
        res.status(500).json({message:"Internal server error", Error:error.message})
    }
}

module.exports = {sendOTP, verifyOTP}