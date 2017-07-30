var express = require('express');
var passport = require('passport');

module.exports = function (opts) {
    ['gateway'].forEach(function (key) {
        process.env[key] && (opts[key] = process.env[key]);
    });

    var router = express.Router();
    router.use(passport.initialize());

    var self = this;
    this.on('open', function () {
        if(self.servers.http.middle) self.servers.http.middle.use(router);
    });
    return passport;
};
