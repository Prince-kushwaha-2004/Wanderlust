const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //geocoding service from mapbox
const mapTocken = "pk.eyJ1IjoicHJpbmNlMTIxa2siLCJhIjoiY20zMDZ3dW03MGd4djJsc2M2dGg1bTd2MSJ9.2Lu2Yrj2eRRguHvh4OAaoA";
console.log(mapTocken)
const geocodingClient = mbxGeocoding({ accessToken: mapTocken }); //initiate geocoding using the mapbox token

const dburl="" //add your dburl here

main() 
    .then(()=>{console.log("Server connected")})
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

const initDB = async ()=>{
  initData.data=initData.data.map((obj)=>({...obj,owner:'67268cc4c34a1a861b8b3943'}))
  initData.data=await initData.data.map(async (obj)=>{
    let geoData = await geocodingClient.forwardGeocode({
      query: obj.location,
      limit: 1
    }).send();
    obj.geometry =geoData.body.features[0].geometry;
    // console.log(obj)
    return obj;
  })
    initData.data=await Promise.all(initData.data); //wait for all the promises to resolve
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();