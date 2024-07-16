const express = require("express");
const DB = require("./utils/db.js");

//Student imports 
const authRoutes = require("./routes/student/authRoutes.js");
const dashboardRoutes = require("./routes/student/dashboardRoutes.js");
const createCourseRoute = require("./routes/student/createCourse.js");
const addReview = require("./routes/student/reviewRoute.js");


//Admin imports
const authAdmin = require('./routes/admin/auth.js')
const dashboard = require('./routes/admin/dashboard.js')

const cors = require("cors");
require("dotenv").config();
const app = express();

//DB
DB;

//middlewares
app.use(express.json());
app.use(cors());

 
//student API's
app.use("/api/student/auth", authRoutes);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/student/course", createCourseRoute);
app.use("/api/student/review", addReview);

//Admin API's
app.use("/api/admin/auth", authAdmin);
app.use("/api/admin/dashboard", dashboard)

//server
app.listen(process.env.PORT, () => {
  console.log("Server running on", process.env.PORT);
});
