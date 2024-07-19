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
    
    const newUser = new Student({
      email,
      firstname,
      lastname,
      password:password,
      profilepic: imgPath,
    });
    await newUser.save();
    res
      .status(201)
      .json({ Message: "Student registered successfully", Student: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ Message: "Internal server error", Error: error.message });
  }
};
//Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await Student.findOne({
      email: email,
      password: password,
    });
    if (!existUser) {
      return res.json({ message: "User doesn't exists" });
    }
    if (password !== existUser.password) {
      return res.json({ message: "Passwords did not match" });
    }
    const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15d",
    });
    res
      .status(200)
      .json({
        message: "Student logged in successfully",
        student: existUser,
        Token: token,
      });
  } catch (error) {
    res
      .status(500)
      .json({ Message: "Internal server error", Error: error.message });
  }
};
const otpStore = new Map()
const sendOtp = async (req, res) => {
  const {email} = req.body
  try {
    const student = await Student.findOne({ email });
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 300000; 
    otpStore.set(email, { otp, expires: otpExpiry });
    console.log(otpStore)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user:process.env.EMAIL_USER,
          pass:process.env.EMAIL_PASS
      }
  });

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP for resetting Password',
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return res.status(500).json({ message: 'Error sending email', error , info:info});
    }
    res.json({ message: 'OTP sent' ,});
});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
const verifyOTP = async(req,res)=>{
  const { email, otp } = req.body;
    
  const storedOtp = otpStore.get(email);
  console.log(storedOtp)
  if (!storedOtp) {
      return res.status(400).json({ message: 'No OTP found for this email' });
  }

  if (storedOtp.otp === otp && storedOtp.expires > Date.now()) {
      return res.json({ message: 'OTP verified' });
  } else {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
}
const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;
    
    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const storedOtp = otpStore.get(email);

        if (!storedOtp) {
            return res.status(400).json({ message: 'No OTP found for this email' });
        }

        student.password = newPassword;
        await student.save();
        otpStore.delete(email);
        return res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
  register,
  login,
  sendOtp,
  forgotPassword,
  verifyOTP
};
