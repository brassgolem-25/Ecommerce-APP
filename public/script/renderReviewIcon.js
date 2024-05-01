console.log(productRating);


let review = productRating;

let rating = parseInt(review); // 2
let actualRating = parseFloat(review) // 2.3

let ratingLeft = 5 - Math.ceil(actualRating) ; // 5 - 3 = 2
console.log(ratingLeft);

while(ratingLeft>0){
    const imgElement = document.createElement("i");
    imgElement.className = "fa-regular fa-star";
    imgElement.style.color="#FFD43B"

    let parent = document.querySelector('.product-review');
    parent.prepend(imgElement);
    ratingLeft--;
}

if(actualRating-rating!==0){
    const imgElement = document.createElement("i");
    imgElement.className = "fa-solid fa-star-half-stroke";
    imgElement.style.color="#FFD43B"

    let parent = document.querySelector('.product-review');
    parent.prepend(imgElement);
}

while (rating > 0) {
    const imgElement = document.createElement("i");
    imgElement.className = "fa-solid fa-star";
    imgElement.style.color="#FFD43B"

    let parent = document.querySelector('.product-review');
    parent.prepend(imgElement);
    rating--;
}


// render page again when different size is chosen;
