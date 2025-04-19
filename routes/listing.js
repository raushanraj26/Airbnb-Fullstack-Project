//all routes are written here

// "../utils/wrapAsync.js"=>parent directory gye hai

const express = require("express");
const router = express.Router();
//comment because middleware.js me iska code ko likh diye yaha koi use ni hai
// const { listingSchema, reviewSchema } = require("../schema.js");   //require for server side listing and review schema validation
// const ExpressError = require("../utils/ExpressError.js");   //require for error handling  
const Listing = require("../models/listing.js");   //require listing.js file
const wrapAsync = require("../utils/wrapAsync.js");   //require for error handling
const { isLoggedIn,isOwner,validateListing} = require("../midlleware.js");      //user authenticate ke liye,sb route pe likhna hota so,create common middleware
const listingController=require("../controllers/listing.js");   //which controls the callback of every rote



// Multer is a node.js middleware for handling multipart/form-data,
//  which is primarily used for uploading files. It is written on top of busboy for maximum efficiency
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");             //isi folder me image aake save hogi
const upload = multer({storage });   //multer hmare cloudianry ke storage me image ko save kregi








//index route
                                //   listingController ka single file chaheye jon index hai
router.get("/", wrapAsync(listingController.index));    //index function ("../controllers/listing.js"); yaha defined hai,for easy readable



//new route(create new listing)
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route(show details of specific listing)
router.get("/:id", wrapAsync(listingController.showListing));



//create route(new.ejs se post method aa rha add krne pe)
//validateListing middleware u=yaha pass hua hai
router.post("/", isLoggedIn,
    upload.single('listing[image]'),validateListing,              
    wrapAsync(listingController.createListing)
);


// //jo v listing image upload krenge uska details dega ye---->yahi chij upar wale route me ho jaayega
// router.post("/",upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// });


//edit route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//incoming req will come then mathch all route available in above if find then send respond
// otherwise send this message

//update route
router.put("/:id", isLoggedIn,isOwner,  upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing));


//delete route
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


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






//create route(new.ejs se post method aa rha add krne pe)
//validateListing middleware u=yaha pass hua hai
router.post("/", validateListing,
    wrapAsync(async (req, res, next) => {
        const newlisting = new Listing(req.body.listing);   //Listing schema hai jo instance create krega
        await newlisting.save();
        res.redirect("/listings");
    })
);


//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})
);


//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully");     //one time pop up show krega
    res.redirect(`/listings/${id}`);
})
);


//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedlistings = await Listing.findByIdAndDelete(id);
    console.log(deletedlistings);
    res.redirect("/listings");
})
);


module.exports = router;