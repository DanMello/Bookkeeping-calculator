const enviroment = process.env.NODE_ENV || 'development'

const config = {
  development: {
    database: {
      client: 'mysql',
      connection: {
        host: '127.0.0.1', // Default local mysql host
        user: 'root', // Put your user for mysql here
        password: 'Mysecurepassword1!', // Put your password for mysql here
        database: 'upperlevelcontractor' // Put your development database name here, for this project
      }
    },
    session: {
      secret: "secret phrase",
      resave: false,
      saveUninitialized: false,
      cookie: {}
    },
    mobileurl: '10.0.0.189'
  }
}

exports.enviroment = enviroment

exports.get = function (property) {

  return config[property]
}

/*Example

const Config = require(./config)

Config.get('enviroment')[property]

 or

Config.get(Config.enviroment)[property]

*/
