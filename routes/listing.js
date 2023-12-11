
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'), wrapAsync (listingController.createPost));
// .post((req,res)=>{
//     res.send(req.file);
// });

router.get("/home" , listingController.home);
//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editPost));


//New route
router.get("/new", isLoggedIn, listingController.newPost);

router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updatePost))
.delete(isLoggedIn, isOwner,wrapAsync(listingController.deletePost));
// //index route
// router.get("/", wrapAsync(listingController.index));




// //Show route
// router.get("/:id", wrapAsync(listingController.showListing));


// //create route
// router.post("/", validateListing, wrapAsync (listingController.createPost));




// //Update Route
// router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updatePost));


// //delete route
// router.delete("/:id",isLoggedIn, isOwner,wrapAsync(listingController.deletePost));



module.exports =  router;
