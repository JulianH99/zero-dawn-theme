function addToCart(productId) {

  const variantId = document.querySelector(`#add-to-cart-${productId} input[name="id"]`).value;
  const jsonCart = {
    items: [
      {
        id: variantId,
        quantity: 1
      }
    ]
  }

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
  const response = await fetch(`${Shopify.routes.root}?sections=mini-cart`);
  const json_response = await response.json();
  
  const htmlContent = json_response['mini-cart'];
  const parsedContent = new DOMParser().parseFromString(htmlContent, 'text/html');

  const blocksToRender = ['items', 'footer', 'header']
  const miniCart = document.querySelector('.mini-cart');

  blocksToRender.forEach(block => {
    const selector = `.mini-cart__${block}`
    const content = parsedContent.querySelector(selector).innerHTML;
    miniCart.querySelector(selector).innerHTML = content;
  })
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
    .then(() => updateMinicart())
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
  }).then(() => updateMinicart())
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