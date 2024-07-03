"use strict";

var express = require("express");

var DB = require("./utils/db.js");

var authRoutes = require("./routes/authRoutes.js");

var dashboardRoutes = require("./routes/dashboardRoutes.js");

var createCourseRoute = require("./routes/createCourse.js");

var addReview = require("./routes/reviewRoute.js");

var cors = require("cors");

require("dotenv").config();

var app = express(); //DB

DB; //middlewares

app.use(express.json());
app.use(cors()); //Routes

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/course", createCourseRoute);
app.use("/api/review", addReview); //server

app.listen(process.env.PORT, function () {
  console.log("Server running on", process.env.PORT);
});
//# sourceMappingURL=server.dev.js.map
