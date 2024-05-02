const express = require('express');
const ConnectDb = require("./config/dbConnection");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();

ConnectDb();

const app = express();

const PORT = process.env.PORT || "8070";

app.use(cors());
app.use(bodyParser.json());

app.use("/api/stu/", require("./routes/studentRoutes"));
app.use("/api/adm/", require("./routes/adminRoutes"));
app.use("/api/fac/", require("./routes/facultyRoutes"));
app.use("/api/ro/", require("./routes/roomRoutes"));
app.use("/api/cou/", require("./routes/courseRoutes"));
app.use("/api/time/", require("./routes/timetableRoutes"));
app.use("/api/stuEnroll/", require("./routes/studentEnrollmentRoutes"));
app.use("/api/book/", require("./routes/bookingRoutes"));
app.use("/api/note/", require("./routes/notificationRoutes"));

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
})

module.exports = app;
