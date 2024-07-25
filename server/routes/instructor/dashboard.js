const express = require('express');
const instructorTokenVerify = require('./../../utils/instructorTokenVerify.js')
const questionsController = require('../../controllers/instructor/questionController.js')
const {mentorsController, editInstructorProfile, editPassword} = require('../../controllers/instructor/dashboardController.js')
const multer = require('multer')
const router = express.Router()



//Multer for update profilePicture
const updateProfilePic = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null, 'instructorProfilesPics')
  },
  filename:(req,file,cb)=>{
    cb(null,`${Date.now()}-${file.originalname}`)
}
})
const uploadProfilePic = multer({
  storage:updateProfilePic
})

router.put('/editprofile', uploadProfilePic.single('updatedProfilePic'),instructorTokenVerify, editInstructorProfile)
router.put('/editpassword', instructorTokenVerify, editPassword)
router.get('/mentors', instructorTokenVerify, mentorsController)
router.get('/discussions', instructorTokenVerify, questionsController)

module.exports = router