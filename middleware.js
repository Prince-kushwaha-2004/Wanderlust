const Listing = require("./models/listing");
const Review=require("./models/review")
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash("error","You must be Loged in to access this");
        return res.redirect("/login");
    }
    next();
}
module.exports.redirectUrl=(req,res,next)=>{
        res.locals.redirecturl=req.session.returnTo||"/listings";
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not authorized to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing =(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};
module.exports.validateReview =(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};
module.exports.isReviewOwner=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    newReview=await Review.findById(reviewId);
    if(!newReview.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

