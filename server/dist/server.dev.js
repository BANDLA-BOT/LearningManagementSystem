"use strict";

var express = require("express");

var DB = require("./utils/db.js");

var bodyParser = require('body-parser');

var path = require('path');

var cookieParser = require('cookie-parser'); //Student imports 


var authRoutes = require("./routes/student/authRoutes.js");

var dashboardRoutes = require("./routes/student/dashboardRoutes.js");

var createCourseRoute = require("./routes/student/createCourse.js");

var addReview = require("./routes/student/reviewRoute.js");

var reviewRoute = require('./routes/admin/reviewRoutes.js'); //Admin imports


var authAdmin = require('./routes/admin/auth.js');

var dashboard = require('./routes/admin/dashboard.js');

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
app.use('/resources', express["static"]('resources')); //student API's

app.use("/api/student/auth", authRoutes);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/student/course", createCourseRoute);
app.use("/api/student/review", addReview); //Admin API's

app.use("/api/admin/auth", authAdmin);
app.use("/api/admin/dashboard", dashboard);
app.use('/api/admin/review', reviewRoute); //server

app.listen(process.env.PORT, function () {
  console.log("Server running on", process.env.PORT);
});
//# sourceMappingURL=server.dev.js.map
