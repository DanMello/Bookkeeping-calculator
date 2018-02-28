(function () {

  let printButton = document.querySelector('#print').addEventListener('click', letsPrint)

  function letsPrint() {

  let table = document.getElementById('mainTable');

  Array.from(table.rows)
    .map(rows => {

      rows.style.display = 'table-row';

    })

  window.print();

  }

})();
