"use strict";

var express = require("express");

var DB = require("./utils/db.js");

var bodyParser = require('body-parser');

var path = require('path');

var cookieParser = require('cookie-parser'); //Student imports 


var authRoutes = require("./routes/student/authRoutes.js");

var dashboardRoutes = require("./routes/student/dashboardRoutes.js");

var addReview = require("./routes/student/reviewRoute.js");

var reviewRoute = require('./routes/admin/reviewRoutes.js'); //Admin imports


var authAdmin = require('./routes/admin/auth.js');

var dashboard = require('./routes/admin/dashboard.js'); //Instructor imports 


var authInstructor = require('./routes/instructor/auth.js');

var createCourseRoute = require("./routes/instructor/dashboard.js");

var discussions = require('./routes/instructor/discussions.js');

var cors = require("cors");

require("dotenv").config();

var app = express(); //DB

DB; //middlewares

var allowedOrigins = ['http://localhost:5173'];
var corsOptions = {
  origin: function origin(_origin, callback) {
    if (allowedOrigins.indexOf(_origin) !== -1 || !_origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // This is necessary for the client to include credentials

};
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express["static"]('uploads'));
app.use('/resources', express["static"]('resources'));
app.use('/instructorProfilesPicUpdate', express["static"]('instructorProfilesPicUpdate')); //student API's

app.use("/api/student/auth", authRoutes);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/student/review", addReview); //Admin API's

app.use("/api/admin/auth", authAdmin);
app.use("/api/admin/dashboard", dashboard);
app.use('/api/admin/review', reviewRoute); //Instructor API's 

app.use('/api/instructor/auth', authInstructor);
app.use("/api/instructor/dashboard", createCourseRoute);
app.use('/api/instructor/discussion', discussions); //server

app.listen(process.env.PORT, function () {
  console.log("Server running on", process.env.PORT);
});
//# sourceMappingURL=server.dev.js.map
