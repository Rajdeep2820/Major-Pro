const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listings.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
app.set("view engine" , "ejs")
app.set("path" , path.join(__dirname , "views"));
app.use(express.urlencoded(({extended : true})));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DP");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(8080, ()=>{
    console.log("Server is listening to port 8080");
})
// listings
app.get("/listings" , wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings})
}));

// create route
app.get("/listings/new" , (req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings" , wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing.");
    }
    await newListing.save();
    res.redirect("/listings");
}));

// Listing detail
app.get("/listings/:id" , wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing})
}));

app.get("/listings/:id/edit" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
}));

app.put("/listings/:id" , wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

app.delete("/listings/:id" , wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));
// app.get("/testListing" , async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "A Guide To Italy’s Amazing Lake Como",
//         description : "Lake Como is one of those dreamy places that exceeds expectations, a veritable Italian operatic stage set of villas and garden follies on a lake fringed by the Alps.",
//         image : "",
//         price : 2000,
//         country : "Italy"

//     })

//     await sampleListing.save();
//     console.log("sample listing saved");
//     res.send("Succesful");
// })

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message="Some Error Occured"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs" , {message});
}); 

app.get("/" , (req,res)=>{
    res.send("I am Groott!");
})