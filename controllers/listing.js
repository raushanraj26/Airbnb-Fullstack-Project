//listing.js routes ka callbacks yaha defines hoga

//this file store the call back function of rotes/listing.js




const Listing = require("../models/listing.js");   //require listing.js file

//for users map according to their location,REFERENCE https://github.com/mapbox/mapbox-sdk-js
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');   // for mAP, 
const mapToken=process.env.MAP_TOKEN;
// const geocodingClient = mbxClient({ accessToken: mapToken });
const geocodingClient = mbxGeocoding({ accessToken: mapToken });





//index route callback
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};



//render new form
module.exports.renderNewForm=(req, res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
};



//show route (show listing)
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{       //hr listing k sth reviews aaye and hr reviews k sth uskas author nested populate hai,reviews me uska author ko populkate kro
        path:"author",
    },
})
    .populate("owner");// db me se find krega Listing.find(id) and jo v reviews hai us listing ke sth with details v show krna hai
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings")
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
};




//create route
module.exports.createListing= async (req, res, next) => {

    let response=await  geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    let url=req.file.path;   //cloudinar me jo image save hota hai uska full details dega
    let filename=req.file.filename;
    const newlisting = new Listing(req.body.listing);   //Listing schema hai jo instance create krega
    newlisting.owner = req.user._id;    //by default iska owner v save krenge
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry;    //geometry(map) me store kr rhe
   let savedListing= await newlisting.save();
    req.flash("success", "new List created");     //one time pop up show krega
    res.redirect("/listings");
};

//edit route
module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings")
    }
    let originalImageUrl=listing.image.url;
   originalImageUrl= originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing,originalImageUrl });
};


//update route
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
                         //ye authorization sb route kre loye check krna hai so midlleware bnaa do
    // let listing = await Listing.findById(id);   //authorization of listings
    // if (currUser && !listing.owner._id.equals(res.locals.currUser._id)) {     //check authorization and jo show.ejs(line 48 ) ko uncommnet kro
    //     req.flash("error", "you have dont have permission to edit");
    //     res.redirect(`/listings/${id}`);
    // }

    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
 if(typeof req.file !== "undefined"){  //if edit time image aaya ho,then isee save kro,otherwise same image hi rhne do
    let url=req.file.path;   //cloudinar me jo image save hota hai uska full details dega
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
 }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
};


//delete listing
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedlistings = await Listing.findByIdAndDelete(id);
    console.log(deletedlistings);
    req.flash("success", " Listing deleted");     //one time pop up show krega
    res.redirect("/listings");
};