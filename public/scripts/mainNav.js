(function () {

  let navButton = document.querySelector('#navButton').addEventListener('click', openNav);

  function openNav (e) {

    e.stopPropagation();

    let nav = document.querySelector('#mainNav');
    let body = document.body;

    nav.style.width = '200px';

    body.addEventListener('click', closeNav);

    function closeNav (e) {

      if (e.target !== e.currentTarget) return false

      nav.style.width = '0px';

      body.removeEventListener('click', closeNav);

    };

  };

})();