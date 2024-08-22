const express = require("express");
const passport = require("passport");
const config = require("../config/configs");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const morgan = require("morgan");
const router = express.Router();
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    test: {},
    test2: String
  })
);
// Use morgan to log requests
router.use(morgan("combined"));

router.use(
  session({
    secret: config.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID ||
        "329932494226-rkpausht5lbbm9umvspatt9973pco2q6.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        "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",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile);
        const user = new User({
          test: profile,
          test2: JSON.stringify(profile)
        });
        await user.save();
      console.log("Authenticated User:", user);
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

router.get(
  "/auth/google",
  (req, res, next) => {
    console.log("Auth Request to Google:", req.url);
    next();
  },
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.readonly",
    ],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(`influmart://auth?token=${req.user.token}`);
  }
);

module.exports = router;
