const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require('morgan')
const path = require("path");
const http = require('http');
const ngrok = require('ngrok');


const Pool = require("pg").Pool;
const fs = require("fs");
var bcrypt = require("bcrypt");

const mediaControllers = require("./controllers/mediaFunctions");
const torrentFunctions = require("./controllers/torrentFunctions");
const db = require("./db/database");

require('dotenv').config()



// extract meta data from a file
const ffprobe = require("ffprobe"),
  ffprobeStatic = require("ffprobe-static");

ffprobe(
  "/Users/Dylan/Documents/My_Things/A Claymation Christmas Celebration-A Claymation Christmas Celebration.mp4",
  { path: ffprobeStatic.path },
  function(err, info) {
    if (err) return done(err);
    // console.log(info);
  }
);

// set up morgan for http request logging
//app.use(morgan('combined'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// This pulls in static css and image files from the public folder
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/data")));
app.use(express.static(path.join(__dirname, "/js")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

// route for user signup
app.route('/signup')
    .get((req, res) => {
        res.sendFile(__dirname + '/public/signup.html');
    })
    .post(db.createNewUser);

app.get("/admin", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/admin.html"));
});

app.post("/admin-save", db.updateUserData);

// Save get and update user data to the database
app.get("/user-data", db.getUserProfileData);
//app.post("/user-data", db.updateUserData);

app.get("/videos/:id", db.getUserStreamMedia);

// Get dynamic url
app.get("/dynamic-url", db.getNgrokDynamicUrl);

// Get media file info from a users selected folder
app.get("/media-files", db.getUserMediaData);

// Torrent streaming
app.get("/torrent-media/:magnetLink", torrentFunctions.streamTorrent);

// route for handling 404 requests(unavailable routes)
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

app.listen(3030, '0.0.0.0', function() {
  console.log("Listening on port 3030!");
// Only needed for the client app
  (async function() {
    const url = await ngrok.connect(3030);
    console.log(url)
  db.updateNgrokDynamicUrl(url)})();
 });



