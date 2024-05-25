  // for adding to cart
  const wishListButton = document.querySelectorAll('.wishList-btn')
  wishListButton.forEach(button => {
    button.addEventListener('click',async (e)=>{
    const pid = button.dataset.product_id;
    const heartIcon = button.querySelector('i');
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
                heartIcon.classList.add('fa-solid');
                heartIcon.classList.remove('fa-regular');
                heartIcon.style.color = "#ec4109"
                displayToast('toast-notification');
            }else {
                heartIcon.style.color = ""
                heartIcon.classList.remove('fa-solid');
                heartIcon.classList.add('fa-regular');
                console.log(heartIcon);
                // alert("Product removed from wishlist")
                displayToast('toast-notification');
            }

        } else if (response.url.includes('/auth/login')) {
            // Redirect to login page
            // window.location.href = '/auth/login';
            displayToast('toast-notification');
        } else {
            // Handle other errors
            console.error('Failed to update wishlist');
        }
    }catch(error){
        console.log(error);
    }
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