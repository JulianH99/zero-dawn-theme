function selectVariant(e) {
  e.preventDefault();
  e.stopPropagation();

  const variant = JSON.parse(e.target.getAttribute('data-variant'));
  const prodId = variant.featured_image.product_id;

  const prodContainer = document.querySelector(`[data-product-id="${prodId}"]`)

  const image = prodContainer.querySelector('img');
  const name = prodContainer.querySelector('.product__name')
  const price = prodContainer.querySelector('.product__price');
  prodContainer.setAttribute('data-selected-variant', JSON.stringify(variant))

  console.log(variant);

  image.src = variant.featured_image.src;
  image.width = variant.featured_image.with;
  image.height = variant.featured_image.height;

  name.innerHTML = variant.name;

  price.innerHTML = Intl.NumberFormat(Shopify.locale, {
    style: 'currency',
    currency: Shopify.currency.active,
  }).format(variant.price)
}


function preselectVariant(e) {
  const variant = JSON.parse(e.target.getAttribute('data-variant'));
  const prodId = variant.featured_image.product_id;

  const prodContainer = document.querySelector(`[data-product-id="${prodId}"]`)

  const image = prodContainer.querySelector('img');
  image.src = variant.featured_image.src;
}

function deselectVariant(e, productId,  productFeaturedImage) {
  const prodContainer = document.querySelector(`[data-product-id="${productId}"]`)
  const selectedVariant = prodContainer.getAttribute('data-selected-variant');
  let imageSrc = selectedVariant? JSON.parse(selectedVariant).featured_image.src : productFeaturedImage;
  const image = prodContainer.querySelector('img');
  image.src = imageSrc;
}