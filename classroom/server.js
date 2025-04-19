// this folder is similar to app.js

const express=require("express");
const app=express();
const users=require("./routes/user.js")
const posts=require("./routes/post.js")
const cookieParser=require("cookie-parser");   //require cookie parser\
const path=require("path");

//require express session
const session=require("express-session");
//require connect flash
const flash=require("connect-flash");
app.use(flash());
//jo flash krenge use ejs ke help se show krenge
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));









// app.use("/users",users);   //user.js file ka common routes
// app.use("/posts",posts);   //post.js file ka common routes





                                        // --example of signed cookie--





// //http://localhost:3000/getsignedcookie
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","india",{signed:true});
//     res.send("signed cookie sent");
// });

// app.get("/verify",(req,res)=>{
//     // console.log(req.cookies);
//     console.log(req.signedcookies);
// })











                                                     // ----------------------













// app.use(cookieParser());   //cookieparser middleware



// //index rote
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);  //index rote pe v show krega cookie,show wahi krega jo pahle se cookies store hoga
//     res.send("I am root");
// })


// app.get("/greet",(req,res)=>{
//     let {name="Raushan"}=req.cookies;   //inspects se cookies input de skte ho
//     res.send(`hi,${name}`);
// })


// //sending cookies
// // go inspect->application->cookies
// // hrr route ke pe ye cookies show hoga
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("origin","india");
//     res.send("sent you some cookie");
// })




     //    ---for users---



// //index route
// app.get("/users",(req,res)=>{
//     res.send("get for users");
// })

// //show route
// app.get("/users/:id",(req,res)=>{
//     res.send("get user");
// })

// // post route
// app.post("/users",(req,res)=>{
//     res.send("post user");
// })

// //delete route
// app.delete("/users/:id",(req,res)=>{
//     res.send("delete for user id");
// })




//                                       // ---for posts--






// //index route
// app.get("/posts",(req,res)=>{
//     res.send("get for users");
// })

// //show route
// app.get("/posts/:id",(req,res)=>{
//     res.send("get posts id");
// })

// // post route
// app.post("/posts",(req,res)=>{
//     res.send("post for posts id");
// })

// //delete route
// app.delete("/posts/:id",(req,res)=>{
//     res.send("delete for post id");
// })









                                                     // --- topic:-Express Session---
                                                    //  npm package so install it "npm i express-session"













//express session is middleware
// app.use(session( {secret:"mysupersecretstring",resave:false,saveUninitialized:true}));

const sessionOption={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionOption));



//test route
// app.get("/test",(req,res)=>{
//     res.send("test successful");
// });


//req count
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//                req.session.count++;
//     }
//     else{
//      req.session.count=1;
//     }

//     res.send(`you sent a request ${req.session.count} times`);
    
// });


  //storing and using session info


  //http://localhost:3000/register?name=Raushan
  app.get("/register",(req,res)=>{
    let {name="Anoynmous"}=req.query;
    // console.log(req.session);
    // res.send(name);
    req.session.name=name;
    // console.log(req.session.name);
    // Use req.flash() instead of res.flash(), because flash messages are stored in the request (req), not the response (res).
   
   if(name==="Anoynmous"){
    req.flash("error","some error");
   }else{
    req.flash("success","user registered successfully");   //using connect flash
   }
   res.redirect("/hello"); 

  });

  app.get("/hello",(req,res)=>{
    // res.send(`hello,${req.session.name}`);        //req.session.name upr wale me store kre and yaha isko use kr rhe hai
    // res.render("page.ejs",{name:req.session.name,msg:req.flash("success")});  
    // res.locals.messages=req.flash("success");
    res.locals.successmsg=req.flash("success");
    res.locals.errormsg=req.flash("error"); 
    res.render("page.ejs",{name:req.session.name});
})

//middleware use kr skyte hai,ise upr me likh do

// app.use((Req,res,next)=>{
//   res.locals.successmsg=req.flash("success");
//   res.locals.errormsg=req.flash("error"); 
//   next();
// });





//   ---connect flash---




app.listen(8000,()=>{
    console.log("server is listing...");
})