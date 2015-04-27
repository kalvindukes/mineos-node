var auth = exports;

auth.authenticate_shadow = function(user, plaintext, callback) {
  var passwd = require('etc-passwd');
  var hash = require('sha512crypt-node');

  passwd.getShadow({username:user}, function(err, shadow_info) { 
    if (err) {
      callback(true, false);
    } else {
      try {
        var password_parts = shadow_info['password'].split(/\$/);
        var salt = password_parts[2];
        var new_hash = hash.sha512crypt(plaintext, salt);

        callback(err, new_hash == shadow_info['password']);
      } catch (e) {
        callback(true, false);
      }
    }
  })
}