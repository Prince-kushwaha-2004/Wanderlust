const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //geocoding service from mapbox
const mapToken = process.env.MAP_TOKEN;
console.log(mapToken)
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); //initiate geocoding using the mapbox token

const dburl = process.env.ATLAS_URL || "mongodb://127.0.0.1:27017/wanderlust"; // fallback to local

main() 
    .then(()=>{console.log("Server connected")})
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

function getCategory(title, description) {
  const t = (title || "").toLowerCase();
  const d = (description || "").toLowerCase();
  
  if (t.includes("beach") || d.includes("beach") || t.includes("ocean") || d.includes("ocean")) return "Beach";
  if (t.includes("ski") || d.includes("ski") || t.includes("arctic") || d.includes("arctic") || t.includes("snow") || d.includes("snow")) return "Arctic";
  if (t.includes("mountain") || d.includes("mountain") || t.includes("alpine") || d.includes("alpine") || t.includes("slopes")) return "Mountains";
  if (t.includes("pool") || d.includes("pool") || t.includes("swim")) return "Amazing Pool";
  if (t.includes("castle") || d.includes("castle") || t.includes("palace") || t.includes("historic") || d.includes("historic")) return "Castles";
  if (t.includes("farm") || d.includes("farm") || t.includes("cottage") || d.includes("cottage") || t.includes("rustic") || d.includes("rustic")) return "Farms";
  if (t.includes("island") || d.includes("island") || t.includes("fiji") || t.includes("maldives")) return "Island";
  if (t.includes("camp") || d.includes("camp") || t.includes("treehouse") || d.includes("treehouse") || t.includes("tent") || t.includes("cabin") || d.includes("cabin")) return "Camping";
  if (t.includes("loft") || d.includes("loft") || t.includes("apartment") || d.includes("apartment") || t.includes("room") || d.includes("room")) return "Rooms";
  if (t.includes("city") || d.includes("city") || t.includes("downtown") || d.includes("downtown") || t.includes("tokyo") || t.includes("boston") || t.includes("amsterdam")) return "Iconic City";
  if (t.includes("safari") || d.includes("safari") || t.includes("desert") || d.includes("desert") || t.includes("dubai") || t.includes("phuket") || t.includes("bali")) return "Foreign Trip";
  
  return "Trending";
}

const initDB = async ()=>{
  initData.data=initData.data.map((obj)=>({
    ...obj,
    owner:'67268cc4c34a1a861b8b3943', // static owner id for seed
    category: getCategory(obj.title, obj.description)
  }))
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