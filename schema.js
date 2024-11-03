//joischema for server side validation of the data that is being sent to the server
const Joi = require('joi');
module.exports.listingSchema = Joi.object({
        title:Joi.string().required(),
        description : Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        url:Joi.string().allow("",null),

});
module.exports.reviewSchema = Joi.object({
    rating: Joi.number()
        .required()
        .min(1)
        .max(5),
    
    comment: Joi.string()
        .required()
});