function triggerOrder(e) {
  // console.log('Hi')
  const pid = e.dataset.product_id;
  fetch('/checkout/order', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      productId: pid // Send the product ID as an object
    }),
  }).then(response => response.json());
}
