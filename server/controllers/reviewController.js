const courseModel = require('../models/course/courseModel.js')
const studentModel = require('../models/users/studentModel.js')

const reviewController  = async(req,res)=>{
    const { courseId } = req.params
    const userId = req.user
    const {review} = req.body
    try {
        const course = await courseModel.findById(courseId)
        const student = await studentModel.findById({_id:userId.id})
        if(!course || !student){
            return res.status(404).json({message:"Course not found"})
        }
        course.reviews.push({
            reviewBy:{
                userId:student._id,
                review
            }
        })
        await course.save()
        res.status(201).json({message:"Review added successfully"})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteReview = async(req, res)=>{
    try {
        const { reviewedUserId, courseId } = req.params
        const deletedReview = await courseModel.findByIdAndUpdate(
            courseId,   
            {
                $pull:{reviews:{'reviewBy.userId':reviewedUserId}}
            },
            {
                new:true
            }
        )
        res.json({message:"Review deleted successfully", deletedReview:deletedReview})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}

module.exports = {reviewController, deleteReview}