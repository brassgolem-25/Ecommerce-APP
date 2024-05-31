function displayToast(eleId,message){
    const toast = document.getElementById(eleId);
    const toastMessage = document.getElementById('toast-message');
    toastMessage.innerHTML=message;
    console.log(toastMessage)
        toast.classList.remove('hide');
        toast.classList.add('show');
        setTimeout(function () {
            toast.classList.remove('show');
            toast.classList.add('hide');
        }, 1500)
}