const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");

// Index Route....// Create Route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createNewListing)
    );

// Show ROUTE....// Update Route....// Delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isOwner, validateListing, isLoggedIn, wrapAsync(listingController.saveEdit))
.delete(isOwner, isLoggedIn, wrapAsync(listingController.destroy))

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Edit Route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.editListing));

module.exports = router;