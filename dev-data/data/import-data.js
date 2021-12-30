const env = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");

const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");

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
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf8"));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf8"));

//import to mongo
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, {validateBeforeSave: false});
    await Review.create(reviews);
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
    await User.deleteMany();
    await Review.deleteMany();
    console.log('All data deleted');
  }catch(err){
    console.log(err);
  }
  process.exit();
}

if(process.argv[2] === '--import') importData();
if(process.argv[2] === '--delete') deleteData();