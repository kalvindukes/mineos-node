var async = require('async');
var auth = require('../auth');
var test = exports;

test.user_in_group = function(test) {
  async.series([
    function(cb) {
      auth.user_in_group('mc', 'root', function(in_group) {
        test.ok(!in_group);
        cb();
      })
    },
    function(cb) {
      auth.user_in_group('mc', 'madeup', function(in_group) {
        test.ok(!in_group);
        cb();
      })
    },
    function(cb) {
      auth.user_in_group('root', 'mc', function(in_group) {
        test.ok(!in_group);
        cb();
      })
    },
    function(cb) {
      auth.user_in_group('madeup', 'madeup', function(in_group) {
        test.ok(!in_group);
        cb();
      })
    },
    function(cb) {
      auth.user_in_group('mc', 'mc', function(in_group) {
        test.ok(in_group);
        cb();
      })
    } 
  ], function(err, results) {
    test.done();
  })
}

test.get_group_owner = function(test) {
  async.parallel([
    function(cb) {
      auth.get_group_owner('/', function(err, owner) {
        test.equal(owner, 'root');
        cb();
      })
    },
    function(cb) {
      auth.get_group_owner('/root', function(err, owner) {
        test.equal(owner, 'root');
        cb();
      })
    },
    function(cb) {
      auth.get_group_owner('/root/', function(err, owner) {
        test.equal(owner, 'root');
        cb();
      })
    },
    function(cb) {
      auth.get_group_owner('/home/mc', function(err, owner) {
        test.equal(owner, 'mc');
        cb();
      })
    }
  ], function(err) {
    test.done();
  })
}

test.authenticate_shadow_user = function(test) {
  //this test depends on the existence of system user "weak" with password "password"
  async.series([
    function(callback) {
      auth.authenticate_shadow_user('weak', 'password', function(err, authed) {
        test.ifError(err);
        test.ok(authed);
        callback(err);
      })
    },
    function(callback) {
      auth.authenticate_shadow_user('weak', 'notthepassword', function(err, authed) {
        test.ifError(err);
        test.ok(!authed);
        callback(err);
      })
    },
    function(callback) {
      auth.authenticate_shadow_user('fake', 'notthepassword', function(err, authed) {
        test.ok(err);
        test.ok(!authed);
        callback(err);
      })
    }
  ], function(err, results) {
    test.done();
  })
}