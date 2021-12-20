const env = require("dotenv");
const mongoose = require("mongoose");
env.config({path: "./config.env"});

process.on('uncaughtException', err =>{
  console.log("Uncaught exeption! Shuting down!");
  console.log(err.name, err.message);
  server.close(()=>{
    process.exit(1);
  })
});

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

process.on('unhandledRejection', err =>{
  console.log(err.name, err.message);
  console.log("Shuting down!");
  server.close(()=>{
    process.exit(1);
  })
});

