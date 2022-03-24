

const numberFormat = Intl.NumberFormat(Shopify.locale, {
  style: 'currency',
  currency: Shopify.currency.active,
  currencyDisplay: 'narrowSymbol'
})

const fetchCart = () => fetch(`${window.Shopify.routes.root}cart.js`)
  .then(res => res.json());


const formatPrice = (price) => {
  const strPrice = price.toString()
  const priceNoZeros = strPrice.substring(0, strPrice.length - 2);

  const formattedNumber = numberFormat.format(Number(priceNoZeros))
  return `${formattedNumber} ${Shopify.currency.active}`;
}



const IconClose = () => (<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" className="icon icon-close" fill="none" viewBox="0 0 18 17">
<path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor" />
</svg>
)

const IconRemove = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false" role="presentation" className="icon icon-remove">
  <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"/>
  <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"/>
</svg>
)

function Header({ emptyCardEnabled, emptyCart, closeCart }) {
  return (
    <div className="mini-cart__header">
      <p>Estos son tus productos</p>
      <button type="button" id="empty-cart" disabled={!emptyCardEnabled}
        onClick={emptyCart}>
        Empty cart
      </button>
      <button type="button" id="close-mini-cart"
        onClick={closeCart}>
        <IconClose />
      </button>
    </div>
  )
}

function CartItem({ cartItem, updateCartItem }) {
  return (
    <li className="mini-cart__item">
      <div className={`mini-cart__item-picture`}>
        <img src={cartItem.image}
          alt={cartItem.title}
          width={cartItem.featured_image.width}
          height={cartItem.featured_image.height} />
      </div>
      <div className="mini-cart__item-body">
        <p className="mini-cart__item-name">
          <a href={cartItem.url}>{cartItem.title}</a>
        </p>
        <p className="mini-cart__item-price">{formatPrice(cartItem.price)}</p>
      </div>
      <div className="mini-cart__item-actions">
        <div className="mini-cart__item-input">
          <button onClick={() => updateCartItem(cartItem.id, cartItem.quantity - 1)}>
            -
          </button>
          <input type="number" readOnly value={cartItem.quantity} />
          <button onClick={() => updateCartItem(cartItem.id, cartItem.quantity + 1)}>
            +
          </button>
        </div>

        <button className="mini-cart__item-remove"
          onClick={() => updateCartItem(cartItem.id, 0)}>
          <IconRemove />
        </button>
      </div>
    </li>
  );
}

function CartItems({ cartItems = [], updateCartItem }) {
  return (<ul className="mini-cart__items">
    {cartItems.map(cartItem => (<CartItem
      cartItem={cartItem}
      updateCartItem={updateCartItem}
      key={cartItem.id}
    />))}
  </ul>);
}

function Footer({ totalPrice, showCartButton }) {
  return (<div className="mini-cart__footer">
    <div className="mini-cart__summary">
      <p>Total to pay:</p>
      <p className="mini-cart__price">{formatPrice(totalPrice)}</p>
    </div>

    {showCartButton && (<a className="mini-cart__checkout"
      href="/cart">
      Go to cart
    </a>)}

  </div>)
}

function Loader({showLoader}) {
  return (
    <div className={`mini-cart__loader ${showLoader ? 'mini-cart__loader--shown': ''}`}>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div> 
  )
}


function Minicart() {

  const [cart, setCart] = React.useState({});
  const [showLoader, setShowLoader] = React.useState(false);

  const externalEventHandler = async  (e) => {
      setShowLoader(true);
      const cart = await fetchCart();

      setCart(cart);
      setShowLoader(false);
  };

  // add event handler to every product to know when they have been clicked
  React.useEffect(() => {
    window.addEventListener('fetchCart', externalEventHandler)
  }, []);

  React.useEffect(() => {
    console.log("Executing effect");
    fetchCart().then(res => setCart(res));
  }, []);


  const emptyCart = async () => {
    setShowLoader(true);
    const cart =  await fetch(`${window.Shopify.routes.root}cart/clear.js`, {method: 'post'})
      .then(res => res.json())
  
    setCart(cart);
    setShowLoader(false);
  }

  const closeCart = () => {
    window.closeMiniCart();
  }

  const updateCartItem = async (itemId, quantity) => {
    setShowLoader(true);
    const cart = await fetch(`${window.Shopify.routes.root}cart/update.js`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        updates: {
          [itemId]: quantity
        }
      })
    }).then((res) => res.json())

    setCart(cart)
    setShowLoader(false);
      
  }


  return (
    <React.Fragment>
      <Header emptyCardEnabled={cart.items && cart.items.length > 0}
        emptyCart={emptyCart}
        closeCart={closeCart} />
      <CartItems cartItems={cart.items} updateCartItem={updateCartItem} />
      <Footer totalPrice={cart.total_price || 0} showCartButton={cart.items && cart.items.length > 0} />
      <Loader showLoader={showLoader}/>
    </React.Fragment>
  )
}

ReactDOM.render(<Minicart />, document.querySelector('#react-root'))