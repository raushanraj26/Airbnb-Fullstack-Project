
// db.reviews.deleteMany({})
// <!-- --THIS IS THE MAIN FILE--- -->

// username:-Raushan112345   for this login
// Kundan,new



// Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
//  Storing configuration in the environment separate from code is based on The Twelve-Factor App methodology.


if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}
// console.log(process.env.SECRET) 

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ExpressError=require("./utils/ExpressError.js");   //require for error handling
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
const wrapAsync=require("./utils/wrapAsync.js");   //require for error handling
const {listingSchema,reviewSchema}=require("./schema.js");   //require for server side listing and review schema validation
const Listing = require("./models/listing.js");   //require listing.js file
const Review = require("./models/review.js");   //require review.js file
const flash=require("connect-flash");     //require connect flash

//for user authentication
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");










const listingRouter=require("./routes/listing.js");     //all routes of listing are written in this file
const reviewRouter=require("./routes/review.js");  //for review index
const userRouter=require("./routes/user.js");  //for user signup 

const session=require("express-session");   //require session express


 
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



















//define express session (cookie)
const sessionOption={
    secret:"mysupersecret",
    resave:false,
    saveUnitialized:true,
    cookie:{
        //cookie kitna din tk store rhega,abd expirate date mention krenge
        expires:Date.now()+7*24*60*60*1000,  //from now till 78 days
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
    };

    // app.get("/",(req,res)=>{
    //     res.send("i am root");
    // });


    
    app.use(session(sessionOption));   //user ko ek session  me ek br hi verify krenge
    app.use(flash());
 

    //user authentication
 app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   //user jo model create kre use pass krenge
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
    
    
//locals middleware defined here
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");   // yaha flash ko use kr rhe jo listingSchema.js ke router.post("/" ) defined hai so
   res.locals.error=req.flash("error");
   res.locals.currUser=req.user; //user exist or not,if exit then show only logout button,otherwise login and signup,isko direct use ni krte navbar me,thta
                                    // thats why we use in local
                                    //current user ka information store krega

    next();
});


// //demo user authentication->new fake user create krnege and db me register krnge by register method
// app.get("/demouser",async (req,res)=>{
//     let fakeuser=new User({
//         email:"abdc@gmail.com",
//         username:"delta-student"
//     });
//    let registeredUser= await User.register(fakeuser,"helloworld");  //register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique.
//   res.send(registeredUser);                                              //take reference from passport local mongoose npm
// })













//itna part hr route me common hai so yaha include kre hai

app.use("/listings",listingRouter);  //iske yaha se sb routes routes folder ke listing.js me jaayega

//for reviews=>/listings/:id/reviews itna part common hai so include kre hai
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)







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




app.listen(9090,()=>{
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

