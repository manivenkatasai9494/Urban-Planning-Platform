const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("c:/Users/yashwanth/OneDrive/Desktop/Vivitsu/frontend/login"));
app.use(express.static("c:/Users/yashwanth/OneDrive/Desktop/Vivitsu/frontend"));

app.listen(3000, () => {
  console.log("Frontend server listening to server 3000...");
})