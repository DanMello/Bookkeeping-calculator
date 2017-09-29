(function () {

  let formSubmit = document.querySelector('#start');

  let errorContainer = document.querySelector('#errorContainer');

  formSubmit.addEventListener('click', startFormProcess);

  async function startFormProcess (e) {

    e.preventDefault();

    errorContainer.innerHTML = '';

    let labels = document.querySelectorAll('.labels');

    let formInput = function (label) {

      return ask(label.dataset.question).then(() => {

        return anwserQuestion();

      }).then(answer => {

        let inputField = document.getElementById(label.attributes['for'].value);

        inputField.value = answer;

      }).catch(err => {

        errorContainer.innerHTML = err;

        throw err;

      });

    };

    for (i = 0; i < labels.length; i++) {

      await formInput(labels[i]);
    };

    //This will submit the form once all inputs are in because of await
    document.forms['mainForm'].submit();

  };

  function ask (question) {

    return new Promise(function(resolve, reject) {

      if (!SpeechSynthesisUtterance) {

        reject('API not supported');

      };

      window.utterances = [];

      let askQuestion = new SpeechSynthesisUtterance(question);

      utterances.push(askQuestion);

      speechSynthesis.speak(askQuestion);

      askQuestion.onend = function() {

        resolve();
      };

      askQuestion.onerror = function(e) {
        
        reject(e.error);
      };

    });

  };

  function anwserQuestion () {

    return new Promise((resolve, reject) => {

      if (!webkitSpeechRecognition) {

        reject('API not supported');
      };

      let canYouHearMeComputer = new webkitSpeechRecognition();

      canYouHearMeComputer.start();

      canYouHearMeComputer.onresult = function (e) {

        resolve(e.results[0][0].transcript);

      };

      canYouHearMeComputer.onerror = function(e) {
        
        reject(e.error);
      };

    });

  };

})();

