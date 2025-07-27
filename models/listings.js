const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
    type : String,
    required : true
    },
    description :{
    type : String,
    required : true
    },
    image : {
        type : String,
        default : 
        "https://specials-images.forbesimg.com/imageserve/646b6b45d9b20ac15900fd8a/Oleander-flowers-and-villa-Monastero-in-background--lake-Como--Varenna/960x0.jpg?fit=scale",
        set : (v) => v === "" ? "https://specials-images.forbesimg.com/imageserve/646b6b45d9b20ac15900fd8a/Oleander-flowers-and-villa-Monastero-in-background--lake-Como--Varenna/960x0.jpg?fit=scale" : v,
    },
    price : Number,
    location : String,
    country : String,
});

const Listing  = mongoose.model("Listing" , listingSchema);
module.exports = Listing;