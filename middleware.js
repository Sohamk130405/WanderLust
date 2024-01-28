const Listing = require("./models/listings");
const Review = require("./models/reviews");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in first!");
        return res.redirect("/user/login")
      }
      next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =req.session.redirectUrl;
      }
      next();
}

module.exports.isOwner = async ( req, res, next) =>{
  let id = req.params.id;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permission to edit");
    return res.redirect(`/listings/${id}`);
  };
  next();
}


module.exports.isReviewAuthor = async ( req, res, next) =>{
  let reviewId = req.params.reviewId;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permission to delete review of other authors");
    return res.redirect("/listings");
  };
  next();
}


module.exports.validateListing = (req,res,next)=>{

    let { err } = listingSchema.validate(req.body);
    if (err) {
      let errMsg = err.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

module.exports.validateReview = (req, res, next) => {
  let { err } = reviewSchema.validate(req.body);
  if (err) {
    let errMsg = err.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};  