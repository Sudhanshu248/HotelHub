const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const URL = "mongodb+srv://wanderlust:wanderlust1880@wanderlust.2epllgd.mongodb.net/?retryWrites=true&w=majority&appName=wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "66a227d79aed59f3a99f267c",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
