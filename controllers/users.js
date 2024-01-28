const User = require("../models/users.js");

module.exports.renderSignUp = (req, res) => {
  res.render("users/signup.ejs");
};
module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({
      username: username,
      email: email,
    });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To WanderLus!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/user/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome Back To WanderLust");
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged you out!");
    res.redirect("/listings");
  });
};
