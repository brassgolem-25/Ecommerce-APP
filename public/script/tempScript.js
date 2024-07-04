//
const qtyInputs = document.querySelectorAll('.qty');
console.log(qtyInputs)

qtyInputs.forEach(qtyInput => {
    const qtyMinus = qtyInput.parentElement.querySelector('.qtyminus');
    const qtyPlus = qtyInput.parentElement.querySelector('.qtyplus');

    qtyMinus.addEventListener('click', function() {
        let qty = parseInt(qtyInput.value);
        if (qty > 1) {
            qtyInput.value = qty - 1;
        }
    });

    qtyPlus.addEventListener('click', function() {
        let qty = parseInt(qtyInput.value);
        qtyInput.value = qty + 1;
    });
});   

// show password 
const currLocation = window.location.href;
console.log(currLocation)
if((currLocation.includes('login')) || (currLocation.includes('signup'))){
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#exampleInputPassword1');
togglePassword.addEventListener('click', function (e) {
  // Toggle the type attribute using getAttribute() method
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  
  // Toggle the eye slash icon
  this.classList.toggle('fa-eye');
  this.classList.toggle('fa-eye-slash');
});
}
