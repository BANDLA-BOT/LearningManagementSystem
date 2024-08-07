const courseModel = require('../../models/course/courseModel.js')
const Instructor = require('../../models/users/instructorModel.js')
const student = require('../../models/users/studentModel.js')
const cloudinary = require("cloudinary").v2;
const nodemailer = require('nodemailer')
const multer = require("multer");
const adminModel = require('../../models/users/adminModel.js');
const studentModel = require('../../models/users/studentModel.js');


//Cloudinary for videos

cloudinary.config({
  cloud_name: "diqptwlqn",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const  dashboardController = async(req,res)=>{
    try {
        const Students = await student.find()
        const Courses =  await courseModel.find()
        const instructor = await Instructor.find()
        if(!Students || !Courses || !instructor){
            return res.status(404).json({message:"Error while fetching Data"})
        }
        res.status(200).json({message:"Fetched Data", courses:Courses, students:Students, Instructor:instructor})
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
          const InstructorData = await Instructor.find({
            $or: [
              { firstname: { $regex: query, $options: "i" } },
              {lastname:{ $regex: query, $options: 'i'}},
              {email:{ $regex:query, $options:'i'}}
            ],
          })
        const studentsData = await student.find({
            $or: [
              { firstname: { $regex: query, $options: "i" } },
              {lastname:{ $regex: query, $options: 'i'}},
              {email:{ $regex:query, $options:'i'}}
            ],
          })
          if( !Coursedata || !studentsData || !InstructorData){
                return res.status(404).json({message:"Not found"})
          }
          res.status(200).json({message:"Results fetched", Students:studentsData, courses:Coursedata, InstructorData:InstructorData })
    } catch (error) {
        res.status(500).json({message:"Internal server error", error:error.message})
    }
}
const createCourse = async (req,res)=>{
    try {
     const {title, price, description} = req.body
     const {instructorId} = req.params
     const instructor = await Instructor.findById(instructorId)
     const newCourse = await courseModel.create({
         title,price, description, instructor:instructorId
     })
     const transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
           user:process.env.EMAIL_USER,
           pass:process.env.EMAIL_PASS
          },
      secure:true,
     })
     const mailOptions = {
      from:process.env.EMAIL_USER,
      to:instructor.email,
      subject:"Task Added",
      html:`You have assigned to a task
        <b><p>Coursename:${title}</p></b>
        <b><p>Price:${price}</p></b>
        <b><p>Description:${description}</p></b>
      `
     }
     transporter.sendMail(mailOptions, (error, info)=>{
      if(error){
        return res.json({Message:"Error while sending email", error:error.message})
      }
      res.json({Message:"Email sent successfully ", Status:`Task assigned succesfully to the ${instructor.email}`})
     })
    } catch (error) {
     res.json(error.message)
    }
}
 const uploadVideos = async (req,res)=>{
     try {
         const {courseId} = req.params
         const {title,videoTitle} = req.body
         const course = await courseModel.findById(courseId)
         const section = course.section
         if(!req.file && !req.file.buffer){
             return res.status(400).json({ error: 'No file provided in the request' });
         }
         const result = cloudinary.uploader.upload_stream({resource_type:'video'}, async(err, result)=>{
             if (err) {
                 console.error('Error uploading to Cloudinary:', err);
                 return res.status(500).json({ error: 'Error uploading to Cloudinary' });
               }
               section.push({title:title, videos:[{title:videoTitle, url:result.secure_url}]})
               await course.save()
               res.status(201).json({ message: 'Video uploaded successfully', section:course.section})
         }).end(req.file.buffer)
     } catch (error) {
         console.error('Error uploading video:', error);
         res.status(500).json({ error: 'Error uploading video' });
     }
}
 const resourceController = async(req,res)=>{
     try {
         const { courseId } = req.params
         const {title} = req.body
         const userId = req.user
         const filePath = `${req.file.destination}/${req.file.filename}`
         const course = await courseModel.findById(courseId).populate('resources')
         course.resources.push({title:title, url:filePath})
         await course.save()
       res.json(course)
     } catch (error) {
       res.json(error.message)
     }
}
const acceptCourseRequest = async(req,res)=>{
  try {
    const { requestId } = req.params
    const { studentId } = req.body
    const Admin = await adminModel.findOne().populate('courseRequests')
    const Student = await student.findById({_id:studentId}).populate('enrolled')
    const enrolledList = Student.enrolled 
    // console.log(Student)
    if(!Student){
      return res.status(404).json({Message:"No student found with this ID"})
    }
    const requests = Admin.courseRequests
    const Accept = requests.id(requestId)
    if(!Accept.paid){
      return res.status(400).json({Message:"User did not Paid for the course"})
    }
    Accept.accept = true
    enrolledList.push({
      coursesAvailable:Accept.courseId
    })
    await Student.save()
    await Admin.save()
    res.status(200).json({Message:"Course confirmed"})

  } catch (error) {
    res.status(500).json({Message:"Internal server error", error:error.message})
  }
}
module.exports = {dashboardController, searchController, createCourse, uploadVideos, resourceController, acceptCourseRequest}
