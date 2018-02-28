let ajaxFunction = (function () {

  let dataAlreadyLoadedArray = [];
  let currentData = null;

  function getAndPostData(pageNumber) {

    console.log('rann', pageNumber)

    let visibleRows = document.querySelectorAll('.displayTR');

    if (this.id === 'next') {

      var alreadyLoadedDataString = this.previousElementSibling['attributes'].rel.value;
      var dataAlreadyLoadedToNum = Number(alreadyLoadedDataString) + 1;

      currentData = dataAlreadyLoadedToNum;

    };

    return new Promise(function(resolve, reject) {

      let jsonBody = {
        calculation: Math.floor(window.innerHeight / 33) * 5,
        pageNumber: pageNumber || 1,
        dataAlreadyLoaded: dataAlreadyLoadedArray,
        currentData: currentData
      };

      fetch(window.location.href, {
        
        method: 'POST',
        body: JSON.stringify(jsonBody),
        headers: new Headers({
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }),
        credentials: 'include'

      }).then(results => {

        return results.json()

      }).then(postJsonResults => {

        if (postJsonResults.alreadyLoaded === true) {

          resolve('alreadyLoaded');

        } else {

          visibleRows.forEach(item => {

            item.classList.remove('displayTR');
            item.classList.add('hideTR');

          });

          loader();

          return fetch(window.location.href, {

            method: 'GET',
            headers: new Headers({
              "X-Requested-With": "XMLHttpRequest"
            }),
            credentials: 'include'

          })
          
        }

      }).then(results => {

        return results.json()

      }).then(getJsonResults => {

        let tbody = document.getElementById('mainData');
        let sum = document.getElementById('sum').innerHTML = 
          `Total for ${getJsonResults['location']}: $${getJsonResults['sum']}`;

        getJsonResults.receipts.forEach(row => {

          let tableRow = document.createElement('tr');
          let tableCells = ['id', 'location', 'date', 'amount', 'expense_type'];

          tableCells.forEach(cell => {

            let tableCell = document.createElement('td');

            if (cell === 'amount') tableCell.textContent = `$${row[cell]}`;
            else tableCell.textContent = row[cell];

            tableRow.appendChild(tableCell);

          });

          tbody.appendChild(tableRow);

        });

        resolve();

      }).catch(err => {

        reject(err);

      });

    }).then(resolved => {

      if (this === window) pagination.createFirstLinks();
      if (this.id === 'next') dataAlreadyLoadedArray.push(dataAlreadyLoadedToNum);
      if (resolved !== 'alreadyLoaded') done();

    }).catch(err => {

      console.log(err);

    });

  };

  getAndPostData();

  return {
    getAndPostData
  }
  
})();
