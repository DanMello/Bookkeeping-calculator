function checkDevice (req, res, next) {

	let url = req.app.config.get(req.app.config.enviroment)['mobileurl']

	if (req.headers.host === url) {

		req.filepath = '/mobile'

	} else {

		req.filepath = '/'
		
	}

	next()

}

exports = module.exports = function(app, passport) {

	//Check for mobile users
  app.all('*', checkDevice)

  app.get('/', (req, res, next) => {

    res.render('pages/home' + req.filepath)

  })

  app.post('/sendReciept', (req, res, next) => {

    console.log(req.body)

    res.redirect('/')

  })


}