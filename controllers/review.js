//review ka callback store krega


const Listing=require("../models/listing");
const Review=require("../models/review");


//create review routew
module.exports.createReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // review jo kr rha hai uska author v associated rhama chgaheye
     newReview.author=req.user._id; 
     console.log(newReview);     
         
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success","new review created");     //one time pop up show krega
    res.redirect(`/listings/${listing._id}`);
}

//delete review

module.exports.destroyReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");     //one time pop up show krega
    res.redirect(`/listings/${id}`);
};