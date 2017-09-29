function checkDevice (req, res, next) {

	let url = req.app.config.get(req.app.config.enviroment)['mobileurl']

	if (req.headers.host === url) {

		req.filepath = '/mobile/'

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

  app.get('/expenses', (req, res, next) => {

  	res.render('pages/expenses' + req.filepath, {
      success: req.flash('successMessage')
    })

  })

  app.get('/expenses/spreadsheet', (req, res, next) => {

    return req.app.db('receipts').distinct('location').then(locations => {

      res.render('pages/expenses' + req.filepath + 'expenses', {

        locations: locations

      })

    })

  })

  app.get('/expenses/spreadsheet/:location', (req, res, next) => {

    return req.app.db('receipts')
      .where('location', req.params.location)
      .then(receipts => {

        if (!receipts) return new Error('Could not find location')

        res.render('pages/expenses' + req.filepath + 'specificReceipts', {

          receipts: receipts

        })

      })

  })

  app.post('/sendReceipt', (req, res, next) => {

    return req.app.db('receipts')
      .insert(req.body)
      .then(result => {

        if (!result) return new Error('Could not add receipt. Please try again')
      
        req.flash('successMessage', `Success, your ${req.body.location} receipt has been stored.`)

        res.redirect('/expenses')

      }).catch(err => {

        return next(err)

      })

  })

}