var torrentStream = require("torrent-stream");

// const WebTorrent = require("webtorrent");
// const client = new WebTorrent();

// encoded magnet links for testing:
// Gaurdiansof the galaxy: magnet%3A%3Fxt%3Durn%3Abtih%3A11a2ac68a11634e980f265cb1433c599d017a759
// Sintel: magnet%3A%3Fxt%3Durn%3Abtih%3A08ada5a7a6183aae1e09d831df6748d566095a10%26dn%3DSintel%26tr%3Dudp%253A%252F%252Fexplodie.org%253A6969%26tr%3Dudp%253A%252F%252Ftracker.coppersurfer.tk%253A6969%26tr%3Dudp%253A%252F%252Ftracker.empire-js.us%253A1337%26tr%3Dudp%253A%252F%252Ftracker.leechers-paradise.org%253A6969%26tr%3Dudp%253A%252F%252Ftracker.opentrackr.org%253A1337%26tr%3Dwss%253A%252F%252Ftracker.btorrent.xyz%26tr%3Dwss%253A%252F%252Ftracker.fastcast.nz%26tr%3Dwss%253A%252F%252Ftracker.openwebtorrent.com%26ws%3Dhttps%253A%252F%252Fwebtorrent.io%252Ftorrents%252F%26xs%3Dhttps%253A%252F%252Fwebtorrent.io%252Ftorrents%252Fsintel.torrent


const streamTorrent = (req, res, next) => {
  var magnetLink = req.params.magnetLink;
  console.log(req.params)
  console.log(magnetLink)
  var sampleMagnetLink = "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent"
  var engine = torrentStream(magnetLink);

  engine.on("ready", function() {
    engine.files.forEach(function(file) {
      //let torrentFile = torrent.files.filter(file => file.name === "Sintel.mp4")[0];
      if (file.name === "Sintel.mp4" || file.name === "Guardians.of.the.Galaxy.2014.1080p.BluRay.x264.YIFY.mp4") {
      console.log("mp4 file:", file.name);
      file.createReadStream().pipe(res)
      // stream is readable stream to containing the file content
     }
    });
  });
};

const streamTorrent3 = (req, res, next) => {
  res.set("content-type", "video/mp4");
  res.set("content-disposition", "inline");

  // This can be any magnet URI, or a torrent file passed as text or a Buffer.
  const bigBuckBunnyURI =
    "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent";

  client.add(bigBuckBunnyURI, function(torrent) {
    // You can easily sort through files within the torrent.
    const file = torrent.files.filter(file => file.name === "Sintel.mp4")[0];
    console.log(file.name);
    // The files can be piped to other streams.
    file.createReadStream().pipe(res);
  });
};

const streamTorrent2 = (req, res, next) => {
  engine.on("ready", function() {
    engine.files.forEach(function(file) {
      console.log(engine.path);
      console.log("current media name:" + file.name);
      const stat = fs.statSync(mediaPath);
      const fileSize = stat.size;
      const range = req.headers.range;
      //console.log(req.headers);
      var stream = file.createReadStream({
        start: 0,
        end: 100
      });
      const head = {
        "Content-Length": 100,
        "Content-Type": "video/mp4"
      };
      res.writeHead(200, head);
      stream.pipe(res);
    });
  });
};

const streamTorrent_OLD = (req, res, next) => {
  engine.on("ready", function() {
    var mediaPath =
      "/Users/Dylan/Desktop/A Claymation Christmas Celebration-A Claymation Christmas Celebration.mp4";
    engine.files.forEach(function(file) {
      console.log(engine.path);
      console.log("current media name:" + file.name);
      const stat = fs.statSync(mediaPath);
      const fileSize = stat.size;
      const range = req.headers.range;
      //console.log(req.headers);
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const file = fs.createReadStream(mediaPath, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4"
        };
        res.writeHead(200, head);
        fs.createReadStream(mediaPath).pipe(res);
      }
    });
  });
};

module.exports = {
  streamTorrent,
};
