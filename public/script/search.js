
const searchInput = document.getElementById('searchInput');

let timeout = null;
searchInput.addEventListener('keyup', function (event) {
    const searchText = searchInput.value;
    // Clear the timeout if it has already been set.
    // This will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(timeout);

    // Make a new timeout set to go off in 1000ms (1 second)
    timeout = setTimeout(async () => {
        // console.log('Input Value:', searchText);
       const response = await fetch('/search', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchText
            }),
        });
        const result = await response.json();
        console.log(result);
        const searchDropdown = document.getElementById("searchDropdown");

        // Clear previous results
        searchDropdown.innerHTML = '';

        // Append new results
        result.forEach(item => {
            const productElement = document.createElement('div');
            productElement.className = 'dropdown-item'; 
            const productId = item.id;
            productElement.innerHTML = `
            <a href='/product/${item.name}' style="text-decoration:none;color:black">${item.name}</a>
            `; // Set the content of the dropdown item
            searchDropdown.appendChild(productElement);
        });

        // // Show the dropdown if there are results
        if (result.length > 0) {
            searchDropdown.classList.add('visible-dropdown');
        } else {
            searchDropdown.classList.remove('visible-dropdown');
        }
    }, 1000);
})

// clear searchinput or anyother 
document.body.addEventListener('click',()=>{
    const searchDropdown = document.getElementById("searchDropdown");

    // Clear previous results
    searchInput.value = '';
    searchDropdown.classList.remove('visible-dropdown');
})