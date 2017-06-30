require('log4js').configure(__dirname + '/log4js.json');
var config = {
    development: {
        port: 3000,
        gateway: 'http://api.mx.jamma.cn',
        modules: {
            'passport': {
                module: process.cwd() + '/lib'
            },
            'jm-passport-mobile': {}
        }
    },
    production: {
        port: 3000,
        gateway: 'http://api.mx.jamma.cn',
        redis: 'redis://redis.db',
        db: 'mongodb://mongo.db/passport',
        tokenExpire: 3600,
        disableVerifyCode: false,
        disableAutoUid: false,
        modules: {
            'passport': {
                module: process.cwd() + '/lib'
            },
            'jm-passport-mobile': {}
        }
    }
};

var env = process.env.NODE_ENV || 'development';
config = config[env] || config['development'];
config.env = env;

module.exports = config;
