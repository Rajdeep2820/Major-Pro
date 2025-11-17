const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");


// Index Route 
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));

// New Route
router.get("/new", isLoggedIn , (req, res) => {
    res.render("listings/new.ejs");
});

// Create Route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing.");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400, "Send valid description for listing.");   
    // }
    // if(!newListing.title){
    //     throw new ExpressError(400, "Send valid title for listing.");   
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400, "Send valid description for listing.");   
    // }
    // let result = listingSchema.validate();
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

// Show ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing doesn't exist!");
        return res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing })
}));

// Edit Route
router.get("/:id/edit",isOwner, isLoggedIn , wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
router.put("/:id",isOwner, validateListing, isLoggedIn , wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect("/listings");
}));
// Delete route
router.delete("/:id", isOwner , isLoggedIn , wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;