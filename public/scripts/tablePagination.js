(function () {

  let table = document.getElementById('mainTable');
  let nav = document.getElementById('pagination');
  
  let totalrows = table.rows.length;
  let rowsVisible = Math.floor(window.innerHeight / 32);
  let numberOfPages = Math.ceil(totalrows / rowsVisible);

  for (i = 0; i < numberOfPages; i++) {

    if (i === 5) {

      createButton('next')

      break;

    };

    let pageNumber = i + 1;
    let createdLink = document.createElement('a');

    createdLink.rel = i;
    createdLink.innerHTML = pageNumber;

    nav.appendChild(createdLink);

  };

  Array.from(table.rows)
    .map(rows => {
      
      rows.style.display = 'none';

      return rows;

    })
    .slice(0, rowsVisible)
    .map(rows => {
    
      rows.style.display = 'table-row';

    });

  let navLinks = nav.querySelectorAll('a');

  for (i = 0; i < navLinks.length; i++) {

    navLinks[i].addEventListener('click', navigate)

  };

  function navigate () { 

    let currentPage = this.attributes['rel'].value;

    console.log(currentPage)

    let startItem = currentPage * rowsVisible;

    let endItem = startItem + rowsVisible;

    Array.from(table.rows)
      .map(rows => {

        rows.style.display = 'none';

        return rows;

      })
      .slice(startItem, endItem)
      .map(rows => {

        rows.style.display = 'table-row';
        
      })

  };

  function nextPage() {

    for (i = 0; i < navLinks.length; i++) {

      navLinks[i].removeEventListener('click', navigate)

    };

    let currentPageLength = this.previousElementSibling['attributes'].rel.value;
    let lengthToNumber = Number(currentPageLength) + 1;
    let currentRemaining = numberOfPages - lengthToNumber;

    nav.querySelectorAll('a, span').forEach(item => item.parentElement.removeChild(item));

    createButton('previous');

    for (i = 0; i < currentRemaining; i++) {

      if (i === 5) {

        createButton('next');

        break;
      }

      let pageNumber = i + lengthToNumber + 1; 
      let createdLink = document.createElement('a');

      createdLink.rel = pageNumber - 1;
      createdLink.innerHTML = pageNumber;

      nav.appendChild(createdLink);

    };

    let navUpdated = nav.querySelectorAll('a');

    for (i = 0; i < navUpdated.length; i++) {

      navUpdated[i].addEventListener('click', navigate)

    };

  };

  function previousPage() {

    let currentPageLength = this.nextElementSibling['attributes'].rel.value;
    let lengthToNumber = Number(currentPageLength) + 1;
    let nextPagesRemaining = numberOfPages - lengthToNumber;
    let previousPagesRemaining = numberOfPages - nextPagesRemaining - 1;

    nav.querySelectorAll('a, span').forEach(item => item.parentElement.removeChild(item));

    let reverseList = [];

    for (i = 0; i < previousPagesRemaining; i++) {

      if (i === 5) {

        createButton('previous');

        break;
      };

      let index = i + 1;
      let pageNumber = lengthToNumber - index; 
      let createdLink = document.createElement('a');

      createdLink.rel = pageNumber - 1;
      createdLink.innerHTML = pageNumber;
  
      reverseList.push(createdLink);

    };

    reverseList
      .reverse()
      .forEach(item => {

        nav.appendChild(item);

      });

    createButton('next');

  };

  function createButton(type) {

    let method;
    let className;

    if (type === 'next') {

      method = nextPage;
      className = 'fa fa-arrow-right';

    } else if (type === 'previous') {

      method = previousPage; 
      className = 'fa fa-arrow-left';

    } 

    let createdButton = document.createElement('span');

    createdButton.addEventListener('click', method);
    createdButton.className = className;
    createdButton.style.cursor = 'pointer';

    nav.appendChild(createdButton);
    
  };

})();