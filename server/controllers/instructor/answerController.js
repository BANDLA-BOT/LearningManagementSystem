const courseModel  = require('../../models/course/courseModel.js')


const answerController = async(req,res)=>{
    try {
        const {id, courseId} = req.params
        const {answer} = req.body
        const answeredBy = req.user.id
        const course = await courseModel.findById(courseId)
        const discussion = course.discussions
        let disc = discussion.find(dis => dis._id.toString() === id)
        disc.answeredBy = answeredBy,
        disc.answer = answer
        await course.save()
        res.status(200).json(
            {
                message:"Answer sent",
            }
        )

    } catch (error) {
        res.status(500).json({message:"internal server error", error:error.message})
    }
}
module.exports = answerController