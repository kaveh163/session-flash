const port = process.env.PORT || 3000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const flash = require("flash");
// const Router = require("router");
const app = express();
// const router = Router();
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.set("trust proxy", 1);
app.use(cookieParser("secret"));
app.use(
  session({
    secret: "fd34s@!@dfa453f3DF#$D&W",
    resave: false,
    saveUninitialized: true,
    cookie: {
      path: "/",
      secure: false,
      httpOnly: true,
      maxAge: 30 * 30000
    },
    rolling: true,
  })
);
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.use(flash());

// app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));
// app.use(router);



app.post("/login", function (req, res, next) {
  // console.log("name", req.body.name1);
  req.session.name = req.body.name1;
  // req.session.refresh = true;

  res.locals.flash = [];
  req.flash("success", "Successfully logged in.");
  // res.redirect("/home");
  // res.send("Hello");
  req.session.flash = res.locals.flash;
  res.redirect("./login.html");
  // res.sendFile(__dirname + "/index.html");
});
app.get("/flash", function (req, res) {
  let flashMess = req.session.flash;
  req.session.flash = [];
  res.json({
    mess: flashMess
  });
});
// app.get("/", function(req, res) {
//   res.sendFile(__dirname + "/index2.html");
// })
app.get("/try", function (req, res) {
  if (req.session.name) {
    // res.json({ first: req.session.name });
    res.locals.flash = [];
    req.flash("info", "Action successful.");
    req.session.flash = res.locals.flash;
    res.redirect("./try.html");
  } else {
    // res.sendStatus(404);
    return res.status(401).json({
      statusCode: req.statusCode,
      method: req.method,
      message: "not found",
    });
  }
});

app.get("/home", function (req, res) {
  res.redirect("./log.html");
  // res.sendFile(__dirname + "/log.html");
});

app.get("/sess", function (req, res) {
  // res.send(req.session.name);
  // console.log('session', req.session.refresh);
  if (req.session.name) {
    req.session.refresh = false;
    res.json({
      "first": req.session.name
    });
  } else {
    if (req.session.refresh === false) {
      res.status(401).json({
        statusCode: req.statusCode,
        method: req.method,
        message: "unauthorized",
      });
    } else {

      res.json({
        statusCode: req.statusCode,
        method: req.method,
        message: "success",
      });
    }

  }
})

app.get("/logout", function (req, res) {
  req.session.destroy();
  
  res.redirect("/");
  // res.sendFile(__dirname + "/index.html");
});


app.listen(port);
console.log("Listening on port " + port);