const express = require("express");
const router = express.Router({mergeParams:true});
// const {listingSchema,reviewSchema}=require("../schema.js");   //require for server side listing and review schema validation
const ExpressError=require("../utils/ExpressError.js");   //require for error handling
const Review = require("../models/review.js");   //require review.js file 
const wrapAsync=require("../utils/wrapAsync.js");   //require for error handling
const Listing = require("../models/listing.js");   //require listing.js file  
const {validateReview, isLoggedIn, isReviewAuthor}=require("../midlleware.js"); 


const reviewController=require("../controllers/review.js");



  

//Reviews--->POST review route


//validateReview (78-87) yaha as a middleware pass hua jo review schema ko validate krega

// sb routes me /listings/:id/reviews common hai so cut krke application.js file me likhe hai
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview) );
  
//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview)
);

module.exports=router;