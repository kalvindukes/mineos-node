var async = require('async');
var auth = require('../auth');
var test = exports;

test.authenticate_shadow = function(test) {
  //this test depends on the existence of system user "weak" with password "password"
  async.series([
    function(callback) {
      auth.authenticate_shadow('weak', 'password', function(err, authed) {
        test.ifError(err);
        test.ok(authed);
        callback(err);
      })
    },
    function(callback) {
      auth.authenticate_shadow('weak', 'notthepassword', function(err, authed) {
        test.ifError(err);
        test.ok(!authed);
        callback(err);
      })
    },
    function(callback) {
      auth.authenticate_shadow('fake', 'notthepassword', function(err, authed) {
        test.ok(err);
        test.ok(!authed);
        callback(err);
      })
    }
  ], function(err, results) {
    test.done();
  })
}