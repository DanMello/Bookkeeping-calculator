let pagination = (function () {

  let table = document.getElementById('mainData'); 
  let nav = document.getElementById('pagination');
  let rowsVisible = Math.floor(window.innerHeight / 31);

  function createFirstLinks() {

    let totalrows = table.rows.length;
    let numberOfPages = Math.ceil(totalrows / rowsVisible);

    for (i = 0; i < numberOfPages; ++i) {

      let pageNumber = i + 1;
      let createdLink = document.createElement('a');

      createdLink.rel = i;
      createdLink.innerHTML = pageNumber;

      nav.appendChild(createdLink);

      if (pageNumber === 5) {

        createButton('next');

        break;

      };

    };

    Array.from(table.rows)
      .map(rows => {
        
        rows.classList.add('hideTR');
        rows.classList.remove('displayTR');

        return rows;

      })
      .slice(0, rowsVisible)
      .map(rows => {
      
        rows.classList.remove('hideTR');
        rows.classList.add('displayTR');

      });

      let links = nav.querySelectorAll('a');

      links.forEach(link => link.addEventListener('click', navigate));

      links[0].style.color = "#0074D9";
    
  };

  function navigate (pageNum) {

    let currentPage;

    if (typeof pageNum === 'number') currentPage = pageNum
    else currentPage = Number(this.attributes['rel'].value)

    let startItem = currentPage * rowsVisible;

    let endItem = startItem + rowsVisible;

    Array.from(table.rows)
      .map(rows => {

        rows.classList.add('hideTR');
        rows.classList.remove('displayTR');

        return rows;

      })
      .slice(startItem, endItem)
      .map(rows => {

        rows.classList.remove('hideTR');
        rows.classList.add('displayTR');

      });

      let newLinks = nav.querySelectorAll('a')

      newLinks.forEach(item => {

        let number = Number(item.rel)

        if (number !== currentPage) item.style.color = 'black'
        else item.style.color = '#0074D9'

      })

  };

  function nextPage() {

    let currentPageLastIndex = this.previousElementSibling['attributes'].rel.value;
    let currentPageLength = Number(currentPageLastIndex) + 1;
    let nextPageNum = (currentPageLength + 5) / 5;
    let rowsPer5Pages = Math.floor(window.innerHeight / 31) * 5;
    let enoughRowsForNext = nextPageNum * rowsPer5Pages;

    let grabData = getAndPostData.bind(this);

    grabData(nextPageNum).then(() => {

      let totalrows = table.rows.length;
      let numberOfPages = Math.ceil(totalrows / rowsVisible);

      let numberOfPagesNeed = numberOfPages - currentPageLength;

      nav.querySelectorAll('a, span').forEach(item => item.parentElement.removeChild(item));

      createButton('previous');

      for (i = 0; i < numberOfPagesNeed; i++) {

        let pageNumber = i + currentPageLength + 1; 
        let createdLink = document.createElement('a');
        let index = i + 1;

        createdLink.rel = pageNumber - 1;
        createdLink.innerHTML = pageNumber;
        createdLink.className = 'navButtons'

        nav.appendChild(createdLink);

        if (index === 5 && table.rows.length >= enoughRowsForNext) {

          createButton('next');

          break;
        };

      };

      let navLinks = nav.querySelectorAll('a');

      for (i = 0; i < navLinks.length; i++) {

        navLinks[i].addEventListener('click', navigate);

      };

      navigate(currentPageLength)

    });

  };

  function previousPage() {

    let totalrows = table.rows.length;
    let numberOfPages = Math.ceil(totalrows / rowsVisible);

    let currentPageLastIndex = this.nextElementSibling['attributes'].rel.value;
    let currentPageLength = Number(currentPageLastIndex) + 1;
    let nextPagesRemaining = numberOfPages - currentPageLength;
    let previousPagesRemaining = numberOfPages - nextPagesRemaining - 1;

    nav.querySelectorAll('a, span').forEach(item => item.parentElement.removeChild(item));

    let reverseList = [];

    for (i = 0; i < previousPagesRemaining; i++) {

      if (i === 5) {

        createButton('previous');

        break;
      };

      let index = i + 1;
      let pageNumber = currentPageLength - index; 
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

    navLinks = nav.querySelectorAll('a');

    for (i = 0; i < navLinks.length; i++) {

      navLinks[i].addEventListener('click', navigate)

    };

    createButton('next');

    navigate(currentPageLastIndex - 1);

  };

  function createButton(type) {

    let method;
    let className;
    let id;

    if (type === 'next') {

      method = nextPage;
      className = 'fa fa-arrow-right';
      id = 'next'

    } else if (type === 'previous') {

      method = previousPage;
      className = 'fa fa-arrow-left';
      id = 'previous'; 

    };

    let createdButton = document.createElement('span');

    createdButton.addEventListener('click', method);
    createdButton.className = className;
    createdButton.id = id;
    createdButton.style.cursor = 'pointer';

    nav.appendChild(createdButton);
    
  };

  return {
    createFirstLinks
  };

})();
