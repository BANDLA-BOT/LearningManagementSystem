const courseModel = require('./../../models/course/courseModel.js');


const questionsController = async(req,res)=>{
    try {
        const courses = await courseModel.find()
        const course = courses.map(item => item)
        console.log(course)

    } catch (error) {
        res.status(500).json({message:"Internal server error", Error:error})
    }
}

module.exports = questionsController