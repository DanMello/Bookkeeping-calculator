(function () {

  let formSubmit = document.querySelector('#start');
  let expenseButton = document.querySelector('#spreedsheetLink');

  let errorContainer = document.querySelector('#errorContainer');

  formSubmit.addEventListener('click', startFormProcess);

  async function startFormProcess (e) {

    e.preventDefault();

    errorContainer.innerHTML = '';

    formSubmit.classList.add('addHidden')
    expenseButton.classList.add('addHidden')

    let labels = document.querySelectorAll('.labels');

    let formInput = function (label) {

      return new Promise((resolve, reject) => {

        return ask(label).then(question => {

          return anwserQuestion(question);

        }).then(answer => {

          //Here we take the answer if it is date and filter it to make sure we can use it with mysql!

          if (label.attributes['for'].value === 'date') {

            return dateValid(answer)

          } else if (label.attributes['for'].value === 'amount') {

            return amountValid(answer)

          } else {

            return answer;
            
          }

        }).then(answer => {

          let inputField = document.getElementById(label.attributes['for'].value);

          inputField.value = answer;

          resolve()
          
        }).catch(err => {

          errorContainer.innerHTML = err;

          reject()

        });
        
      })

    };

    for (i = 0; i < labels.length; i++) {

      let inputFieldValue = labels[i].nextElementSibling.value;

      if (!inputFieldValue) {

        await formInput(labels[i]);
      }
       
    };

    //This will submit the form once all inputs are in because of await
    document.forms['mainForm'].submit();

  };

  function ask (label) {

    return new Promise(function(resolve, reject) {

      if (!SpeechSynthesisUtterance) {

        reject('API not supported');

      };

      window.utterances = [];

      let askQuestion = new SpeechSynthesisUtterance(label.dataset.question);

      label.parentElement.classList.remove('removeHidden');

      utterances.push(askQuestion);

      speechSynthesis.speak(askQuestion);

      askQuestion.onend = function() {

        resolve(label);
      };

      askQuestion.onerror = function(e) {
        
        reject(e.error);
      };

    });

  };

  function anwserQuestion (label) {

    return new Promise((resolve, reject) => {

      if (!webkitSpeechRecognition) {

        reject('API not supported');

      };

      let loader = document.getElementById('loadingThing');

      let canYouHearMeComputer = new webkitSpeechRecognition();

      canYouHearMeComputer.start();

      loader.classList.remove('removeHidden')

      canYouHearMeComputer.onresult = function (e) {

        label.parentElement.classList.add('addHidden');

        resolve(e.results[0][0].transcript);

      };
        
      canYouHearMeComputer.onerror = function(e) {
        
        reject(e.error);

      };

    });

  };

  function dateValid(date) {

    return new Promise((resolve, reject) => {

      let filteredDate;

      if (!/^[a-zA-Z]{3,}\s\d{1,2}(st|nd|rd|th)*,*\s\d{2,4}\.*$/g.test(date)) {

        reject('Please say date in this format (month, day, year) \r\n Example: October 4th 2017*')

      } else {

        filteredDate = date
          .replace(/\b\d{1,2}(st|nd|rd|th)\b/g, (x) => x.replace(/\D/g, ''))
          .replace(/,/g, '')
          .replace(/\./g, '')

        resolve(filteredDate);

      };

    })

  };

  function amountValid(amount) {

    return new Promise((resolve, reject) => {

      if (/[a-zA-Z]+/.test(amount)) {

        reject('Opps something went wrong please repeat the amount in dollars. Example: $ 432.54 cents')

      } else {

        let mySqlAmount = amount
          .replace(/\$/g, '')
          .replace(/,/g, '')

        resolve(mySqlAmount);

      };

    });

  };

})();

