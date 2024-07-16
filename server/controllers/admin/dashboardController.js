const courseModel = require('../../models/course/courseModel.js')
const student = require('../../models/users/studentModel.js')

const dashboardController = async(req,res)=>{
    try {
        const Students = await student.find().limit(20)
        const Courses =  await courseModel.find().limit(20)
        if(!Students || !Courses){
            return res.status(404).json({message:"Error while fetching Data"})
        }
        res.status(200).json({message:"Fetched Data", courses:Courses, students:Students})
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}
const searchController = async(req,res)=>{
    try {
        const query = req.query.q
        const Coursedata = await courseModel.find({
            $or: [
              { title: { $regex: query, $options: "i" } }
            ],
          })
        const studentsData = await student.find({
            $or: [
              { firstname: { $regex: query, $options: "i" } },
              {lastname:{ $regex: query, $options: 'i'}},
              {email:{ $regex:query, $options:'i'}}
            ],
          })
          if( !Coursedata || !studentsData){
                return res.status(404).json({message:"Not found"})
          }
          res.status(200).json({message:"Results fetched", Students:studentsData, courses:Coursedata })
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}
module.exports = {dashboardController, searchController}
