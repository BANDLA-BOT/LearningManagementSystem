const courseModel = require('./../../models/course/courseModel.js');


const questionsController = async(req,res)=>{
      try {
        const id = req.user.id
        const courses = await courseModel.find({instructor:id})
        const discussions = {
            answered:[],
            notAnswered:[]
        }
        courses.forEach(course =>{
            course.discussions.forEach(discussion =>{
                if(discussion.answer){
                    discussions.answered.push(discussion)
                }
                else{
                    discussions.notAnswered.push(discussion)
                }
            })
        })
        res.status(200).json(discussions)
      } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
      }
}

module.exports = questionsController