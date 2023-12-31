const express = require("express");
// const router = express.Router(); isko kyu comment kiya??
const router = express.Router({ mergeParams: true }); // yaha likhe hai n isse id aayega kyo ki di hamara app.js me hai

const wrapAsync = require("../utlis/wrapAsync.js");
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");
const reviewController =require("../controller/reviews.js")


//reviews
//post route
router.post(
  "/",
  isLoggedIn,
  // validateReview,
  wrapAsync(reviewController.createReview));

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview));


module.exports = router;

