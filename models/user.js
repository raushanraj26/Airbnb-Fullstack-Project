//for user authentication
// we use passport,passport-localStorage,passport-local-mongoose-package




const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');



// Passport-Local Mongoose will add a username, 
// hash and salt field to store the username, 
// the hashed password and the salt value.
// isiliye humlog passport-local-mongoose use kr rhe HTMLDetailsElement(automatically generate kr rha)
// so hum username nii denge

const userSchema =new Schema ({
    email:{
        type:String,
        required:true
    }
})





userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);