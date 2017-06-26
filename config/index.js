require('log4js').configure(__dirname + '/log4js.json');
var config = {
    development: {
        port: 3000,
        modules: {
            'passport': {
                module: process.cwd() + '/lib'
            },
            'jm-passport-mongodb': {}
        }
    },
    production: {
        port: 3000,
        redis: 'redis://redis.db',
        db: 'mongodb://mongo.db/passport',
        tokenExpire: 3600,
        disableVerifyCode: false,
        disableAutoUid: false,
        modules: {
            'passport': {
                module: process.cwd() + '/lib'
            },
            'jm-passport-mongodb': {}
        }
    }
};

var env = process.env.NODE_ENV || 'development';
config = config[env] || config['development'];
config.env = env;

module.exports = config;
