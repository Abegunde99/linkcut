const mongoose = require('mongoose');

//load env vars
require('dotenv').config();

let MONGODB_URI;
let DB;

if (process.env.NODE_ENV === "development") {
  MONGODB_URI = process.env.MONGODB_URI;
  DB = "development";
} else {
  MONGODB_URI = process.env.TEST_DB_URI;
  DB = "test";
}

exports.connectDB = async () => {
    mongoose.connect(MONGODB_URI);
    const db = mongoose.connection;
    db.on("connected", () => {
        console.log(`connected to ${DB} database successfully`);
    });
    db.on("error", (err) => {
        console.log(`error occurred while connecting to ${DB} database`);
        console.log(err);
        process.exit(1);
    });
}