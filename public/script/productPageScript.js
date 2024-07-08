const validateUserPincode = document.getElementById('checkDelivery');
validateUserPincode.addEventListener('click', () => {
    const userPincode = document.getElementById('pincode').value;
    const deliveryResult = document.getElementById('deliveryResult');
    // console.log(userPincode.length)
    if (userPincode.length < 6) {
        setTimeout(() => {
            deliveryResult.innerHTML = 'Please type Correct Pincode';
        }, 1000);
    } else {
        setTimeout(() => {
            deliveryResult.innerHTML = 'The Product will ship within 2-3 days';
        }, 1000);
    }
    deliveryResult.innerHTML = '';

})

const reviewTab = document.getElementById('review-tab');
const descriptionTab = document.getElementById('description-tab')
const reviewForm = document.getElementById('review')
const description = document.getElementById('description')

reviewTab.addEventListener('click', () => {
    reviewForm.classList.add('show');
    reviewForm.classList.add('active');

    description.classList.remove('show');
    description.classList.remove('active');

})

descriptionTab.addEventListener('click', () => {
    reviewForm.classList.remove('show');
    reviewForm.classList.remove('active');

    description.classList.add('show');
    description.classList.add('active');
})

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

//user login?
const isUserLoggedIn = document.cookie.includes('uid') ? true : false;
//Payment Page Script
const nextButtons = document.querySelectorAll('.next-btn');
const prevButtons = document.querySelectorAll('.prev-btn');
const dots = document.querySelectorAll('.progress-dot');
const progress = document.getElementById('progress')
const wraps = document.querySelectorAll('.text-wrap')

let currentActive = 1

nextButtons.forEach(button => {
    button.addEventListener('click', async function () {
        const currentStep = button.closest('.step-content');
        const nextStepId = button.getAttribute('data-next-step');
        const nextStep = document.getElementById(nextStepId);

        currentActive++;
        if (currentActive > wraps.length) {
            currentActive = wraps.length
        }

        //check if current Step is address then validate address
        // if (currentStep.id === 'addressStep') {
        //     console.log(currentStep);
        //     const locality = document.getElementById('locality').value;
        //     const state = document.getElementById('state').value;
        //     const userPincode = document.getElementById('userPincode').value;

        //     if (!locality || !state || !userPincode) {
        //         //show toastify
        //         displayToastify("Please fill all the Details")
        //         return;
        //     }
        //     try {
        //         const response = fetch('/Account/userAddress', {
        //             method: "POST",
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify({
        //                 locality: locality,
        //                 state: state,
        //                 userPincode: userPincode
        //             })
        //         })
        //         const result = await response;
        //         console.log(result);
        //         if (result.success) {
        //             currentStep.classList.remove('active');
        //             nextStep.classList.add('active');
        //             update();
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }

        // }

        if (nextStepId === 'paymentStep') {
            // const payNowButton = document.getElementById('pay-now-button');
            const paymentLoader = document.querySelector('.payment-loader');
            const completePayment = document.querySelector('.complete-payment');
            const paymentCompleted = document.querySelector('.payment-completed');
            const paymentFailed = document.querySelector('.paymentFailed');

            const nextBtn = document.querySelector('.next-btn[data-next-step="paymentStep"]');
            const productName = document.getElementById("buyNowProduct").getAttribute('data-product-name');
            const productQuantity = document.getElementById("productQuantity").value;
            console.log(productQuantity);

            const cost = document.getElementById("buyNowProduct").getAttribute('data-product-cost')
            if (isUserLoggedIn) {
                const response = await fetch('/product/processPayment', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productName: productName,
                        cost: cost
                    })
                })
                const result = await response.json();
                console.log(result);
                if (result.success) {
                    displayToastify(result.message);
                    const redirectUrl = result.url;
                    const clientordNumber = result.clientordNumber;
                    //for redirecting to order Page
                    const checkPaymentStatus = async () => {
                        try {
                            const paymentStatus = await fetch('/payment/paymentStatus', {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    orderNumber: clientordNumber,
                                })
                            });

                            const paymentStatusJson = await paymentStatus.json();
                            console.log("Payment Status:", JSON.stringify(paymentStatusJson));

                            if (paymentStatusJson.isPaymentCompleted) {
                                completePayment.style.display = 'none';
                                paymentCompleted.style.display = 'block';
                                const clientPaymentMethod = paymentStatusJson.paymentMethod;

                                setTimeout(async () => {
                                    paymentCompleted.style.display = 'none';
                                    update();
                                    document.getElementById('trackingStep').style.display = 'block';
                                    updateReviewStep(clientordNumber, clientPaymentMethod);
                                    document.getElementById('paymentStep').style.display = 'none';
                                }, 4000);

                                return; // Exit the function as payment is completed
                            }

                            // Payment not completed, continue polling
                            setTimeout(checkPaymentStatus, 5000);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    setTimeout(async () => {
                        paymentLoader.style.display = 'none';
                        completePayment.style.display = 'block';
                        window.open(redirectUrl, '_blank');
                        checkPaymentStatus();
                    }, 2000)

                } else {
                    displayToastify(result.message)
                }

            }

            // setTimeout(() => {
            //     paymentLoader.style.display = 'none';
            //     completePayment.style.display = 'block';

            //     // Simulate user completing payment on another page
            //     setTimeout(() => {
            //         completePayment.style.display = 'none';
            //         paymentCompleted.style.display = 'block';

            //         // Simulate payment completion and move to the next step
            //         setTimeout(() => {
            //             paymentCompleted.style.display = 'none';
            //             document.getElementById('trackingStep').style.display = 'block';
            //             document.getElementById('paymentStep').style.display = 'none';
            //         }, 3000);
            //     }, 2000); // Simulate a 2-second delay for user to complete payment
            // }, 2000); // Simulate a 2-second initial payment loading
        }

        currentStep.classList.remove('active');
        nextStep.classList.add('active');
        update();

        // updateProgressBar();
    });
});


