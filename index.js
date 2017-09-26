//Dependencies
const bodyParser = require('body-parser')
const session = require('express-session')
const express = require('express')

//Start the app
const app = express()

//config for the app, env variables
const Config = require('./config')

app.config = Config

//Database connection
const knex = require("knex")
const knexSetup = Config.get(Config.enviroment)['database']

//Files
const staticAssets = __dirname + '/public'

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(staticAssets))
app.use(session(Config.get('default')['session']))

//setup routes
require('./routes')(app)

app.listen(3000)
