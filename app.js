

// <!-- --THIS IS THE MAIN FILE--- -->


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");   //require listing.js file
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
const wrapAsync=require("./utils/wrapAsync.js");   //require for error handling
const ExpressError=require("./utils/ExpressError.js");   //require for error handling
const {listingSchema,reviewSchema}=require("./schema.js");   //require for server side listing and review schema validation
const Review = require("./models/review.js");   //require review.js file





 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));  //for parsing the url parameters
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));







main().then(()=>{
    console.log("connected to DB ");

}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}







app.get("/",(req,res)=>{
    res.send("i am root");
});


//validation for schema middleware
const validateListing=(req,res,next)=>{
    let {error}=   listingSchema.validate(req.body);    //listingSchema me jo cond defined hai use req.body validate kr rhi hai means schema validation
   
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errmsg);
   }
   else{
    next();
   }

};



//validation for review schema middleware
const validateReview=(req,res,next)=>{
    let {error}=   reviewSchema.validate(req.body);    //reviewSchema me jo cond. defined hai use req.body validate kr rhi hai means schema validation
   
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",")
    throw new ExpressError(400,errmsg);
   }
   else{
    next();
   }

};
  






//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
})
);

  //new route(create new listing)
  app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
  });

//show route(show details of specific listing)
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");// db me se find krega Listing.find(id) and jo v reviews hai us listing ke sth with details v show krna hai
    res.render("./listings/show.ejs",{listing});
})
);
 

//create route(new.ejs se post method aa rha add krne pe)
                                                             //validateListing middleware u=yaha pass hua hai
  app.post("/listings",validateListing,
    wrapAsync (async(req,res,next)=>{ 
    const newlisting=new Listing(req.body.listing);   //Listing schema hai jo instance create krega
  await newlisting.save();
  res.redirect("/listings");
})
  );


//edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await  Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
);


//update route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})
);


//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedlistings=await Listing.findByIdAndDelete(id);
    console.log(deletedlistings);
    res.redirect("/listings");
})
);

//Reviews--->POST review route


//validateReview (78-87) yaha as a middleware pass hua jo review schema ko validate krega 
app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);
}) );
  
//Delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})
);

// app.get("/testlisting",async (req,res)=>{
//    let samplelisting=new Listing ({
//     title:"My new Villa",
//     description:"By the beach",
//     price:1200,
//     location:"Calangute,Goa",
//     country:"India",
//    });

//    await samplelisting.save();
//    console.log("sample was saved");
//    res.send("successful test");
// });



//incoming req will come then mathch all route available in above if find then send respond
// otherwise send this message


//http://localhost:3030/random
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

//error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})




app.listen(3030,()=>{
    console.log("server is listening");
});











// 1. Listing=>collection name hai dbs me,  const Listing = mongoose.model("Listing", listingSchema);


// 2.  const listing=await Listing.findById(id)=> db se find by bid krke return krega then "listing " me store hoga 
//      ye ek promise return krta hai so asynx await kre hai


//3.

// app.post("/listings",async (req,res,next)=>{
//     // let {title,description,image,price,country,location}=req.params
//     // let listing=req.body.listing;//listing ek object hai usko print kro,new.ejs me explain hai
//     // console.log(listing); 
    
//   try{                                                      
//     const newlisting=new Listing(req.body.listing);   //Listing schema hai jo instance create krega
//   await newlisting.save();
//   res.redirect("/listings");

//   } catch(err){
//     next(err);   //we are calling err for error handling
//   }

// });

