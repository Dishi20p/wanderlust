const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.createReview = async (req, res) => {
    // console.log("Request body :" , req.body);

    let listing = await Listing.findById(req.params.id); //shayad  m trying
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    req.flash("success", "New Review Created!");
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  };

module.exports.deleteReview = (async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
    
  })  
