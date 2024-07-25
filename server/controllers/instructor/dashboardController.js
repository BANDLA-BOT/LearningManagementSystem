const Instructor = require('../../models/users/instructorModel.js')
const CourseModel = require('../../models/course/courseModel.js')
const bcrypt = require('bcryptjs')

const mentorsController = async(req,res)=>{
    try {
        const userId = req.user.id
        const mentors = await Instructor.find()
        const courses = await CourseModel.find()
        const details = courses.map((item)=>{
            if(item.price){
                return [item.title,item.description, item.price]
            }
            if(item.price <=0 ){
                return [item.title,item.description, 'FREE']
            }
        })
        let profile = {}
        mentors.map((item)=>{
            if(item._id.toString()=== userId){
                profile = item
            }
        })
        res.status(200).json({message:"Data found", mentors:mentors, profile:profile, CoursesList:details})
    } catch (error) {
        res.status(500).json({message:"Internal server error", Error:error.message})
    }
}
const editInstructorProfile = async(req,res)=>{
    try {
        const userId = req.user.id
        const { firstname, lastname, about} = req.body
        const filePath = `${req.file.destination}/${req.file.filename}`
        const user = await Instructor.findOne({_id:userId})
        user.about= about
        user.firstname = firstname
        user.lastname = lastname
        user.profilePic = filePath
        await user.save()
        res.json (user)
    } catch (error) {
        res.status(500).json({message:"Internal server error", Error:error.message})
    }
}
const editPassword = async(req,res)=>{
    try {
        const userId = req.user.id
        const { currentPassword, newPassword, confirmPassword } =req.body
        const user = await Instructor.findById(userId)
        const comparePassword = bcrypt.compareSync(currentPassword, user.password)
        if(!comparePassword){
            return res.status(400).json({message:"Incorrect current password"})
        }
        if(currentPassword === newPassword){
            return res.status(400).json({message:"New password should be different than old password"})
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({message:"Passwords did not match"})
        }
        const hashedPassword = bcrypt.hashSync(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        res.status(200).json({message:"Password changed successfully", User:user})
    } catch (error) {
        
    }
}

module.exports = {mentorsController, editInstructorProfile, editPassword}