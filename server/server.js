const express = require("express");
const DB = require("./utils/db.js");
const bodyParser = require('body-parser')
const path = require('path')
const cookieParser = require('cookie-parser')
//Student imports 
const authRoutes = require("./routes/student/authRoutes.js");
const dashboardRoutes = require("./routes/student/dashboardRoutes.js");
const createCourseRoute = require("./routes/student/createCourse.js");
const addReview = require("./routes/student/reviewRoute.js");
const reviewRoute = require('./routes/admin/reviewRoutes.js')


//Admin imports
const authAdmin = require('./routes/admin/auth.js')
const dashboard = require('./routes/admin/dashboard.js')
const cors = require("cors");
require("dotenv").config();
const app = express();

//DB
DB;

//middlewares
const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This is necessary for the client to include credentials
};





app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'));
app.use('/resources', express.static('resources'))

 
//student API's
app.use("/api/student/auth", authRoutes);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/student/course", createCourseRoute);
app.use("/api/student/review", addReview);

//Admin API's
app.use("/api/admin/auth", authAdmin);
app.use("/api/admin/dashboard", dashboard)
app.use('/api/admin/review', reviewRoute)

//server
app.listen(process.env.PORT, () => {
  console.log("Server running on", process.env.PORT);
});
