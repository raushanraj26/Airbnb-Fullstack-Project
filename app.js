

// <!-- --THIS IS THE MAIN FILE--- -->


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");   //require listing.js file
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');








 
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




  






//index route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

  //new route(create new listing)
  app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
  });

//show route(show details of specific listing)
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);// db me se find krega Listing.find(id)
    res.render("./listings/show.ejs",{listing});
});
 

//create route(new.ejs se post method aa rha add krne pe)
  app.post("/listings",async (req,res)=>{
    // let {title,description,image,price,country,location}=req.params
    // let listing=req.body.listing;//listing ek object hai usko print kro,new.ejs me explain hai
    // console.log(listing); 
  const newlisting=new Listing(req.body.listing);   //Listing schema hai jo instance create krega
  await newlisting.save();
  res.redirect("/listings");

});


//edit route
app.get("/listings/:id/edit", async (req,res)=>{
    let {id}=req.params;
    const listing=await  Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});


//update route
app.put("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});


//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedlistings=await Listing.findByIdAndDelete(id);
    console.log(deletedlistings);
    res.redirect("/listings");
})


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



app.listen(3030,()=>{
    console.log("server is listening");
});











// 1. Listing=>collection name hai dbs me,  const Listing = mongoose.model("Listing", listingSchema);


// 2.  const listing=await Listing.findById(id)=> db se find by bid krke return krega then "listing " me store hoga 
//      ye ek promise return krta hai so asynx await kre hai



