
const User=require("../models/user");







//render signup form
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");            //form render kre qki apna required information de form me
};

//post route
module.exports.signup=async(req,res)=>{
   
    try {
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{   //login after signup (read it)->https://www.passportjs.org/concepts/authentication/login/
        if(err){
            //signup ke bdd registerUser  ka details lenen ke bdd verify krke direct login kr dega 
            return next(err); 
        }
        //successful registerd hoga then 
        req.flash("success","welcome to wanderlust");
         res.redirect("/listings");
    });
    // req.flash("success","welcome to wanderlust");
    // res.redirect("/listings");
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    } 
}

//render login form
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");            //form render kre qki apna required information de form me
};


//user login
module.exports.loginUser=async(req, res)=> {
    // res.send("welcom to wanderlust ! you are logged in");
    req.flash("success","welcom back to wanderlust ! ");
    // res.redirect("/listings");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    // res.redirect(req.session.redirectUrl);  //user jis jis ko access krna chah rha tha,usi pe redirect kr do login krnwane ke bdd
}

//logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{ //logout ke immendiate kya krna hai wahi pass krte hai
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");

    })
};