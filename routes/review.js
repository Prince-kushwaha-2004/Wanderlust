const express = require("express");
const router = express.Router({ mergeParams: true }); //mergeParams is used to merge the params from the parent route
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware.js")
const reviewController = require('../controller/review.js')



//post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.addReview));

//delete review route
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;
