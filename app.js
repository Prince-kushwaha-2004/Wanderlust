if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session'); //to store the session data
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); //to show the flash messages

const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");



const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

const dbUrl = process.env.ATLAS_URL

main()
    .then(() => { console.log("Server connected") })
    .catch(err => console.log(err));

async function main() {
    //   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

    await mongoose.connect(dbUrl);
}


app.engine('ejs', ejsMate);
app.use(methodOverride("_method"))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //to parse the form data from the request
app.use(express.static(path.join(__dirname, "/public"))); //to use static css files

const sessionOption = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionOption));
app.use(flash());

//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //authenticate method is provided by passportLocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.mapToken = process.env.MAP_TOKEN;
    next();
})

app.get("/", async (req, res) => {
    try {
        const Listing = require("./models/listing.js");
        const featuredListings = await Listing.find({}).limit(3);
        res.render("landing.ejs", { featuredListings });
    } catch (err) {
        res.status(500).render("error.ejs", { message: "Failed to load the landing page." });
    }
});



app.use("/listings", listingsRouter)
app.use("/listings/:id/review", reviewsRouter)
app.use("/", usersRouter)


//error route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})
//error handling middleware 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some thing went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listing from port ${port}`);
});
