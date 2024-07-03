const CourseModel = require('../models/course/courseModel.js')

const createCourse = async (req,res)=>{
    try {
        const {title, price, rating, reviews, resources, description, instructor, section} = req.body
        const newCourse = new CourseModel({
            title,
            price,
            rating,
            reviews,
            description,
            instructor,
            resources,
            section,
        })
        await newCourse.save()
        res.json({message:"Course created successfully", Course:newCourse})
    } catch (error) {
        res.status(500).json({message:"Internal server error", Error:error.message})
    }
}
module.exports = createCourse