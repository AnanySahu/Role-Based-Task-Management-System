const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes =require("./routes/testRoutes");
const workspaceRoutes =require("./routes/workspaceRoutes");
const projectRoutes =require("./routes/projectRoutes");
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// DB Connection
connectDB();
// Test Route
app.get("/", (req, res) => {
  res.send("Task Management API Running");
});
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use( "/api/workspaces",workspaceRoutes);
app.use( "/api/project",projectRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});