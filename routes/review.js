const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");
const { add, del } = require("../controllers/reviews.js");


// Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(add));

// delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(del));

module.exports = router;
