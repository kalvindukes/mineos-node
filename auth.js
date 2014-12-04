var posix = require('posix');
var async = require('async');
var auth = exports;

auth.user_in_group = function(user, group, callback) {
  var group_info, user_info;
  try {
    group_info = posix.getgrnam(group);

    if (group_info['members'].indexOf(user) >= 0)
      callback(true); //if user listed in getgrnam's grouplist
    else {
      user_info = posix.getpwnam(user);

      if (group_info['gid'] == user_info['gid']) {
        callback(true); //if user's primary group is matching
      } else {
        callback(false);
      }
    }
  } catch (e) {
    callback(false);
  }
}

auth.get_group_owner = function(path, callback) {
  var fs = require('fs-extra');

  fs.stat(path, function(err, stat_info){
    callback(posix.getgrnam(stat_info['gid'])['name']);
  })
}