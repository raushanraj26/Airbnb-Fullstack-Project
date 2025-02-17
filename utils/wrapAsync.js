//this file is for custom wrapasync error handling


//async funct ko handle krte hai so jaha v async func hai waha wrapAsync handle lgaa do


// function wrapAsync(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }



module.exports= (fn)=>{ 
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
};




// ------for understanding, app.js file ----



// create route in this.apply.js
// you can handle this berror by try and catchj also

//create route(new.ejs se post method aa rha add krne pe)

// app.post("/listings",async (req,res,next)=>{
//     // let {title,description,image,price,country,location}=req.params
//     // let listing=req.body.listing;//listing ek object hai usko print kro,new.ejs me explain hai
//     // console.log(listing); 
//     error cand be handle by try and catch also
//   try{                                                      
//     const newlisting=new Listing(req.body.listing);   //Listing schema hai jo instance create krega
//   await newlisting.save();
//   res.redirect("/listings");

//   } catch(err){
//     next(err);   //we are calling err for error handling
//   }

// });
