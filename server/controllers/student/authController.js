const Student = require("../../models/users/studentModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer   = require('nodemailer')

//Register Controller
const register = async (req, res) => {
  try {
    const { email, firstname, lastname, password } = req.body;
    const imgPath = `${req.file.destination}/${req.file.filename}`;
    const user = await Student.findOne({ email: email });
    if (user) {
      return res.json({ message: "User already exists with the email ID" });
    }
    const salt = 12
   const hashedPassword = bcrypt.hashSync(password, salt)
   
    const newUser = new Student({
      email,
      firstname,
      lastname,
      password:hashedPassword,
      profilepic: imgPath,
    });
    await newUser.save();
    res
      .status(201)
      .json({ Message: "Student registered successfully", Student: newUser , register:true});
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ Message: "Internal server error", Error: error.message });
  }
};
//Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password)
    const existUser = await Student.findOne({
      email: email,
    });
    if (!existUser) {
      return res.json({ message: "User doesn't exists" });
    }
    const isValidPassword = bcrypt.compareSync(password, existUser.password)
    if (!isValidPassword) {
      return res.json({ message: "Password incorrect"});
    }
    const token = jwt.sign({ id: existUser._id, user:existUser.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2w",
    });
    res
      .status(200)
      .json({
        message: "Student logged in successfully",
        user: existUser,
        Token: token,
        login:true
      });
  } catch (error) {
    res
      .status(500)
      .json({ Message: "Internal server error", Error: error.message });
  }
};
const resetPasswordLink = async (req, res) => {
  const { email } = req.body
  const student = await Student.findOne({email});
  if(!student){
    return res.status(404).json({message:"User not found"})
  }
  const resetToken = jwt.sign({id:student._id}, process.env.JWT_SECRET_KEY_FOR_RESET_PASSWORD_LINK, {expiresIn:'10m'});

  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS
    },
  });
  const mailOptions = {
    from:process.env.EMAIL_USER,
    to:email,
    subject:'Password reset Link',
    text:`Please use the following link to reset your password: http://localhost:8000/api/student/auth/reset-password/${resetToken}`
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    res.send('Password reset email sent');
  });
}
const resetPassword = async(req,res)=>{
  const {token} = req.params
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_FOR_RESET_PASSWORD_LINK)
    const userId = decoded.id
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await Student.findByIdAndUpdate(userId,{password:hashedPassword})
    res.json({Message:"Password updated successfully"});
  } catch (error) {
    res.status(400).send('Invalid or expired token')
  }
}
module.exports = {
  register,
  login,
  resetPasswordLink,
  resetPassword,
};
