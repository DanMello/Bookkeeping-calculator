(function () {

  let body = document.body;
  let mainContainer = body.querySelector('#mainContainer');

  console.log('loading')

  let loader = document.createElement('div');

  mainContainer.style.display = 'none'

  loader.id = 'loading';
  loader.style.border = '16px solid #f3f3f3';
  loader.style['border-top'] = '16px solid #3498db';
  loader.style['border-radius'] = '50%';
  loader.style.width = "120px";
  loader.style.height = "120px";
  loader.style.position = 'absolute';
  loader.style.top = '50%';
  loader.style.left = '50%';
  loader.style['margin-top'] = '-60px';
  loader.style['margin-left'] = '-60px';
  loader.style.animation = 'spin 1s linear infinite'

  body.appendChild(loader);

  window.onload = function loaded () {

    console.log('loaded')
      
    let loader = document.getElementById('loading');

    if (loader !== null) {

      loader.parentElement.removeChild(loader);

      mainContainer.style.display = 'block'
      
    }

  };

})();



