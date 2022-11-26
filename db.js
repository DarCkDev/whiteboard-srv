const mongoose = require("mongoose");

mongoose
  .connect("mongodb://mongodb:27017")
  .then((data) => console.log("DB connected"))
  .catch((error) => console.error("ERROR DB", error));
