loadCartPage = () => {

  if (localStorage.getItem("userCart")) {
      const cartToDisplay = JSON.parse(localStorage.getItem("userCart"));
      console.log(cartToDisplay);

      //select DOM element where cart status will be shown
      const displayCart = document.getElementById("bloc2__title");
      displayCartTitle = document.createElement("h2");
      displayCart.append(displayCartTitle);

      const cartBloc = document.getElementById('cart__bloc');

      // verify if product is in local storage
      if (cartToDisplay.length === 0) {
          displayCartTitle.textContent = "Votre panier est vide";
          removeCart = document.getElementById("bloc2__cart");
          removeCart.remove();
      } else {
          displayCartTitle.textContent = "Contenu de votre panier";


          /* show items in cart */
          for (let i = 0; i < cartToDisplay.length; i++) {
              const itemInCart = cartToDisplay[i];

              const itemName = itemInCart.teddyName;
              const itemQuantity = itemInCart.teddyQuantity;
              const itemColor = itemInCart.teddyColor;
              const itemPrice = ((itemInCart.teddySubTotal / 100) + "€");

              let row = cartBloc.insertRow(-1);

              let nameCell = row.insertCell(0);
              nameCell.innerText = itemName;

              let colorCell = row.insertCell(1);
              colorCell.innerText = itemColor

              /* add button */
              let quantityCell = row.insertCell(2);
              quantityCell.setAttribute('id', 'quantity_cell');
              const addItem = document.createElement('button');
              addItem.setAttribute('id', 'add_button')
              addItem.textContent = ('+')

              /* add one to cart */
              addItem.addEventListener('click', () => {
                  if (itemQuantity < 9) {
                      itemInCart.teddyQuantity++;
                      itemInCart.teddySubTotal = itemInCart.teddyQuantity * itemInCart.teddyPrice;
                      localStorage.setItem('userCart', JSON.stringify(cartToDisplay));
                      window.location.reload();
                  }
              });

              /* remove button */
              const substractItem = document.createElement('button');
              substractItem.setAttribute('id', 'substract_button')
              substractItem.textContent = ('-')
              quantityCell.append(substractItem, itemQuantity, addItem);

              /* remove an object from the cart */
              substractItem.addEventListener('click', () => {
                  if (itemQuantity >= 2) {
                      itemInCart.teddyQuantity--;
                      itemInCart.teddySubTotal = itemInCart.teddyQuantity * itemInCart.teddyPrice;
                      localStorage.setItem('userCart', JSON.stringify(cartToDisplay));
                      window.location.reload();
                  }
              });

              /* delete button */
              let deleteCell = row.insertCell(3);
              const deleteItem = document.createElement('button');
              deleteItem.setAttribute('id', 'delete_button');
              deleteItem.textContent = ('X');
              deleteCell.append(deleteItem);

              /* delete an object from the cart */
              deleteItem.addEventListener('click', () => {
                  localStorage.removeItem[i];
                  cartToDisplay.splice(i, 1);
                  localStorage.setItem('userCart', JSON.stringify(cartToDisplay));
                  window.location.reload();
              });

              let priceCell = row.insertCell(4);
              priceCell.innerText = itemPrice;

              // show cart total
              let totalPrice = 0;
              cartToDisplay.forEach((itemInCart) => {
                  totalPrice += itemInCart.teddySubTotal / 100;
              });
              console.log(totalPrice);
              document.getElementById('total_cart').textContent = totalPrice + "€";

              //show form on click 
              const openOrder = document.getElementById('order__btn');
              openOrder.addEventListener('click', () => {
                  document.getElementById('bloc2__order').style.display = 'block';
              });
          }
      }
  } else {
      const displayCart = document.getElementById("bloc2__title");
      displayCartTitle = document.createElement("h2");
      displayCart.append(displayCartTitle);
      displayCartTitle.textContent = "Votre panier est vide";
      removeCart = document.getElementById("bloc2__cart");
      removeCart.remove();
  }
};

const URL = "http://localhost:3000/api/teddies/";

// pass the order
sendOrder = () => {

  // get contact and cart content before sending
  let cartToSend = JSON.parse(localStorage.getItem("userCart"));
  let checkForm = document.getElementById('contactbloc');
  const clickToSend = document.getElementById('validorder__btn');

  clickToSend.addEventListener('click', ($event) => {

      $event.preventDefault();
      document.getElementById('bloc2__order').style.display = 'block';
      let lastName = document.getElementById('lastname').value;
      let firstName = document.getElementById('firstname').value;
      let email = document.getElementById('email').value;
      let address = document.getElementById('address').value;
      let city = document.getElementById('city').value;

      // create contact
      let contact = {
          lastName,
          firstName,
          email,
          address,
          city
      };

      // create products array
      const products = [];
      cartToSend.forEach(item => {
          products.push(item.teddyId)
      });

      //POST request

      const request = new Request((URL + "order"), {
          method: 'POST',
          // JSON verification
          body: JSON.stringify({
              contact,
              products
          }),
          headers: new Headers({
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          })
      });
      if (checkForm.checkValidity() === true) {
          fetch(request)
              .then(response => response.json())
              .then(response => {

                  let getOrderId = response.orderId;
                  let getTotalPrice = document.getElementById('total_cart').textContent;
                  localStorage.clear();
                  let validOrder = {
                      getOrderId,
                      getTotalPrice
                  };
                  sessionStorage.setItem("confirmOrder", JSON.stringify(validOrder));
                  setTimeout(function () {
                      window.location = 'validation.html';
                  }, 1500);
                  console.log(validOrder);

              })
              .catch(error => {
                  // show error message in console
                  console.error(error);
              });
      } else if (checkForm.checkValidity() === false) {
        // show eror message to the user
          apiFail = document.getElementById('bloc2__order');
          apiFail.classList.add('fail__msg');
          apiFail.innerHTML = "Veuillez verifier vos données";
      }

  });
};
