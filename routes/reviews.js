const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing");
const wrapAsync = require("../utiles/wrapAsync");
const Review = require("../models/review");
const {validateReview, isloggedIn, isReviewAuthor} =require("../middleware.js")
const ReviewController = require("../controllers/review.js")



//Review Route 
router.post("/",isloggedIn ,validateReview, wrapAsync(ReviewController.createReview));

// Delete Review Route
router.delete("/:reviewId",
   isloggedIn,
   isReviewAuthor,
  //  validateReview , 
   wrapAsync(ReviewController.destroyReview)
  );

module.exports = router;