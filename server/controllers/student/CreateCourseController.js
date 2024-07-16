const CourseModel = require('../../models/course/courseModel.js')
const multer = require('multer')
const path = require('path')


//multer 

const storage = multer.diskStorage({
    destination:(req,file, cb)=>{
        cb(null, 'videos/')
    },
    filename:(req,file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage:storage})

exports.upload = upload.fields([
    {name:'videosFile', maxCount:1},
    {name:"thumbnail", maxCount:1}
]);

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

const addVideos = async(req,res)=>{
   try {
    const videos = req.files['videoFile'] || []
    const thumbnail = req.files['thumbnail'] || []
    const sections = JSON.parse(section)

    const uploadVideos = sections.map((sec, index)=>{
        const secVideos = video.filter(vid => vid.filename === `section[${index}].video`).map((video, videoIndex)=>({
            title:video.originalname,
            thumbnail:thumbnail[videoIndex] ? `/videos/${thumbnail[videoIndex].filename}`:'',
            videoFile: `/videos/${video.filename}`
        }))
    })
   } catch (error) {
    
   }
}


module.exports = {createCourse,addVideos}