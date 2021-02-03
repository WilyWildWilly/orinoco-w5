const URL = "http://localhost:3000/api/teddies/";
// this variable will complete the URL and is a key to the session.storage
let idParams;

//condition to attribute a value to idParams
const URLParams = new URLSearchParams(window.location.search);
let objectId = URLParams.get('id');
if (objectId === null) {
    idParams = "";
} else {
    idParams = objectId;
}

// promise for the fetch request to the API
getApiData = () => {
    return new Promise((objectList) => {
        let requestOptions = {
            method: 'GET', 
            redirect: 'follow'
        };
        fetch((URL + idParams), requestOptions)
            .then(response => response.json())
            .then(result => objectList(result))
            .catch(error => {
                // console message and user message
                apiFail = document.querySelector('.bloc2');
                apiFail.classList.add('fail__msg');
                apiFail.innerHTML = "Veuillez démarrer le serveur";
                console.error(error);
            });
    });
};

//show list of products in index.html
async function objectsList() {
    let teddies = await getApiData();
    console.log(teddies);

    // select an element to modify to show teddies list
    let teddiesList = document.querySelector('.bloc2');


    for (let teddy of teddies) {
        // create elements for the list
        let cardElt = document.createElement('article');
        let contentElt = document.createElement('div');
        let picElt = document.createElement('img')
        let nameElt = document.createElement('h3');
        let btnElt = document.createElement('a');

        //get the data we want to show
        picElt.src = teddy.imageUrl;
        nameElt.textContent = teddy.name;

        // append elements hierarchically
        teddiesList.appendChild(cardElt);
        cardElt.appendChild(contentElt);
        contentElt.appendChild(btnElt);
        btnElt.appendChild(picElt);
        btnElt.appendChild(nameElt);

        // attribute a class to the created element
        cardElt.classList.add('card');
        picElt.classList.add('card__pics');
        contentElt.classList.add('card__content');
        btnElt.classList.add('card__btn');
        nameElt.classList.add('bear__name')

        btnElt.setAttribute('href', './pages/product.html?id=' + teddy._id);
    };
};
