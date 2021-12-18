const env = require("dotenv");
const mongoose = require("mongoose");
env.config({path: "./config.env"});
const app = require("./app");


const db = process.env.DB.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.info(`DB Connection Successful`));

const port = process.env || 3030;
app.listen(port, () => console.log("server started"));

