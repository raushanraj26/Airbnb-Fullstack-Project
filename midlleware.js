const Listing=require("./models/listing");   //for isowner mniddleware 
const Review=require("./models/review");   //for isowner mniddleware 
const ExpressError = require("./utils/ExpressError.js");   //require for error handling  
const { listingSchema,reviewSchema } = require("./schema.js");   //require for server side listing and review schema validation
 
 
 //user ko authenticate krega

//  jb listing ko create,create,edit,koi v route pr jaane se apahle

module.exports.isLoggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){   //check krega new listing create krne se pahle ,agr nii authenticated thne return error
       // console.log(req);

        req.session.redirectUrl=req.originalUrl;   //jis route ko acces skrna chah rha ths th usi route ka url dega,save dkrega
                                // originUrl;  changes
        req.flash("error","you must be logged in to create listing");
       return  res.redirect("/login");
    } 

    next();
}


// savedRedirectUrl Middleware ->
// The savedRedirectUrl middleware is used to store 
// and retrieve the URL a user was trying to access before logging in, 
// so they can be redirected to that page after authentication.

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}




//thismiddleware check->authorization for listing jo owner hai wahi listing ko edit,delete kr skta hai
//sb route me isko check krna tha so,middkleware create kre
module.exports.isOwner=async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);   //authorization of listings
    // if (currUser && !listing.owner._id.equals(res.locals.currUser._id)) {     //check authorization and jo show.ejs(line 48 ) ko uncommnet kro
        
    if (res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the owner of the listing");
        res.redirect(`/listings/${id}`);
    }
    next();
}



//this middleware check->authorization for review jo owner hai wahi review ko delete kr skta hai
//sb route me isko check krna tha so,middkleware create kre
module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);   //authorization of review,db k ander review find kro
    if ( !review.author.equals(res.locals.currUser._id)) {     //check authorization and jo show.ejs(line 48 ) ko uncommnet kro
        req.flash("error", "you are not the author of this review");
        res.redirect(`/listings/${id}`);
    }
    next();
}



//validation for schema middleware
module.exports. validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);    //listingSchema me jo cond defined hai use req.body validate kr rhi hai means schema validation

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errmsg);
    }
    else {
        next();
    }

};



//validation for review schema middleware
module.exports.validateReview=(req,res,next)=>{
    let {error}=   reviewSchema.validate(req.body);    //reviewSchema me jo cond. defined hai use req.body validate kr rhi hai means schema validation
   
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errmsg);
   }
   else{
    next();
   }

};


