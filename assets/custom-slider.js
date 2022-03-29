(function() {
  const SERVER_BASE_URL = 'https://632f-190-146-238-178.ngrok.io'

  const fetchInfo = async () => {
    const { length: ordersQuantity } = await fetch(`${SERVER_BASE_URL}/orders`).then(res => res.json())
    const { length: usersQuantity } = await fetch(`${SERVER_BASE_URL}/users`).then(res => res.json())

    console.log(ordersQuantity, usersQuantity)
    document.querySelector('#orders-quantity').innerHTML = ordersQuantity;
    document.querySelector('#users-quantity').innerHTML = usersQuantity;
  
  }

  fetchInfo();
})();