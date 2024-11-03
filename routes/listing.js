const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js")


const multer  = require('multer')  //multer is a middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage }) //multer({ storage }) is a middleware that will process the file and store it in the cloudinary storage


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('image'), //upload.single('image') is a middleware that will process the file and store it in the cloudinary storage. The file will be stored in the req.file object
        validateListing,
        wrapAsync(listingController.createNewListing)
    );
   

//create route
router.get("/new", isLoggedIn, listingController.renderListingform)

//update route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditListingPage))

router
    .route("/:id")
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single('image'),
        validateListing,
        wrapAsync(listingController.editListing))
    .get( wrapAsync(listingController.showListing))
    .delete(isOwner, isLoggedIn, wrapAsync(listingController.deleteListing))

module.exports = router;