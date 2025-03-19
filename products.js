function myDropdownPrice() {
  document.getElementById("myPriceDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.price-dropdown-btn')) {
      var dropdowns = document.getElementsByClassName("dropdown-price-list");
      for (let dropdown of dropdowns) {
          if (dropdown.classList.contains('show')) {
              dropdown.classList.remove('show');
          }
      }
  }
};

// Cart Functionality
document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
      localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartCount() {
      const cartCountElement = document.getElementById("cart-count");
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      if (cartCountElement) {
          cartCountElement.innerText = totalItems;
          cartCountElement.style.display = totalItems > 0 ? "flex" : "none"; 
      }
  }

  function addToCart(productId, productName, productPrice, productImage) {
      let existingProduct = cart.find(item => item.id === productId);

      if (existingProduct) {
          existingProduct.quantity += 1;
      } else {
          cart.push({
              id: productId,
              name: productName,
              price: parseFloat(productPrice), // Ensure price is a number
              image: productImage,
              quantity: 1,
              shade: "No Shade Selected"
          });
      }

      saveCart();
      loadCartItems(); //  Update cart in real time
      updateCartCount();
  }

  function loadCartItems() {
      const cartList = document.querySelector(".cart-list");
      if (!cartList) return; // Ensure cart list exists before modifying it

      cartList.innerHTML = ""; // Clear cart list
      cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.length === 0) {
          cartList.innerHTML = `<p class="empty-cart-message">Your cart is empty! Add products to your cart to view them here.</p>`;
          updateCartCount(); 
          return;
      }

      cart.forEach((item, index) => {
          const cartItem = document.createElement("div");
          cartItem.classList.add("cart-item");
          cartItem.innerHTML = `
              <div class="cart-item-img">
                  <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="cart-item-name">
                  ${item.name} ${item.shade ? `(${item.shade})` : ""}
              </div>
              <div class="total-price">
                  ₱${(item.price * item.quantity).toFixed(2)}
              </div>
              <div class="quantity">
                  <span class="minus" data-index="${index}">&lt;</span>
                  <span>${item.quantity}</span>
                  <span class="plus" data-index="${index}">&gt;</span>
              </div>
              <button class="remove-item" data-index="${index}">Remove</button>
          `;

          cartList.appendChild(cartItem);
      });

      attachQuantityEventListeners();
      updateCartCount(); 
  }

  function attachQuantityEventListeners() {
      document.querySelectorAll(".minus").forEach(button => {
          button.addEventListener("click", function () {
              const index = this.getAttribute("data-index");

              if (cart[index].quantity > 1) {
                  cart[index].quantity -= 1;
              } else {
                  cart.splice(index, 1);
              }

              saveCart();
              loadCartItems(); // ✅ Update in real time
          });
      });

      document.querySelectorAll(".plus").forEach(button => {
          button.addEventListener("click", function () {
              const index = this.getAttribute("data-index");
              cart[index].quantity += 1;

              saveCart();
              loadCartItems(); // ✅ Update in real time
          });
      });

      document.querySelectorAll(".remove-item").forEach(button => {
          button.addEventListener("click", function () {
              const index = this.getAttribute("data-index");
              cart.splice(index, 1); // Remove item completely

              saveCart();
              loadCartItems(); // ✅ Update in real time
          });
      });
  }

  // Attach event listeners to Add to Cart buttons dynamically
  document.querySelectorAll(".products-card button").forEach(button => {
      button.addEventListener("click", function (event) {
          const card = event.target.closest(".products-card");
          const productId = card.querySelector("a").href.split("=")[1];
          const productName = card.querySelector("ul li p").innerText;
          const productPrice = card.querySelector("ul li:nth-child(2) p").innerText.replace("₱", "");
          const productImage = card.querySelector("img").src;

          addToCart(productId, productName, productPrice, productImage);
      });
  });

  loadCartItems(); // Load cart items on page load
});

// Cart Counter
document.addEventListener("DOMContentLoaded", function () {
  const cartCountElement = document.getElementById("cart-count");

  function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      if (cartCountElement) {
          cartCountElement.innerText = totalItems;
          cartCountElement.style.display = totalItems > 0 ? "flex" : "none";
      }
  }

  updateCartCount(); // Initialize cart count on page load
});
