var express = require('express');
var passport = require('passport');

module.exports = function (opts) {
    var router = express.Router();
    router.use(passport.initialize());

    var self = this;
    this.on('open', function () {
        self.servers.http.middle = router;
    });
    return passport;
};
