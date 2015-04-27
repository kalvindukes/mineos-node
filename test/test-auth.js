var async = require('async');
var auth = require('../auth');
var test = exports;

test.authenticate_shadow = function(test) {
  //this test depends on the existence of system user "weak" with password "password"
  async.series([
    function(callback) {
      auth.authenticate_shadow('weak', 'password', function(authed) {
        test.ok(authed);
        callback(!authed);
      })
    },
    function(callback) {
      auth.authenticate_shadow('weak', 'notthepassword', function(authed) {
        test.ok(!authed);
        callback(authed);
      })
    },
    function(callback) {
      auth.authenticate_shadow('fake', 'notthepassword', function(authed) {
        test.ok(!authed);
        callback(authed);
      })
    }
  ], function(err, results) {
    test.expect(3);
    test.done();
  })
}