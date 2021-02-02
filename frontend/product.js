// verify the existance of a cart in local.storage or create one as an array
if (localStorage.getItem("userCart")) {
  console.log("Cart already present in local storage");
} else {
  console.log("Created a cart in local storage");
  let cartInit = [];
  localStorage.setItem("userCart", JSON.stringify(cartInit));
};
let userCart = JSON.parse(localStorage.getItem("userCart"));

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

// promise for the fetch API request
getApiData = () => {
  return new Promise((objectSelected) => {
      let requestOptions = {
          method: 'GET',
          redirect: 'follow'
      };
      fetch((URL + idParams), requestOptions)
          .then(response => response.json())
          .then(result => objectSelected(result))
          .catch(error => {
              // error message
              apiFail = document.querySelector('.bloc2');
              apiFail.classList.add('fail__msg');
              apiFail.innerHTML = "Erreur de chargement de la page";
              console.error(error);
          });
  });
};

// show selected products on product.html
async function objectSelected() {
  let oneTeddy = await getApiData();
  //create an item in session.storage on load to keep the id and key/valuesof the product to avoid a 2nd API call on local.storage push
  let teddyInCache_json = JSON.stringify(oneTeddy);
  sessionStorage.setItem(oneTeddy._id, teddyInCache_json);

  // select the element where we want to to show the product
  let teddyBlocElt = document.querySelector('.bloc2__item');

  // create the elements to show the product
  let nameElt = document.createElement('h3');
  let picElt = document.createElement('img');
  let descriptionElt = document.createElement('p');
  let priceElt = document.createElement('p');

  teddyBlocElt.appendChild(nameElt);
  teddyBlocElt.appendChild(picElt);
  teddyBlocElt.appendChild(descriptionElt);
  teddyBlocElt.appendChild(priceElt);

  // add a class ot the price block
  priceElt.classList.add('bloc2__item--price');

  // get the values for the show element
  nameElt.textContent = (oneTeddy.name);
  picElt.src = oneTeddy.imageUrl;
  descriptionElt.textContent = (oneTeddy.description);
  priceElt.textContent = ("Prix:" + " " + oneTeddy.price / 100 + " " + "€");

  // create a cascading menu with the color choice
  let colorsOption = oneTeddy.colors;

  colorsOption.forEach((colors) => {
      let colorChoice = document.createElement('option')
      colorChoice.setAttribute
      document.getElementById("options").appendChild(colorChoice).innerHTML = colors;
  });
};
// add the product to the cart
addtoStorage = () => {
  //listen to the click event to put the item into local.storage
  let getInCart = document.getElementById("addtocart__btn");

  getInCart.addEventListener("click", async function () {
    // reuse idParams which matches the key of the object stored in session.storage
      let teddyInCache_json = sessionStorage.getItem(idParams);
      let teddyInCache = JSON.parse(teddyInCache_json);

      let teddyId = teddyInCache._id;
      let teddyName = teddyInCache.name;
      let teddyPrice = teddyInCache.price;

      // Recuperation des options des blocs select pour la quantité et la couleur
      let selectQuantity = document.getElementById("productQuantity");
      // transformation en type number de la valeur recuperé en type string
      let teddyQuantity = parseInt(selectQuantity.options[selectQuantity.selectedIndex].value);
      let selectColor = document.getElementById("options");
      let teddyColor = selectColor.options[selectColor.selectedIndex].text;
      let teddySubTotal = teddyQuantity * teddyPrice;

      //Récupération du panier dans le localStorage et ajout du produit dans le panier avant renvoi dans le localStorage
      userCart.push({
          teddyId,
          teddyName,
          teddyPrice,
          teddyQuantity,
          teddyColor,
          teddySubTotal
      });
      localStorage.setItem("userCart", JSON.stringify(userCart));

      // message à l'utilisateur pour lui indiquer l'ajout de son produit dans le panier
      let validationMessage = document.getElementById("validate__msg");
      validationMessage.textContent = ("Le produit a été ajouté au panier");

      function hideMessage() {
          document.getElementById("validate__msg").innerHTML = "";
      }
      window.setTimeout(hideMessage, 3000);
  });
};
