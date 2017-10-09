(function () {

  let buttonContainer = document.querySelector('#buttonContainer');
  let restartContainer = document.querySelector('#continueOrRestart');

  let errorContainer = document.querySelector('#errorContainer');
  let successContainer = document.querySelector('#successContainer')

  let formSubmit = 
    document.querySelectorAll('#start, #continue').forEach(button => {

      button.addEventListener('click', startFormProcess);

    });

  async function startFormProcess (e) {

    e.preventDefault();

    errorContainer.innerHTML = '';
    successContainer.innerHTML = '';

    buttonContainer.classList.add('removeHidden');

    restartContainer.classList.add('removeHidden');

    let labels = document.querySelectorAll('.labels');

    let formInput = function (label) {

      let labelInput = label;

      return new Promise((resolve, reject) => {

        return ask(labelInput).then(labelPassedBack => {

          return anwserQuestion(labelPassedBack);

        }).then(answer => {

          let inputField = document.getElementById(label.attributes['for'].value);

          inputField.value = answer;

          resolve()
          
        }).catch(err => {

          restartContainer.classList.remove('removeHidden');

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

      loader.classList.remove('removeHidden');

      canYouHearMeComputer.onresult = function (e) {

        if (label.attributes['for'].value === 'date') {

          return dateValid(e.results[0][0].transcript).then(date => {

            label.parentElement.classList.add('removeHidden');

            loader.classList.add('removeHidden');

            resolve(date);

          }).catch(err => {

            loader.classList.add('removeHidden');

            reject(err);

          })

        } else if (label.attributes['for'].value === 'amount') {

          return amountValid(e.results[0][0].transcript).then(amount => {

            label.parentElement.classList.add('removeHidden');

            loader.classList.add('removeHidden');

            resolve(amount);

          }).catch(err => {

            loader.classList.add('removeHidden');

            reject(err);

          })

        } else {

          label.parentElement.classList.add('removeHidden');

          loader.classList.add('removeHidden');

          resolve(e.results[0][0].transcript);

        }

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

