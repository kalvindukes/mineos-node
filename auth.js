var passwd = require('etc-passwd');
var async = require('async');
var auth = exports;

auth.user_in_group = function(user, group, callback) {
  passwd.getGroup({'groupname': group}, function(err, group_info) {
    if (err) { //if error because user/group doesnt exist
      callback(false)
    } else if (group_info['users'].indexOf(user) >= 0) {
      // if user exists in returned group array
      callback(true);
    } else {
      // check if user's primary group is group
      // because a user is typically not part of the groups array result
      passwd.getUser({'username':user}, function(err, user_info) {
        callback( (err ? false : group_info['gid'] == user_info['gid']) )
      });
    }
  })
}

