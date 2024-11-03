const mongoose=require("mongoose");
const Schema=mongoose.Schema; 
const Review=require("./review.js");
const User=require("./user.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        filename: { type: String },
        url: { type: String, default:"https://th.bing.com/th/id/R.d5c5f2246919265f53e6f56f80071dd3?rik=Q7O1od8exJDnbQ&riu=http%3a%2f%2fcdn.wallpapersafari.com%2f37%2f82%2fBI78kU.jpg&ehk=yP98fVqkFdzsxnJdZ17FmIQKByMdglW%2bEUXxXB7Mf6o%3d&risl=&pid=ImgRaw&r=0"},
    },
    price:Number,
    location:String,
    country:String,

    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review',
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    }
});

//delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}}); //delete all reviews whose id is in the listing.reviews array
    }
})

const Listing=mongoose.model("Listing",listingSchema); //model name is Listing and schema is listingSchema
module.exports=Listing; //exporting the model