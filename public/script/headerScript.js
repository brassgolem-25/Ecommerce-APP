document.addEventListener('DOMContentLoaded', async () => {
    // document.cookie='uid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT'
    const cartItemCountElement = document.getElementById('cartItemCount');
    cartItemCountElement.textContent=0;
    const isUserLoggedIn = document.cookie.includes('uid') ? true:false;
    let carItem = null;
    if (isUserLoggedIn) {
        if(carItem==null){
            carItem = await fetchCartItemCount();
        }
        // if(item)
        cartItemCountElement.textContent = carItem;
    }
});



async function fetchCartItemCount(){
    try{
        const response = await fetch('/Cart/ItemCount', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const result = await response.json();
        // console.log(result.message);
        const items = result.message;
        return items;
    }catch(error){
        console.log(error);
    }
}