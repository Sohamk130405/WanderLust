const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  renderSignUp,
  renderLogin,
  logout,
  signUp,
  login,
} = require("../controllers/users.js");

// signup route
router.route("/signup").get(renderSignUp).post(wrapAsync(signUp));

// login route
router
  .route("/login")
  .get(renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/user/login",
      failureFlash: true,
    }),
    login
  );

// logout route
router.get("/logout", logout);

module.exports = router;
