// for adding to cart
const buttonList = document.querySelectorAll('.cart-btn')

// console.log(buttonList);
console.log(document.querySelector('.active-size').dataset.productSize);
console.log(document.querySelector('.active-size').textContent)
const pSize = document.querySelector('.active-size').textContent;
console.log(userLoggedIn)

buttonList.forEach(button => {
  button.addEventListener('click', (e) => {
    if (userLoggedIn === "false") {
      displayToast('toast-notification', 'Please Login');
    } else {
      const pid = button.dataset.product_id;
      fetch('/cart/addTocart', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: pid,// Send the product ID as an object,
          productSize: pSize
        }),
      }).then(response => response.JSON()).then(
        displayToast('toast-notification', 'product added to cart')
      );
    }
  })
})