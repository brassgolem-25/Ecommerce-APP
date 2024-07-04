//toastify
const displayToastify = (message) => {
    Toastify({
        text: message,
        duration: 2000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#FF4500",
        }
    }).showToast();
}

// add to wishlist script
const wishlistBtns = document.querySelectorAll('.wishlist-icon');

wishlistBtns.forEach((button) => {
    button.addEventListener('click', async (e) => {
        console.log("You clicked this: " + e.currentTarget + " " + e);
        const productName = e.currentTarget.getAttribute("data-product-name");

        const  isUserLoggedIn = document.cookie.includes('uid') ? true:false;
        if(isUserLoggedIn){
            const response = await fetch('/Wishlist/add', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productName: productName
                })
            })
            const result = await response.json();
            if (result.success) {
                displayToastify(result.message);
            } else {
                displayToastify(result.message);
            }
        }else {
            displayToastify("Please login to continue")
        }
    });
});

// add to cart functionality
const cartBtnList = document.querySelectorAll('.cart-icon');
cartBtnList.forEach((button)=>{
    button.addEventListener('click', async (event) => {
        event.preventDefault();
        const isUserLoggedIn = document.cookie.includes('uid') ? true:false;
        const productName = button.getAttribute('data-product-name');
        if (isUserLoggedIn) {
            try {
                const response = await fetch('/Cart/addToCart', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productName: productName
                    })
                })
                const result = await response.json();
                if (result.success) {
                    displayToastify(result.message);
                    // increase count in frontend
                    const cartItemCountElement = parseInt(document.getElementById('cartItemCount').textContent);
                    document.getElementById('cartItemCount').textContent = cartItemCountElement + 1;
                } else {
                    displayToastify(result.message);
                }
            }
            catch (error) {
                console.log(error);
            }
        } else {
            //
            displayToastify("Please login first!!")
        }
    })
})