prevButtons.forEach(button => {
    button.addEventListener('click', function () {
        const currentStep = button.closest('.step-content');
        const prevStepId = button.getAttribute('data-prev-step');
        const prevStep = document.getElementById(prevStepId);

        currentStep.classList.remove('active');
        prevStep.classList.add('active');

        currentActive--;
        if (currentActive < 1) {
            currentActive = 1;
        }

        update();
    });
});

// Buy Now Function Start
const buyNowBtn = document.getElementById('buyNowProduct');
buyNowBtn.addEventListener('click', (event) => {
    // check if user is loggedIn
    if (!isUserLoggedIn) {
        displayToastify('Please login to continue');
    } else {
        const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
        event.preventDefault();
        paymentModal.show();
        // cardDetails.classList.remove('d-none');
        // upiDetails.classList.add('d-none');
        // // updateProgressBar();
        // //close payment Page

        // document.getElementById('closePaymentPage').addEventListener('click', () => {
        //     paymentModal.hide();
        // })
    }
})

// const paymentMethodSelect = document.getElementById('paymentMethod');
// const cardDetails = document.getElementById('cardDetails');
// const upiDetails = document.getElementById('upiDetails');

// //validate payment method
// paymentMethodSelect.addEventListener('change', function () {
//     if (this.value === 'card') {
//         cardDetails.classList.remove('d-none');
//         upiDetails.classList.add('d-none');
//     } else if (this.value === 'upi') {
//         cardDetails.classList.add('d-none');
//         upiDetails.classList.remove('d-none');
//     }
// });


function update() {
    wraps.forEach((wrap, index) => {
        if (index < currentActive) {
            wrap.classList.add('active')
        } else {
            wrap.classList.remove('active')
        }
    })

    const actives = document.querySelectorAll('.active')
    progress.style.width = (actives.length - 1) / (wraps.length - 1) * 80 + '%'

    // if(currentActive === 1) {
    //     back.disabled = true
    // } else if(currentActive === wraps.length) {
    //     next.disabled = true
    // } else {
    //     back.disabled = false
    //     next.disabled = false
    // }
}

//update Review Page
const updateReviewStep = (clientordNumber, clientPaymentMethod) => {
    document.getElementById('orderNumber').textContent = clientordNumber;
    if (clientPaymentMethod == "UPI") {
        document.getElementById('paymentTypeImg').src = "../images/upi.jpg"
    }
    document.getElementById('paymentMethod').textContent = "Online " + clientPaymentMethod;
}

// add to cart functionality
const cartBtn = document.getElementById('addToCart');
cartBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const productName = cartBtn.getAttribute('data-product-name');
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