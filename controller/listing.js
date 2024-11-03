const Listing = require('../models/listing.js')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //geocoding service from mapbox
const mapTocken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapTocken }); //initiate geocoding using the mapbox token


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}
module.exports.renderListingform = (req, res) => {
    res.render("listings/new.ejs");
}
module.exports.createNewListing = async (req, res, next) => {
    let geoData = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    const newlisting = new Listing(req.body);
    newlisting.owner = req.user._id;
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        newlisting.image = { url, filename };
    }
    newlisting.geometry =geoData.body.features[0].geometry;
    savedlisting=await newlisting.save();
    console.log(savedlisting)
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");

}
module.exports.renderEditListingPage = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id);
    if (!data) {
        req.flash("error", "Cannot find the listing");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { data });
}
module.exports.editListing = async (req, res) => {
    let geoData = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    let { id } = req.params;
    newlisting = await Listing.findByIdAndUpdate(id, { ...req.body });
    newlisting.geometry =geoData.body.features[0].geometry;
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        newlisting.image = { url, filename };
    }
    await newlisting.save();
    req.flash("success", "Successfully updated the listing");
    res.redirect(`/listings/${id}`)
}
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (data) {
        console.log(data)
        res.render("listings/show.ejs", { data });
    } else {
        req.flash("error", "Cannot find the listing");
        res.redirect("/listings");
    }

}
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "Successfully deleted the listing");
    res.redirect("/listings");
}