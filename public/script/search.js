
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function(event) {
    const searchText = event.target.value;
    fetch('/search',{
        method:"POST",
        headers: {
                  'Content-Type': 'application/json'
              },
    body: JSON.stringify({
        searchText// Send the product ID as an object
    }),
      }).then(reponse => reponse.JSON());
    })
