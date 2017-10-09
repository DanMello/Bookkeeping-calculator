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

    let storeReceipts

    return req.app.db('receipts')
      .where('location', req.params.location)
      .orderBy('date', 'asc')
      .then(receipts => {

        if (!receipts) return new Error('Could not find location')

        receipts.map(x => { 

          //index from zero lol, this is for date in this format mm/dd/yyyy
          x.date = `${x.date.getMonth() + 1 }/${x.date.getDate()}/${x.date.getFullYear()}`

          //This is to add commas to the thousands from the decimal format 1,000
          x.amount = x.amount.toLocaleString()

        })

        storeReceipts = receipts

        return req.app.db('receipts')
          .where('location', req.params.location)
          .sum('amount')

      }).then(amount => {
        
        if (!amount) return new Error('Could not sum amounts')

        res.render('pages/expenses' + req.filepath + 'specificReceipts', {

          receipts: storeReceipts,
          location: req.params.location,
          sum: amount[0]['sum(`amount`)'].toLocaleString()

        })

      }).catch(err => {

        return next(err)

      })

  })

  app.post('/sendReceipt', (req, res, next) => {

    let mySqlDate = new Date(req.body.date)
      .toISOString()
      .replace(/\T(.*)/, '')

    let receipt = {
      location: req.body.location,
      date: mySqlDate,
      amount: req.body.amount,
      expense_type: req.body.expense_type
    }

    return req.app.db('receipts')
      .insert(receipt)
      .then(result => {

        if (!result) return new Error('Could not add receipt. Please try again')
      
        req.flash('successMessage', `Success, your ${receipt.location} receipt has been stored.`)

        res.redirect('/expenses')

      }).catch(err => {

        return next(err)

      })

  })

  app.get('/test', (req, res, next) => {

    setInterval(addData, 100);

    let data = {
      location: "Home Depot",
      date: "2017-10-4",
      amount: "253.54",
      expense_type: "Work supplies"
    }

    function addData() {

      return req.app.db('receipts')
        .insert(data)
        .then(result => {

          if (!result) throw new Error("fuck")

          console.log("ADDED")

        })

    }

    res.render('pages/expenses/TEST')
    
  })

}
