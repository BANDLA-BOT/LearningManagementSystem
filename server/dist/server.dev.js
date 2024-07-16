"use strict";

var express = require("express");

var DB = require("./utils/db.js"); //Student imports 


var authRoutes = require("./routes/student/authRoutes.js");

var dashboardRoutes = require("./routes/student/dashboardRoutes.js");

var createCourseRoute = require("./routes/student/createCourse.js");

var addReview = require("./routes/student/reviewRoute.js"); //Admin imports


var authAdmin = require('./routes/admin/auth.js');

var dashboard = require('./routes/admin/dashboard.js');

var cors = require("cors");

require("dotenv").config();

var app = express(); //DB

DB; //middlewares

app.use(express.json());
app.use(cors()); //student API's

app.use("/api/student/auth", authRoutes);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/student/course", createCourseRoute);
app.use("/api/student/review", addReview); //Admin API's

app.use("/api/admin/auth", authAdmin);
app.use("/api/admin/dashboard", dashboard); //server

app.listen(process.env.PORT, function () {
  console.log("Server running on", process.env.PORT);
});
//# sourceMappingURL=server.dev.js.map
