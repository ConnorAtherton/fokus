// TODO Start express server on localhost port in redirect
var fs = require('fs');
var path = require("path");
var os = require("os");
var hw = require("headway");
var split = require("split");
var ChopStream = require('./chopStream');
var strings = require('./strings');

var root = (os.platform == "win32") ? process.cwd().split(path.sep)[0] : "/";
var tmp = root + 'etc/hosts.tmp';
var hosts = root + 'etc/hosts';

/**
 * ARGV options passed in
 */
var opts;

function appendToHosts(string) {
  var stream = fs.createWriteStream(hosts, {flags: 'a'});
  stream.write(string);
  stream.end(function() {});
}

function fileHasFokus() {
  var regex = new RegExp(strings.prepend, 'g');
  var file = fs.readFileSync(hosts);

  return regex.test(file);
}

/**
 * Accepts a list of domains and returns a formatted string
 * for the hosts file.
 *
 * @param list {Array} An array of domains to block
 * @returns {String} The string to be added to the hosts file
 */
function createString() {
  var file = [];
  var defaults = [];

  // a file has been specified..
  if (options.using || options.u) {
    var path = options.using || options.u;
    log("Using custom file - " + path);
    file = require(path);
  }

  if (options.defaults !== false) {
    log("Adding the set of default link to hosts");
    defaults = require('./defaults');
  } else {
    log("Not including default links.");
  }

  var allLinks = file.concat(defaults || []);
  for (var i = 0, l = allLinks.length; i < l; i ++) {
    strings.prepend += '127.0.0.1\t\t' + allLinks[i] + "\n";
  }

  return strings.prepend + strings.append;
}

/**
 * Removes all additions made by fokus
 * from /etc/hosts
 */
function removeFromHosts() {
  var input = fs.createReadStream(hosts);
  var write = fs.createWriteStream(tmp, {
    flags: 'w+'
  });

  input.pipe(split())
    .pipe(ChopStream)
    .pipe(write);

  fs.unlink(hosts, function(err) {
    if (err) hw.log('Error writing back to the hosts file');

    fs.renameSync(tmp, hosts);
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

  if (argv.stop || argv.kill) {
    removeFromHosts();
    log("Fokusing is over. Enjoy your day!")
  } else {
    if (fileHasFokus()) {
      log("Already enabled.");
    } else {
      var string = createString();
      appendToHosts(string);
      log("It's done. Time to fokus.");
    }
  }
}
