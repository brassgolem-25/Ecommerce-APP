  // for adding to cart
  const buttonList = document.querySelectorAll('.cart-btn')
  // console.log(buttonList);
  buttonList.forEach(button => {
    button.addEventListener('click',(e)=>{
    const pid = button.dataset.product_id;
    fetch('/cart/addTocart',{
      method:"POST",
      headers: {
                'Content-Type': 'application/json'
            },
  body: JSON.stringify({
    productId: pid // Send the product ID as an object
  }),
    }).then(response => response.JSON()).then(alert('Product Added!'));
  })
  })

// for adding to wish , tried to reuse the above the code but couldn't find anything 
  const wishbuttonList = document.querySelectorAll('.wishList-btn')
  console.log(wishbuttonList);
  wishbuttonList.forEach(button => {
    button.addEventListener('click',(e)=>{
    const pid = button.dataset.products_id;
    fetch('/wishList/addToWish',{
      method:"POST",
      headers: {
                'Content-Type': 'application/json'
            },
  body: JSON.stringify({
    productId: pid // Send the product ID as an object
  }),
    }).then(response => response.JSON()).then(alert('Product Added to WishList!'));
  })
  })