const event = require('jm-event')
const error = require('jm-err')
const help = require('./help')

let MS = require('jm-ms-core')
let ms = new MS()
let Err = error.Err

/**
 * @apiDefine Error
 *
 * @apiSuccess (Error 200) {Number} err 错误代码
 * @apiSuccess (Error 200) {String} msg 错误信息
 *
 * @apiExample {json} 错误:
 *     {
 *       err: 错误代码
 *       msg: 错误信息
 *     }
 */

module.exports = function (opts = {}) {
  let service = this
  let router = ms.router()

  service.routes || (service.routes = {})
  let routes = service.routes
  event.enableEvent(routes)

  let cbErr = (opts, cb, e) => {
    let doc = {
      err: e.code,
      msg: e.message
    }
    cb(e, doc)
  }

  router.use(help(service))
    .use(function (opts, cb, next) {
      if (!service.ready) {
        let e = error.err(Err.FA_NOTREADY)
        return cbErr(opts, cb, e)
      }
      next()
    })
    .add('/register', 'post', (opts, cb, next) => {
      let ips = opts.ips
      ips.length || (ips = [opts.ip])
      service.register(opts.data, ips)
        .then(function (doc) {
          cb(null, doc)
        })
        .catch(e => {
          cbErr(opts, cb, e)
        })
    })
    .add('/login', 'post', (opts, cb, next) => {
      let ips = opts.ips
      ips.length || (ips = [opts.ip])
      service.login(opts.data, ips)
        .then(function (doc) {
          cb(null, doc)
        })
        .catch(e => {
          cbErr(opts, cb, e)
        })
    })

  return router
}
