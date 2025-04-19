// for data initialisied in db=>
//   open terminal and type->"cd init" then "node index.js"
// for go one step back directory type "cd.."



const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:'67b997798f9ddd3a2eae6871'}));     //db.users.find() se liye hai obj id on mongo shell,,sbke liye ye abhi common h
                                                                                  //ab db.listings.find() me owner id v show krega mongo shell me
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};




initDB();


