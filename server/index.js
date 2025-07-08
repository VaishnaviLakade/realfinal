// server/index.js
const express = require("express");
const cors = require("cors");
const app = express();

const studentRoutes = require("./routes/students");
const assignmentMarks = require("./routes/assignmentMarks");
const attendanceMarksRouter = require("./routes/attendanceMarks");
const unitTestMarksRouter = require("./routes/unitTestMarks");
const termWorkRouter = require("./routes/termWorkMarks");
const authRoutes = require("./routes/auth");
app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/assignmentMarks", assignmentMarks);

app.use("/api/attendanceMarks", attendanceMarksRouter);
app.use("/api/unitTestMarks", unitTestMarksRouter);
app.use("/api/calculateTermWork", termWorkRouter);

app.use("/api/auth", authRoutes);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
