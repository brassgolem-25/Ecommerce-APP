  // for adding to cart
  const buttonList = document.querySelectorAll('.cart-btn')
  console.log(buttonList);
  buttonList.forEach(button => {
    button.addEventListener('click',(e)=>{
    const pid = button.dataset.products_id;
    fetch('/cart/addTocart',{
      method:"POST",
      headers: {
                'Content-Type': 'application/json'
            },
  body: JSON.stringify({
    productId: pid // Send the product ID as an object
  }),
    }).then(reponse => reponse.JSON()).then(alert('Product Added!'));
  })
  })