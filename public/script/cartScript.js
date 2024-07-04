document.addEventListener('DOMContentLoaded', function () { 
    const qtyInputs = document.querySelectorAll('.qty');

    qtyInputs.forEach(qtyInput => {
        const qtyMinus = qtyInput.parentElement.querySelector('.qtyminus');
        const qtyPlus = qtyInput.parentElement.querySelector('.qtyplus');

        qtyMinus.addEventListener('click', function () {
            let qty = parseInt(qtyInput.value);
            if (qty > 1) {
                qtyInput.value = qty - 1;
            }
        });

        qtyPlus.addEventListener('click', function () {
            let qty = parseInt(qtyInput.value);
            qtyInput.value = qty + 1;
        });
    });

    const removeButtons = document.querySelectorAll('.remove-item');

    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const cartItem = this.closest('.cart-item');
            cartItem.style.display = 'none';
            cartItem.querySelector('.wishlist-option').style.display = 'block';
        });
    });
});

//remove item from Cart
const removeCartItemBtn = document.getElementById('removeCartItem');
removeCartItemBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    const productName = removeCartItemBtn.getAttribute('data-product-name');
    try{
        const response = await fetch('/Cart/deleteFromCart',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productName:productName
            })
        })
        const result = await response.json();
        if(result.success){
            console.log("Cart Item deleted");
            window.location.href='/Cart'
        }
    }catch(error){

    }
})