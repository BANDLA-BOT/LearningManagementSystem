const CourseModel = require('../../models/course/courseModel.js')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const path = require('path')

const createCourse = async (req,res)=>{
   try {
    const {title, price, description} = req.body
    const newCourse = await CourseModel.create({
        title,price, description
    })
    res.json(newCourse)
   } catch (error) {
    res.json(error.message)
   }
}
const uploadVideos = async (req,res)=>{
    try {
        const {courseId} = req.params
        const {title,videoTitle} = req.body
        const course = await CourseModel.findById(courseId)
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

module.exports = {createCourse, uploadVideos, resourceController}