const Listing = require("./models/listing");
const { listingSchema , } = require("./schema.js");
const ExpressError = require("./utlis/ExpressError.js");
const Review = require("../majorpro/models/review.js");

  module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()) {
      //redirect url save 
      req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "you must be logged in to create listing!");
        return res.redirect("/login");
      }
      next();
  };
  
  module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  }

  module.exports.isOwner = async (req, res, next)=>{
    let { id } = req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","Only Owner of listing can do changes");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };
  
  module.exports.validateListing = (req, res, next) => {
    let error = listingSchema.validate(req.body);
    if (error.error) {
      let errMsg = error.error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  const validateReview = (req, res, next) => {
    let error = reviewSchema.validate(req.body);
    if (error.error) {
      let errMsg = error.error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
  

  module.exports.isReviewAuthor = async (req, res, next)=>{
    let {id, reviewId } = req.params;
    let listing= await Review.findById(reviewId);
    if(!listing.author._id.equals(res.locals.currUser._id)){
      req.flash("error","Only Owner of the review can do the changes");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };
