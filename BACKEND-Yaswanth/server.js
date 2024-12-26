const express = require("express");
const errorHandler = require("./middleware/errorHandling");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");

const app = express();
const port = process.env.PORT;

app.use(cors());
connectDb();
app.use(express.json());
app.use("/api/concerns", require("./routes/concernRoutes"));
app.use("/api/groups/my-groups", require("./routes/myGroupRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));
app.use("/api/projects/funds", require("./routes/projectFundRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/funds", require("./routes/fundRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/notices", require("./routes/noticeRoutes"));
app.use(errorHandler);

app.listen(port || 5000, () => {
  console.log("Server listening to port", port +"...");
});
