//server side schema 
//using joi api  for server side scehma validation
//prefer https://joi.dev/api/

const Joi = require('joi');
//jis schemqa ko validate krna uska name mention kro so i want to validate listing schema

// const listingSchema = Joi.object({
module.exports. listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
    }).required(),
});



//server side pe review(comment and rating ) ko validate krnege


module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5 ),
        comment:Joi.string().required(),
    }).required(),
});