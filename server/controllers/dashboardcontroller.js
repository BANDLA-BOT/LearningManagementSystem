const Student = require('../models/users/studentModel.js')
const courseModel = require('../models/course/courseModel.js')
const getProfile = async (req,res)=>{
    const id = req.user
    console.log(id)
    try {
        const student = await Student.findById({_id:id.id}).select('-password')
        const courses = await courseModel.find().limit(4)
        if(!student){
            return res.json({message:"No student found "})
        }
        if(!courses){
            return res.json({message:"No courses available currently"})
        }
        res.json({message:"Students Profile", Profile:student, courses:courses})
        console.log(student)
    } catch (error) {
        
    }
}
const enrollCourse = async(req,res)=>{
    const { courseId } = req.params
    const userId = req.user
    const course = await courseModel.findById({_id:courseId})
    const student = await Student.findById({_id:userId.id})
    try {
        if(!student){
            return res.status(400).json({message:"Student not found"})
        }
        if(!course){
            return res.status(400).json({message:"Course not found"})
        }
        student.enrolled.push(course)
        const user = await Student.findById({_id:userId.id}).populate('enrolled')
        await student.save()
        res.status(200).json({Message:"Course enrolled successfuly", Student:user})
    } catch (error) {
        res.status(500).json({message:"Internal server error", Error:error.message})
    }
}

module.exports ={ getProfile, enrollCourse }