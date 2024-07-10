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
 

  document.getElementById('loginForm').onsubmit = async function (e) {
    e.preventDefault();
    const email = document.getElementById('exampleInputEmail').value;
    const password = document.getElementById('exampleInputPassword1').value;

    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    const headerMessage = "Please enter the OTP sent to " + email;
    const message = result.message;
    if (result.success) {
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('otpForm').style.display = 'block';
      document.getElementById('login-header').innerHTML = headerMessage;
      document.getElementById('emailForOtp').value = email;
      let time = 10;
      const ele = document.querySelector('.resend-OTPCode')
      // Function to update the timer
      const updateTimer = () => {
        if (time <= 0) {
          clearInterval(timeInterval); // Stop the timer when it reaches zero
          ele.innerHTML = "Not received your code?"
          const resendOtpBtn = document.createElement("button")
          resendOtpBtn.id = "resendOtpBtn";
          resendOtpBtn.className = 'btn-resendCode';
          resendOtpBtn.textContent = 'Resend Code';
          resendOtpBtn.type = "button"
          ele.appendChild(resendOtpBtn)

          //
          document.getElementById('resendOtpBtn').addEventListener("click", async () => {

            //clear otp input on click of resend otp button
            document.querySelectorAll('.otp-input').forEach((input) => {
              input.value='';
            });

            const response = await fetch('/auth/resendOTP', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
            })
            const result = await response.json();
            if (result.success) {
              displayToastify(result.message);
              time = 10;
              ele.innerHTML = `Not received your code? 00:10`;
              clearInterval(timeInterval); // Clear the previous interval
              setInterval(updateTimer, 1000); // Restart the interval to update the timer every second
            }
          })
        } else {
          const minutes = Math.floor(time / 60);
          const seconds = time % 60;
          const timeLeft = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
          const displayTimeLeft = `Not received your code? ${timeLeft}`;
          ele.innerHTML = displayTimeLeft;
          time--;
        }
      };

      // Start the interval to update the timer every second
      const timeInterval = setInterval(updateTimer, 1000);
      //display toast
      displayToastify(message);
    } else {
      // alert(result.message);
      displayToastify(message);
      //handle if user email not found render signup page
    }
  };

  //otp 
  document.querySelectorAll('.otp-input').forEach((input, index) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && index < 5) {
        document.querySelectorAll('.otp-input')[index + 1].focus();
      }
    });
    // for allowing only 0-9 number
    input.addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });

  });

  document.getElementById('otpForm').onsubmit = async function (e) {
    e.preventDefault();
    // const otp = document.getElementById('otp').value;
    let otp = '';
    document.querySelectorAll('.otp-input').forEach((input) => {
      otp += input.value;
    });
    // console.log(typeof(otp)+" ... "+typeof(parseInt(ot))
    // console.log(parseInt(otp))
    // const userOTP = parseInt(otp);
    const email = document.getElementById('emailForOtp').value;
    const response = await fetch('/auth/otpVerify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp, email }),
    });

    const result = await response.json();

    if (result.success) {
      console.log(result);
      window.location.href = '/'
    } else {
      // alert(result.message); 
      displayToastify("Invalid OTP");
    }
  };