const initData = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../models/listings.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany();
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "65b35485db8100c1ee17894a",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was created");
};
initDB();
