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
  async register (opts = {}) {
    let doc = await this.user.post('/users', opts)
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
  async login (opts = {}) {
    let doc = await this.user.post('/signon', opts)
    if (doc.err) throw error.err(doc)
    doc = await this.sso.post('/signon', doc)
    this.emit('login', {id: doc.id})
    return doc
  }
}

module.exports = Passport
