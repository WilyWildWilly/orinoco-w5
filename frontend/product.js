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

  /* Création d'un item dans session.storage au chargement de la page pour conserver l'ID et les keys / value des produits consultés 
  afin d'eviter un second appel de l'API lors du push dans le local.storage */
  let teddyInCache_json = JSON.stringify(oneTeddy);
  sessionStorage.setItem(oneTeddy._id, teddyInCache_json);

  // selection d'un élément du DOM pour l'affichage du produit selectionné
  let teddyBlocElt = document.querySelector('.bloc2__item');

  // creation des éléments du DOM necessaire a l'affichage du produit
  let nameElt = document.createElement('h3');
  let picElt = document.createElement('img');
  let descriptionElt = document.createElement('p');
  let priceElt = document.createElement('p');

  teddyBlocElt.appendChild(nameElt);
  teddyBlocElt.appendChild(picElt);
  teddyBlocElt.appendChild(descriptionElt);
  teddyBlocElt.appendChild(priceElt);

  // ajout d'une class au bloc price
  priceElt.classList.add('bloc2__item--price');

  // recuperation des valeur necessaire à l'affichage dans les élément créés
  nameElt.textContent = (oneTeddy.name);
  picElt.src = oneTeddy.imageUrl;
  descriptionElt.textContent = (oneTeddy.description);
  priceElt.textContent = ("Prix:" + " " + oneTeddy.price / 100 + " " + "€");

  // création du menu déroulant pour la selection des options du produit
  let colorsOption = oneTeddy.colors;

  colorsOption.forEach((colors) => {
      let colorChoice = document.createElement('option')
      colorChoice.setAttribute
      document.getElementById("options").appendChild(colorChoice).innerHTML = colors;
  });
};

//Fonction ajouter le produit au panier de l'utilisateur
addtoStorage = () => {
  //Ecouter l'événement clic pour mettre le produit dans le local.storage
  let getInCart = document.getElementById("addtocart__btn");

  getInCart.addEventListener("click", async function () {
      //reutilisation de la variable idParams qui correspond aussi à la key de l'objet stocké dans le session storage
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
