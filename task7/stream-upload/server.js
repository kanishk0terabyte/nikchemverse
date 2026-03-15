const express = require("express");
const uploadRouter = require("./routes/upload");

const app = express();

app.use("/", uploadRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
}); 