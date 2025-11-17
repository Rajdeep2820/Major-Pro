const express = require("express")
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js")
const Listing = require("../models/listings.js")
const { validateReview } = require("../middleware.js");

//Reviews Routes
router.post("/", validateReview, wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    //console.log(req.body);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success" , "Review Added!");
    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted!");
    res.redirect(`/listings/${id}`);

}))

module.exports = router;