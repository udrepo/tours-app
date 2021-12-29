const env = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");

const Tour = require("../../models/tourModel");

env.config({
  path: "./config.env",
});


const db = "mongodb+srv://dev:tour@cluster0.pripz.mongodb.net/tours_app?retryWrites=true&w=majority"

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.info(`DB Connection Successful`));

//read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf8"));

//import to mongo
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data imported!')
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete all data from db
const deleteData = async()=> {
  try{
    await Tour.deleteMany();
    console.log('All data deleted');
  }catch(err){
    console.log(err);
  }
  process.exit();
}

if(process.argv[2] === '--import') importData();
if(process.argv[2] === '--delete') deleteData();