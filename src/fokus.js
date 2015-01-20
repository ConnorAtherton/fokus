var fs = require('fs');
var path = require("path");
var os = require("os");
var hw = require("headway");
var split = require("split");
var ChopStream = require('./chopStream');

var root = (os.platform == "win32") ? process.cwd().split(path.sep)[0] : "/";
var hosts = root + 'etc/hosts';

/**
 * ARGV options passed in
 */
var opts;

function appendToHosts(string) {
  fs.appendFile(hosts, string, { encoding: 'utf8' }, function(err, cb) {
    if (err) throw err;
  });
}

/**
 * Accepts a list of domains and returns a formatted string
 * for the hosts file.
 *
 * @param list {Array} An array of domains to block
 * @returns {String} The string to be added to the hosts file
 */
function createString() {
  var prepend = "\n## >> Generated by fokus\n";
  var append = "## <<"
  var file = [];
  var defaults = [];

  // a file has been specified..
  if (options.using || options.u) {
    var path = options.using || options.u;
    path = (path[0] === "/" || path[0] === ".") ? path : "/" + path;
    file = require(process.cwd() + path);
  }

  if (!options.no || options.defaults == false) {
    log("Adding the set of default link to hosts");
    defaults = require('./defaults')
  } else {
    log("Not including default links.")
  }

  var allLinks = file.concat(defaults);
  for (var i = 0, l = allLinks.length; i < l; i ++) {
    prepend += allLinks[i] + "\n";
  }

  return prepend + append;
}

/**
 * Removes all additions amde by fokus
 * from /etc/hosts
 */
function removeFromHosts() {
  var input = fs.createReadStream(hosts);
  var write = fs.createWriteStream('out.txt');

  input.pipe(split()).pipe(ChopStream)
    .pipe(write).on('end', function() {
      console.log('tada')
      writer.end();
    });
}

/**
 * Simple wrapper around headway
 */
function log(string) {
  hw.log("{blue}[FOKUS]:{/}{yellow} " + string);
}


/**
 * Starts a web server that just displays
 * motivational images.
 */
function startServer() {}


module.exports = function(argv) {
  options = argv;
  console.log(options)
    if (argv.stop || argv.kill) {
      removeFromHosts();
      log("Fokusing is over. Enjoy your day!")
    } else {
      var string = createString();
      appendToHosts(string);
      log("It's done. Time to fokus.");
    }
}
