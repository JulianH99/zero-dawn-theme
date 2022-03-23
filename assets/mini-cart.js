function addToCart(variantId) {
  const form = document.querySelector(`#add-to-cart-${variantId}`)
  const formData = new FormData(form);
  const jsonCart = {
    items: [

    ]
  }
  formData.forEach((value, key) => jsonCart.items.push({ [key]: value }));
  jsonCart.items = jsonCart.items.map(item => ({ ...item, quanity: 1 }))

  fetch(`${Shopify.routes.root}${'cart/add.js'}`, {
    method: 'post',
    body: JSON.stringify(jsonCart),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      openAndUpdateMiniCart();
    }
  })
}


async function openAndUpdateMiniCart() {
  openMiniCart();
  openLoader();
  await updateMinicart();
  closeLoader();
}




async function updateMinicart() {
  // update function
  
  const response = await fetch(`${Shopify.routes.root}?sections=mini-cart`);
  const json_response = await response.json();
  const htmlContent = json_response['mini-cart'];
  const parsedContent = new DOMParser().parseFromString(htmlContent, 'text/html');

  const items = parsedContent.querySelector('.mini-cart__items').innerHTML;
  const footer = parsedContent.querySelector('.mini-cart__footer').innerHTML;
  const header = parsedContent.querySelector('.mini-cart__header').innerHTML;


  const miniCart = document.querySelector('.mini-cart');

  miniCart.querySelector('.mini-cart__items').innerHTML = items;
  miniCart.querySelector('.mini-cart__footer').innerHTML = footer;
  miniCart.querySelector('.mini-cart__header').innerHTML = header;  
}

function openMiniCart() {

  document.body.style.overflowY = 'hidden';

  document
    .querySelector('.mini-cart')
    .classList
    .add('mini-cart--open');
}

function closeMiniCart() {
  document
    .querySelector('.mini-cart')
    .classList
    .remove('mini-cart--open');
  
  document.body.style.overflowY = 'auto';
}


function decrement(itemId, quantity) {
  performUpdate(itemId, quantity - 1);
}

function increment(itemId, quantity) {
  performUpdate(itemId, quantity + 1);
}

function removeProduct(itemId) {
  performUpdate(itemId, 0);
}

function emptyCart() {
  openLoader();
  fetch(`${Shopify.routes.root}cart/clear.js`, {
    method: 'post'
  })
    .then(res => updateMinicart())
    .then(() => closeLoader())
}

function performUpdate(itemId, quantity) {
  openLoader();
  fetch(`${Shopify.routes.root}cart/update.js`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      updates: {
        [itemId]: quantity,
      }
    })
  }).then(res => updateMinicart())
    .then(() => closeLoader())
}


function openLoader() {
  document.querySelector('.mini-cart__loader')
    .classList.add('mini-cart__loader--shown');
}

function closeLoader() {
  document.querySelector('.mini-cart__loader')  
    .classList.remove('mini-cart__loader--shown');
}