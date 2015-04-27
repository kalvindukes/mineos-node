var async = require('async');
var auth = exports;

auth.authenticate_shadow = function(user, plaintext, callback) {
  var passwd = require('etc-passwd');
  var hash = require('sha512crypt-node');

  async.waterfall([
    async.apply(passwd.getShadow, {username: user}),
    function(shadow_info, cb) {
      try {
        var password_parts = shadow_info['password'].split(/\$/);
        var salt = password_parts[2];
        var new_hash = hash.sha512crypt(plaintext, salt);

        cb(null, new_hash == shadow_info['password']);
      } catch (e) {
        cb(true);
      }
    }
  ], function(err, authed) {
    //while most callbacks return (err, retval), httpauth seems to accept only one: auth success or fail
    if (err)
      callback(false);
    else
      callback(authed);
  })
}