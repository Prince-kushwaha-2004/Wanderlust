const Listing=require('../models/listing.js')
const Review=require('../models/review.js')

module.exports.addReview=async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview= new Review(req.body);
    listing.reviews.push(newReview);
    newReview.author=req.user._id;
    await newReview.save();
    await listing.save();
    console.log(newReview);
    req.flash("success","Successfully added review");
    res.redirect(`/listings/${req.params.id}`)
}
module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted review")
    res.redirect(`/listings/${id}`)    
}