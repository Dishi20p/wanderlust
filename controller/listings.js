const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.home = (req, res) => {
  res.render("listings/home.ejs");
}
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newPost = (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
};



module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you are requested for does not exist");
    res.redirect("/listings");
  }

  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createPost = async (req, res, next) => {
  let response = await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send()
  

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url,"..", filename);

  // let result = listingSchema.validate(req.body);
  // console.log(result);
  // if (result.error) {
  //   throw new ExpressError(400, result.error);
  // }
  // if(!req.body.listing){
  //   throw new ExpressError(400, "Send Valid data for listing");
  // }
  // let {title, description, image, price, country, location } = req.body
  // let listing = req.body.listing;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  newListing.geometry = response.body.features[0].geometry;

  // if(!newListing.title) {
  //   throw new ExpressError(400, "Title is missing");
  // }
  // if(!newListing.description){
  //   throw new ExpressError(400, "Description is missing");
  // }
  // if(!newListing.location){
  //   throw new ExpressError(400, "Location is missing");
  // }
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New listing Created!");
  // console.log(res.locals.success);
  res.redirect("/listings");

  // console.log(listing);
};

module.exports.editPost = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl =originalImageUrl.replace("/upload","/upload/h_300/w_250", "crop&w=800","crop&w=200" )
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updatePost = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file != "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image={url, filename};
  await listing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deletePost = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
  req.flash("success", "Listing deleted!");
};
