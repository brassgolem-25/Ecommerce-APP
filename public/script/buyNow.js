const button = document.querySelectorAll('.product-btn');
button.addEve
const pid = button[0].dataset.product_id;
fetch('/checkout/orderNow',{
  method:"POST",
  headers: {
            'Content-Type': 'application/json'
        },
body: JSON.stringify({
productId: pid // Send the product ID as an object
}),
}).then(reponse => reponse.JSON()).then(alert('buy'));