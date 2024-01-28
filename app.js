if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
  console.log(process.env.SECRET);
}
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const path = require("path");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
// deleted joi required
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const dbUrl = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});

app.get("/", (req, res) => {
  res.send("Server is working fine");
});


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 2400 * 3600,
});

store.on("error",()=>{
  console.log("Error in store",err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// User Route
app.use("/user", userRouter);
// Listing Route
app.use("/listings", listingRouter);
// Reviews Route
app.use("/listings/:id/reviews", reviewRouter);

// error handelling
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Some Error Occured" } = err;
  res.render("layouts/error.ejs", { message });
  next();
});
