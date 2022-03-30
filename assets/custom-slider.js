(function() {
  const SERVER_BASE_URL = 'https://632f-190-146-238-178.ngrok.io'

  const fetchInfo = async () => {
    const ordersElem = document.querySelector('#orders-quantity');
    const usersElem = document.querySelector('#users-quantity');


    try {

      const { length: ordersQuantity } = await fetch(`${SERVER_BASE_URL}/orders`).then(res => res.json())
      const { length: usersQuantity } = await fetch(`${SERVER_BASE_URL}/users`).then(res => res.json())

      ordersElem.innerHTML = ordersQuantity;
      usersElem.innerHTML = usersQuantity;
    } catch(e) {
      ordersElem.innerHTML = 'XXX';
      usersElem.innerHTML = 'XXX';
    }

    
    
  
  }

  fetchInfo();



  const leftButton = document.querySelector('.custom-slider__arrow--left');
  const rightButton = document.querySelector('.custom-slider__arrow--right');
  const sliderInner = document.querySelector('.custom-slider__inner');
  const maxSlides = getComputedStyle(
    sliderInner
  ).getPropertyValue('--block-number');

  leftButton.addEventListener('click', function() {
    const sliderLeft = parseInt(sliderInner.style.left.replace('%','')) || 0;
    if(sliderLeft !== 0) {
      sliderInner.style.left = sliderLeft + 100 + '%';
    }
  })

  rightButton.addEventListener('click', function() {
    const sliderLeft = parseInt(sliderInner.style.left.replace('%','') || 0);
    if(sliderLeft !== (maxSlides-1)*(-100)) {
      sliderInner.style.left = sliderLeft - 100 + '%';
    }
  })


})();