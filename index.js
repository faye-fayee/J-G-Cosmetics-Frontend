function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.shop-btn')) {
      var dropdowns = document.getElementsByClassName("dropdown-list");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.querySelector(".shopping-cart-container");
    const closeCartBtn = document.querySelector(".close-cart-btn");
    const body = document.body;

    // Ensure cart is hidden when page loads
    body.classList.remove("show-cart");

    cartIcon.addEventListener("click", (event) => {
        event.preventDefault();
        body.classList.toggle("show-cart");
    });

    closeCartBtn.addEventListener("click", () => {
        body.classList.remove("show-cart");
    });
});


