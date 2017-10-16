function loader() {

  console.log('loading')

  let body = document.body;

  let loaderContainer = document.createElement('div');

  loaderContainer.id = 'loaderContainer';
  loaderContainer.style.border = '17px dotted #3498db';
  loaderContainer.style['border-radius'] = '50%';
  loaderContainer.style.width = '120px';
  loaderContainer.style.height = '120px';
  loaderContainer.style.animation = 'spin 2s linear infinite';
  loaderContainer.style.position = 'absolute';
  loaderContainer.style.left = '50%';
  loaderContainer.style.top = '50%';
  loaderContainer.style['margin-left'] = '-60px';
  loaderContainer.style['margin-top'] = '-60px';

  body.appendChild(loaderContainer);
  
};

function done() {

  console.log('loaded')
    
  let loader = document.getElementById('loaderContainer');

  if (loader !== null) {

    loader.parentElement.removeChild(loader);
    
  };

};


