const event = require('jm-event')
const MS = require('jm-ms')
const error = require('jm-err')
let ms = MS()

class Passport {
  constructor (opts = {}) {
    event.enableEvent(this)
    this.ready = true
    let self = this
    let bind = (name, uri) => {
      uri || (uri = '/' + name)
      ms.client({
        uri: opts.gateway + uri
      }, function (err, doc) {
        !err && doc && (self[name] = doc)
      })
    }
    bind('sso')
    bind('user')
  }

  /**
   * 注册, 并返回注册信息
   * @param {Object} opts
   * @example
   * opts参数:{
   *  account: 账号
   *  password: 密码
   * }
   * @returns {Promise<*>}
   */
  async register (opts = {}, ips) {
    let self = this
    let p = new Promise(resolve => {
      self.user.request({uri: '/users', type: 'post', data: opts, ips: ips}, (err, doc) => {
        if (err) throw err
        resolve(doc)
      })
    })
    let doc = await p
    if (doc.err) throw error.err(doc)
    doc = {
      id: doc.id,
      uid: doc.uid
    }
    this.emit('register', doc)
    return doc
  }

  /**
   * 登陆
   * @param {Object} opts
   * @example
   * opts参数:{
   *  username: 账号
   *  password: 密码
   * }
   * @returns {Promise<*>}
   */
  async login (opts = {}, ips) {
    let self = this
    let p = new Promise(resolve => {
      self.user.request({uri: '/signon', type: 'post', data: opts, ips: ips}, (err, doc) => {
        if (err) throw err
        resolve(doc)
      })
    })
    let doc = await p
    if (doc.err) throw error.err(doc)
    p = new Promise(resolve => {
      self.sso.request({uri: '/signon', type: 'post', data: doc, ips: ips}, (err, doc) => {
        if (err) throw err
        resolve(doc)
      })
    })
    doc = await p
    if (doc.err) throw error.err(doc)
    this.emit('login', {id: doc.id})
    return doc
  }
}

module.exports = Passport
