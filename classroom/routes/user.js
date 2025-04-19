 const express=require("express");
 const router=express.Router();


//    ---for users---


// //index route
// router.get("/",(req,res)=>{
//     res.send("get for users");
// })

//show route
router.get("/:id",(req,res)=>{
    res.send("get user");
})

// post route
router.post("",(req,res)=>{
    res.send("post user");
})

//delete route
router.delete("/:id",(req,res)=>{
    res.send("delete for user id");
})

module.exports=router;