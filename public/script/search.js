
const searchInput = document.getElementById('searchInput');

let timeout = null;

searchInput.addEventListener('keyup', function (event) {
    const searchText = searchInput.value;
    // Clear the timeout if it has already been set.
    // This will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(timeout);

    // Make a new timeout set to go off in 1000ms (1 second)
    timeout = setTimeout(function () {
        // console.log('Input Value:', searchText);
        fetch('/search', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchText
            }),
        }).then(reponse => reponse.JSON());
    }, 1000);

})
