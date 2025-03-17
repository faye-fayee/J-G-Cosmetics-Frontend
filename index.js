//Js for the dropdown menu
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


  //JS for the cart
  document.addEventListener("DOMContentLoaded", () => {
    let cartIcon = document.querySelector(".shopping-cart-container");
    let closeCartBtn = document.querySelector(".close-cart-btn");
    let body = document.body;
    let listProductsHTML = document.querySelector(".cart-list");

    let listProducts = [];

    cartIcon.addEventListener("click", (event) => {
        event.preventDefault();
        body.classList.toggle("show-cart");
    });


    closeCartBtn.addEventListener("click", () => {
          event.preventDefault();
          body.classList.toggle("show-cart");

    });

    // const addDatatoHTML = () => {
    //   listProductsHTML.innerHTML = ' ';
    //   if(listProducts.length > 0) {
    //       listProducts.forEach (product => {
    //         let newProduct = document.createElement('div');
    //         newProduct.classList.add('cart-item');
    //         newProduct.innerHTML = `
    //             <div class="cart-item-img">
    //                 <img src="${"img/browpen-main.webp"}  " alt="">
    //             </div>
    //             <div class="cart-item-name">
    //                 Brow Pen Bean Yo mama
    //             </div>
    //             <div class="total-price">
    //                 $300
    //             </div>
    //             <div class="quantity">
    //                 <span class="minus">&lt;</span>
    //                 <span>1</span>
    //                 <span class="plus">&gt;</span>
    //             </div>
    //         `;
    //         listProductsHTML.appendChild(newProduct);
    //       })
    //   }
    // }

    // const initApp = () => {
    //   //Get data from json file
    //   fetch('products.json')
    //   .then(response => response.json())
    //   .then(data => {
    //       listProducts = data;
    //       addDatatoHTML();
    //   })
    // }

    // initApp();
});


