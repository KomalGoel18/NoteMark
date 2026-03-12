const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const generateToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

/* ================= GOOGLE ================= */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://notemark-api.onrender.com/api/auth/google/callback"
          : "/api/auth/google/callback",
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
          });
        }

        const token = generateToken(user);

        return done(null, { token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

/* ================= GITHUB ================= */

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,

      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://notemark-api.onrender.com/api/auth/github/callback"
          : "/api/auth/github/callback",

      scope: ["user:email"], // ⭐ REQUIRED
    },
    async (_, __, profile, done) => {
      try {
        // GitHub may not return email by default
        const email =
          profile.emails?.[0]?.value ||
          `${profile.username}@github.com`;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username,
            email,
          });
        }

        const token = generateToken(user);

        return done(null, { token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);