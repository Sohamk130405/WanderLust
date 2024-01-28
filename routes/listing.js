const express = require("express");
const router = express();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  index,
  edit,
  update,
  del,
  addNew,
  create,
  show,
} = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


//index route
router.get("/", wrapAsync(index));

// create route
router.get("/new", isLoggedIn, addNew);

router.post("/", isLoggedIn, validateListing,upload.single("listing[image]") ,wrapAsync(create));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(edit));

// update route
router.patch("/:id", isLoggedIn, isOwner, validateListing,upload.single("listing[image]"), wrapAsync(update));

// delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(del));

// show route
router.get("/:id", wrapAsync(show));
module.exports = router;
