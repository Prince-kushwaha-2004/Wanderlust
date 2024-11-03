const mongoose=require("mongoose");
const Schema=mongoose.Schema; 
const passwordLocalMongoose = require('passport-local-mongoose');

const userSchema=new Schema({
    email:{
        type:String,
        required:true,  
    }
});
                            
userSchema.plugin(passwordLocalMongoose); //this will add username and password fields to the schema
module.exports=mongoose.model("User",userSchema); //exporting the model