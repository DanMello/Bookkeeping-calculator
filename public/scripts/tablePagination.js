(function () {

  let table = document.getElementById('mainTable');
  let nav = document.getElementById('pagination');
  
  let rowsVisible = Math.floor(window.innerHeight / 32);
  let totalrows = table.rows.length;
  let numberOfPages = totalrows / rowsVisible;

  for (i = 0; i < numberOfPages; i++) {

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

  let navLinks = nav.childNodes;

  for (i = 0; i < navLinks.length; i++) {

    navLinks[i].addEventListener('click', navigate)

  };

  function navigate () { 

    let currentPage = this.attributes['rel'].value;

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

})();