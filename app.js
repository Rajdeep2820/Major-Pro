const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("path", path.join(__dirname, "views"));
app.use(express.urlencoded(({ extended: true })));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")));


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected to DP");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
};
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
    // console.log( res.locals.success); // to find that success returned an empty array.
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.get("/", (req, res) => {
    res.send("I am Groott!");
})
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some Error Occured" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});


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
