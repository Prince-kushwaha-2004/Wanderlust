if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}

const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const session=require('express-session'); //to store the session data
const MongoStore=require('connect-mongo');
const flash=require('connect-flash'); //to show the flash messages

const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");



const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

const dbUrl=process.env.ATLAS_URL

main() 
    .then(()=>{console.log("Server connected")})
    .catch(err => console.log(err));

async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
await mongoose.connect(dbUrl);
}


app.engine('ejs', ejsMate);
app.use(methodOverride("_method"))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true})); //to parse the form data from the request
app.use(express.static(path.join(__dirname,"/public"))); //to use static css files


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*60*60
}) //to store the session data in the mongoDB

store.on("error",function(e){
    console.log("Session store error",e);
})
const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
}

app.get("/",(req,res)=>{
    res.redirect("/listings"); 
})


app.use(session(sessionOption));
app.use(flash());

//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate method is provided by passportLocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})



app.use("/listings",listingsRouter)
app.use("/listings/:id/review",reviewsRouter)
app.use("/",usersRouter)


//error route
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})
//error handling middleware 
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Some thing went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("Server listning from port 8080");
});
 