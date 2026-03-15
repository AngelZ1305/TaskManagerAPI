const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const users = require("./data/users");
const tasksStore = require("./data/tasksStore");
const { JWT_SECRET, CORS_ORIGIN } = require("./config");
const createAuthenticateToken = require("./middleware/authenticateToken");
const createAuthRouter = require("./routes/authRoutes");
const createTasksRouter = require("./routes/tasksRoutes");

const app = express();
const authenticateToken = createAuthenticateToken(JWT_SECRET);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

app.use("/", createAuthRouter({ users, jwtSecret: JWT_SECRET }));
app.use("/tasks", createTasksRouter({ authenticateToken, tasksStore }));

module.exports = app;
