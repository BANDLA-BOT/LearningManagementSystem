const express = require("express");
const DB = require("./utils/db.js");
const authRoutes = require("./routes/authRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const createCourseRoute = require("./routes/createCourse.js");
const addReview = require("./routes/reviewRoute.js");
const cors = require("cors");
require("dotenv").config();
const app = express();

//DB
DB;

//middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/course", createCourseRoute);
app.use("/api/review", addReview);

//server

app.listen(process.env.PORT, () => {
  console.log("Server running on", process.env.PORT);
});
