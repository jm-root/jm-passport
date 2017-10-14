var _ = require('lodash')
var passport = require('passport')
var error = require('jm-err')
var Err = error.Err
module.exports = function (router) {
  var service = this
  var t = function (doc, lng) {
    if (lng && doc.err && doc.msg) {
      return {
        err: doc.err,
        msg: Err.t(doc.msg, lng) || doc.msg
      }
    }
  }

  router.post('/login',
    passport.authenticate(['local'], {session: false}),
    function (req, res) {
      var doc = req.user
      res.json(t(doc, req.lng))
    })

  router.post('/register',
    function (req, res) {
      var data = {}
      _.defaults(data, req.body, req.query)
      service.user.post('/signup', data)
        .then(function (doc) {
          if (doc.err) return res.json(doc)
          res.json({
            id: doc.id,
            uid: doc.uid
          })
        })
        .catch(function (err) {
          var doc = Err.FAIL
          err.code && (doc.err = err.code)
          err.message && (doc.msg = err.message)
          res.json(t(doc, req.lng))
        })
    })
}