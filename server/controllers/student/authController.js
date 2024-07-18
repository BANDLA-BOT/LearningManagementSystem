const Student = require("../../models/users/studentModel.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const twilio = require('twilio')

//Register Controller

const register = async (req, res) => {
  try {
    const { email, firstname, lastname, password } = req.body;
    const imgPath = `${req.file.destination}/${req.file.filename}`;
    const user = await Student.findOne({ email: email });
    if (user) {
      return res.json({ message: "User already exists with the email ID" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new Student({
      email,
      firstname,
      lastname,
      password: hashedPassword,
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
    const isPasswordMatch = bcrypt.compareSync(password, existUser.password);
    if (!isPasswordMatch) {
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
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const student = await Student.find({ email });
    if (!student) {
      return res
        .status(404)
        .json({ message: "No user found with this email ID" });
    } else {
      let otp = "";
      let numbers = "1234567890";
      let len = numbers.length;
      for (let i = 0; i < 6; i++) {
        otp += numbers[Math.floor(Math.random() * len)];
      }
      const accountSid = 'USad386f4438ea7568b38b822db298048b'
      const authToken = ""
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", Error: error.message });
  }
};
const forgotPassword = async (req, res) => {
  try {
    console.log(req.cookies)
  } catch (error) {
    res.json({ message: "Internal server error", Error: error.message });
  }
};

module.exports = {
  register,
  login,
  sendOtp,
  forgotPassword,
};
