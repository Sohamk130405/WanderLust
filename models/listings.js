const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const User = require("./users.js");

let listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url : {
      type: String,
      default:
        "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D"
          : v,
    },
    filename: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});
listingSchema.post("findOneAndDelete", async (listing)=>{
  if(listing) {
    await Review.deleteMany({ _id : { $in: listingSchema.reviews}});
  }
 
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
