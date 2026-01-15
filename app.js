const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const homeRoute = require("./routes/homeRoute");
const User = require("./models/newUser");
const Admin = require("./models/adminModel");

const app = express();
const PORT = 3000;
const dbURI = process.env.MONGODB_URI;

mongoose
  .connect(dbURI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.error("Database connection error:", err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

const loginLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 3,
  message: "Too many login attempts. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false },
  })
);

app.use((req, res, next) => {
  if (!req.session.actions) {
    req.session.actions = [];
  }
  next();
});

const logAction = (req, action) => {
  const username = req.session.user || "Guest"; 
  if (req.session.actions) {
    req.session.actions.push({
      action,
      username,
      timestamp: new Date().toISOString(),
    });
  }
};

const saveLogFile = (req) => {
  if (req.session.actions && req.session.actions.length > 0) {
    const username = req.session.user || "guest"; 
    const date = new Date().toISOString().split("T")[0]; 

    const logFile = path.join(
      __dirname,
      "logs",
      `${username}_${date}_${Date.now()}.log`
    );

    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.writeFileSync(logFile, JSON.stringify(req.session.actions, null, 2));
  }
};

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

app.get("/login", (req, res) => {
  res.render("login", { error: null, csrfToken: req.csrfToken() });
});

app.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (admin && await bcrypt.compare(password, admin.password)) {
      req.session.user = username;
      logAction(req, "Admin logged in");
      return res.redirect("/");
    }

    const user = await User.findOne({ uname: username });
    if (user && await bcrypt.compare(password, user.pass)) {
      req.session.user = user.uname;
      logAction(req, "User logged in");
      return res.redirect("/user");
    }

    res.render("login", {
      error: "Invalid username or password",
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.error(err);
    res.render("login", {
      error: "An error occurred. Please try again.",
      csrfToken: req.csrfToken(),
    });
  }
});

app.get("/logout", (req, res) => {
  saveLogFile(req);
  req.session.destroy(() => res.redirect("/login"));
});

app.get("/about", requireAuth, (req, res) => {
  logAction(req, "Visited About Page");
  res.render("about", { title: "About" });
});

app.use("/", requireAuth, homeRoute);

app.use((req, res) => {
  logAction(req, "Visited 404 Page");
  res.status(404).render("404", { title: "404" });
});
