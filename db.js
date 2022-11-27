require("dotenv").config();
const mongoose = require("mongoose");

const port = process.env.NODE_ENV === "dev" ? "localhost" : "mongodb";

mongoose
  .connect(`mongodb://${port}:27017/db_canvas`)
  .then((data) => console.log("DB connected"))
  .catch((error) => console.error("ERROR DB", error));
