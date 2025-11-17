const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");

// Index Route 
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create Route
router.post("/", validateListing, wrapAsync(listingController.createNewListing));

// Show ROUTE
router.get("/:id", wrapAsync(listingController.showListing));

// Edit Route
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.editListing));

// Update Route
router.put("/:id", isOwner, validateListing, isLoggedIn, wrapAsync(listingController.saveEdit));

// Delete route
router.delete("/:id", isOwner, isLoggedIn, wrapAsync(listingController.destroy));

module.exports = router;