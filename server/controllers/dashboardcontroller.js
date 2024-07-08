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
        student.enrolled.push({
            coursesAvailable:course._id,
            isComplete:false,
        })
        await student.save()
        res.status(200).json({Message:"Course enrolled successfuly", Student:student})
    } catch (error) {
        res.status(500).json({message:"Internal server error", Error:error.message})
    }
}

const deleteEnroll = async(req,res)=>{
    try {
        const userId = req.user
        const {courseId} = req.params
        const result = await Student.updateOne(
            {_id:userId.id},
            {$pull:{enrolled:{_id:courseId}}}
        )
        if(result.nModified > 0){
            res.status(200).send({message:"Enrolls Updated"})
        }
        res.json({EnrollUpdated:result})
    } catch (error) {
        res.status(500).send({ message: 'Server error', error });
    }
}

const completedCourses = async(req,res)=>{
    try {
        const userId = req.user
        const student = await Student.findById({_id:userId.id})
        
        if(!student){
            return res.status(404).send({ message: 'Student not found' });
        }
        const completedCourses = student.enrolled
        .filter(course => course.isComplete)
        .map(course => ({courses:course.coursesAvailable}))

        await Student.updateOne(
            {_id:userId.id},
            {$addToSet:{completedCourses:{$each:completedCourses}}}
        )
        res.status(200).json({ message: 'Completed courses updated successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
}


const topRanks = async(req,res)=>{
    try {
        
        const students = await Student.aggregate([
        {$match:{
            'enrolled.isComplete':true
        }},
        {
            $addFields:{
                Count:{
                    $size:{
                        $filter:{
                            input:'$enrolled',
                            as:'enrolled',
                            cond:{$eq:['$$enrolled.isComplete', true]}
                        }
                    }
                }
            }
        },
        {
            $sort:{_id:-1}
        },
        
        {
            $project:{
                firstname:1,
                lastname:1
            }
        }
    ])
    res.status(200).json({rankings:students})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}  

const markAsComplete = async(req,res)=>{
    try {
        const {courseId} = req.params
        const userId = req.user
        const student = await Student.findOneAndUpdate(
            {_id:userId.id, 'enrolled.coursesAvailable':courseId},
            {
                $set: {'enrolled.$.isComplete':true},
                $addToSet:{completedCourses:{courses:courseId}}
            },
            {new:true}
        )
        if(!student){
            return res.json({error:"student not found"})
        }
        res.json({message:student})
    } catch (error) {
        res.json({message:error.message})
    }
}

module.exports ={ getProfile, enrollCourse, deleteEnroll, completedCourses,topRanks, markAsComplete }