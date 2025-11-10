const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, error);
    }
    else {
        next();
    }
};

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
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

// Show ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing doesn't exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}));

// Edit Route
router.get("/:id/edit", isLoggedIn , wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
router.put("/:id", validateListing, isLoggedIn , wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect("/listings");
}));
// Delete route
router.delete("/:id", isLoggedIn , wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;