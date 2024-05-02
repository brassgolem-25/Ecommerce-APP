  // for adding to cart
  const wishListButton = document.querySelectorAll('.wishList-btn')
  // console.log(buttonList);
  wishListButton.forEach(button => {
    button.addEventListener('click',async (e)=>{
    const pid = button.dataset.product_id;
    const heartIcon = e.target;
    const isWishlisted = heartIcon.classList.contains('fa-solid');

    try{
        const response = await fetch(`/wishlist/${isWishlisted ? 'remove' : 'add'}`, {
            method: 'POST',
            body: JSON.stringify({ productId:pid }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok && !response.url.includes('/auth/login')) {
            // button.classList.toggle('wishlisted');
            if(!isWishlisted){
                heartIcon.classList.toggle('fa-solid');
                heartIcon.style.color = "#ec4109"
                alert("Product added to wishlist")
            }else {
                heartIcon.style.color = ""
                heartIcon.classList.toggle('fa-solid');
                alert("Product removed from wishlist")
            }

        } else if (response.url.includes('/auth/login')) {
            // Redirect to login page
            // window.location.href = '/auth/login';
            alert('Please login')
        } else {
            // Handle other errors
            console.error('Failed to update wishlist');
        }
    }catch(error){
        console.log(error);
    }
//     fetch('/cart/addTocart',{
//       method:"POST",
//       headers: {
//                 'Content-Type': 'application/json'
//             },
//   body: JSON.stringify({
//     productId: pid ,// Send the product ID as an object,
//     productSize: pSize
//   }),
//     }).then(response => response.JSON()).then(alert('Product Added!'));
  })
  })

//   function addToWhisList(e) {
//     var iconElement = e.getElementsByTagName('i')[0];
//     console.log(iconElement);
//     // iconElement.classList.toggle('fa-regular');
//     // iconElement.classList.toggle('fa-solid');
//     if (iconElement.classList[2] === 'fa-solid') {
//         console.log("Yes item is selected")
//         iconElement.style.color = ""
//     } else {
//         // iconElement.style = ""
//         iconElement.style.color = "#ec4109"
//         iconElement.classList.toggle('fa-solid');

//     }
// }