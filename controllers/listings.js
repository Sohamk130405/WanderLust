const Listing = require("../models/listings.js");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Requested listing does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested listing does not exist!");
    res.redirect("/listings");
  }
  let orgImgUrl = listing.image.url;
  orgImgUrl=orgImgUrl.replace("/upload","/upload/h_200,w_250");
  res.render("listings/edit.ejs", { listing , orgImgUrl});
};

module.exports.update = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.del = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};

module.exports.addNew = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.create = async (req, res, next) => {
  const url = req.file.path;
  const filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created Successfully!");
  res.redirect("/listings");
};
