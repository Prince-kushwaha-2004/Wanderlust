const Listing = require('../models/listing.js')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //geocoding service from mapbox
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); //initiate geocoding using the mapbox token


module.exports.index = async (req, res) => {
    let filter = {};
    if (req.query.category && req.query.category !== "") {
        filter.category = req.query.category;
    }
    if (req.query.search && req.query.search.trim() !== "") {
        const searchRegex = new RegExp(req.query.search.trim(), "i");
        filter.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex }
        ];
    }
    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", {
        allListings,
        selectedCategory: req.query.category || "",
        searchQuery: req.query.search || ""
    });
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
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        newlisting.image = { url, filename };
    }
    newlisting.geometry = geoData.body.features[0].geometry;
    savedlisting = await newlisting.save();
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
    newlisting.geometry = geoData.body.features[0].geometry;
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
        res.render("listings/show.ejs", { data });
    } else {
        req.flash("error", "Cannot find the listing");
        res.redirect("/listings");
    }

}
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing");
    res.redirect("/listings");
}