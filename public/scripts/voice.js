(function () {

  //use this as a reference so you dont need to keep using the the DOM
  let theForm = document.getElementById('mainForm');

  let buttonContainer = theForm.querySelector('#buttonContainer');
  let restartContainer = theForm.querySelector('#continueOrRestart');

  let errorContainer = theForm.querySelector('#errorContainer');
  let successContainer = theForm.querySelector('#successContainer');

  let formSubmit = 
    theForm.querySelectorAll('#start, #continue').forEach(button => {

      button.addEventListener('click', startFormProcess);

    });

  let usersInput = theForm.querySelector('#usersInput');

  let calendar = theForm.querySelector('#calendar');

  async function startFormProcess (e) {

    e.preventDefault();

    errorContainer.innerHTML = '';
    successContainer.innerHTML = '';

    buttonContainer.classList.add('removeHidden');

    restartContainer.classList.add('removeHidden');

    let labels = theForm.querySelectorAll('.labels');
 
    let formInput = function (label) {

      let labelInput = label;

      return new Promise((resolve, reject) => {

        return ask(labelInput).then(labelPassedBack => {

          return anwserQuestion(labelPassedBack);

        }).then(answer => {

          resolve(answer);
          
        }).catch(err => {

          reject(err);

        });
          
      }).then(answer => {

        let inputField = theForm.querySelector(`#${label.attributes['for'].value}`);

        inputField.value = answer;

      }).catch(err => {

        throw err

      });

    };

    for (i = 0; i < labels.length; i++) {

      let inputField = labels[i].nextElementSibling;

      if (!inputField.value) {

        try {
          
          await formInput(labels[i]);

        } catch (e) {

          restartContainer.classList.remove('removeHidden');

          errorContainer.innerHTML = e;

          return false

        }

      } else {

        try {

          await testThisInput(labels[i], inputField.value).then(answer => {

            inputField.value = answer;

          })

        } catch (e) {

          inputField.value = '';

          restartContainer.classList.remove('removeHidden');

          errorContainer.innerHTML = e;

          return false

        }

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

      if (label.attributes['for'].value === 'date') calendar.classList.remove('removeHidden');

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

      let loader = theForm.querySelector('#loadingThing');

      let canYouHearMeComputer = new webkitSpeechRecognition();

      canYouHearMeComputer.start();

      loader.classList.remove('removeHidden');

      canYouHearMeComputer.onresult = function (e) {

        return testThisInput(label, e.results[0][0].transcript).then(result => {

          resolve(result);

        }).catch(err => {

          reject(err);

        })

      };

      canYouHearMeComputer.onerror = function(e) {

        loader.classList.add('removeHidden');
        
        reject(e.error);

      };

      canYouHearMeComputer.onend = function() {

        loader.classList.add('removeHidden');
        
        reject('Sorry we did not get that please try again');

      };

    });

  };

  function testThisInput(label, input) {

    return new Promise((resolve, reject) => {

      let filterMethod

      let loader = theForm.querySelector('#loadingThing');

      if (label.attributes['for'].value === 'date') filterMethod = dateValid;
      
      else if (label.attributes['for'].value === 'amount') filterMethod = amountValid;

      else filterMethod = stringValid;

      return filterMethod(input).then(result => {

        if (label.attributes['for'].value === 'date') calendar.classList.add('removeHidden');

        label.parentElement.classList.add('removeHidden');

        loader.classList.add('removeHidden');

        resolve(result);

      }).catch(err => {

        loader.classList.add('removeHidden');

        reject(`We heard: ${input} <br> ${err}`);

      })

    })

  };

  function dateValid(date) {

    let filteredDate

    return new Promise((resolve, reject) => {

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

      if (!/^\$*[0-9,]+(\.[0-9]{1,2})*$/g.test(amount)) {

        reject('Something went wrong please repeat the amount in dollars. Example: $ 432.54 cents')

      } else {

        let mySqlAmount = amount
          .replace(/\$/g, '')
          .replace(/,/g, '')

        resolve(mySqlAmount);

      };

    });

  };

  function stringValid(string) {

    return new Promise((resolve, reject) => {

      let filteredString

      if (!/^([a-zA-Z0-9\'\"]+\s?)*$/g.test(string)) {

        reject('Please say or enter only words and numbers, and no more than one space per word*');

      } else {

        filteredString = string
          .replace(/\"/g, '')
          .replace(/\'/g, '')

        resolve(filteredString)

      };

    });

  };

})();