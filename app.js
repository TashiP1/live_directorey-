const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const homeRoute = require("./routes/homeRoute");
const bcrypt = require("bcrypt");
const csrf = require("csurf");
const User = require("./models/dailyNote");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit"); 

const app = express();
const dbURI = "mongodb+srv://tashi:12345@cluster123.x9dv8.mongodb.net/";

mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

const loginLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 3, // Limit each IP to 5 requests per 30 seconds
  message: "Too many login attempts. Please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Session setup
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false }
  })
);

// Dummy user credentials
// const user = { username: "admin", password: "password" };

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123", // Hardcoded password for admin
};

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

app.use(csrfProtection);

// Login Page
app.get("/login", (req, res) => {
  res.render("login", { error: null, csrfToken: req.csrfToken() });
});

// Apply loginLimiter middleware here
app.post("/login", loginLimiter, csrfProtection, async (req, res) => {
  const { username, password } = req.body;

  // Check if the rate limit is exceeded
  if (req.rateLimit && req.rateLimit.remaining === 0) {
    return res.render("login", { 
      error: "You have reached the maximum number of login attempts. Please try again later after 30 seconds.",
      csrfToken: req.csrfToken() 
    });
  }

  try {
    // Hardcoded admin check
    if (username === "admin" && password === "admin123") {
      req.session.user = username;
      return res.redirect("/"); // Redirect to the admin dashboard
    }

    // Check in the database
    const user = await User.findOne({ uname: username });

    if (user && await bcrypt.compare(password, user.pass)) {
      req.session.user = user.uname;
      return res.redirect("/user"); // Redirect to the user dashboard
    } else {
      return res.render("login", { error: "Invalid username or password", csrfToken: req.csrfToken() });
    }
  } catch (err) {
    console.log(err);
    return res.render("login", { error: "An error occurred. Please try again.", csrfToken: req.csrfToken() });
  }
});


// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/about", requireAuth, (req, res) => {
  res.render("about", { title: "About" });
});

// Apply `requireAuth` middleware to protect routes
app.use("/", requireAuth, homeRoute);

// 404 Page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
