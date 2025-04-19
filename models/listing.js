//here we create schema or model and export it then we require in app.js file



const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");
const { ref, string } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
    maxLength: 500  // Increased max length for longer descriptions
},







                                          //  image: {
                                          //    type: String,
                                              
                                          //    default:
                                          //      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
                                          //    set: (v) =>
                                          //      v === ""
                                          //        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                                          //        : v,
                                             
                                          //  },

    
    image: {
      //   filename : String,
      // url: {
      //     type: String,
      //     default: 'https://images.unsplash.com/photo-1631988700156-0920ca45c8b9?q=80&w=2070&auto=format&fit' +
      //         '=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      // }
      url:String,
      filename:String,
  },
  price: {
      type: Number,
      required: true,
      min: 0
  },
  location: {
      type: String,
      required: true
  },
  country: {
      type: String,
      required: true
  },
  reviews: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Review'  // Reference to Review model
      }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required:  false //true
    },
    coordinates: {
      type: [Number],
      required: false   //true
    }
  }
    
  
});


// jb v kisi review ko dlt krna hoga toh as a middleware ye post req execute hoga
listingSchema.post("findOneAndDelete",async (listing)=>{
    if (listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
    
  })


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;