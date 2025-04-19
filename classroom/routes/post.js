const express=require("express");
 
const router=express.Router();

// replace router with router 


// ---for posts--






//index route
router.get("/",(req,res)=>{
   res.send("get for users");
})

// //show route
// router.get("/:id",(req,res)=>{
//    res.send("get posts id");
// })

// post route
router.post("",(req,res)=>{
   res.send("post for posts id");
})

//delete route
router.delete("/:id",(req,res)=>{
   res.send("delete for post id");
})


module.exports=router;