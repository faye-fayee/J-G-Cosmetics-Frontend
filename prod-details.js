// 🖼️ Handle Image Thumbnails

let thumbnails = document.getElementsByClassName("thumbnail");
let activeImages = document.getElementsByClassName("active");


for (var i = 0; i < thumbnails.length; i++) {
    thumbnails[i].addEventListener("mouseover", function () {
        if (activeImages.length > 0) {
            activeImages[0].classList.remove("active");
        }
        this.classList.add("active");
        document.getElementById("featured").src = this.src;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCounter(document.querySelector(".cart-counter"));
    renderCartItems(); // ✅ Show cart items on page load
});

// Dynamic Creation of Product Details Page
document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    try {
        const response = await fetch("products.json");
        const products = await response.json();
        const product = products.find((p) => p.id == productId);

        if (product) {
            document.querySelector(".product-title").innerText = product.name;
            document.querySelector(".product-price").innerText = `₱${product.price}`;
            document.querySelector(".product-tagline").innerText = product.tagline;
            document.querySelector(".product-description").innerText = product.description;

            const featuredImg = document.getElementById("featured");
            featuredImg.src = product.images[0];

            const slider = document.getElementById("slider");
            slider.innerHTML = "";
            product.images.forEach((imgSrc, index) => {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.classList.add("thumbnail");
                if (index === 0) img.classList.add("active");
                img.addEventListener("mouseover", function () {
                    featuredImg.src = imgSrc;
                    document.querySelector(".thumbnail.active")?.classList.remove("active");
                    img.classList.add("active");
                });
                slider.appendChild(img);
            });


            // Shades Section
            const shadeContainer = document.querySelector(".shades-container");
            if (product.shades && product.shades.length > 0) {
                shadeContainer.innerHTML = "<h4>Shades</h4>";
                product.shades.forEach((shade) => {
                    const button = document.createElement("button");
                    button.innerText = shade;
                    button.classList.add("shade-btn");

                    // Shade button click event
                    button.addEventListener("click", (event) => {
                        document.querySelectorAll(".shade-btn").forEach((btn) => btn.classList.remove("selected"));
                        event.target.classList.add("selected");
                    });

                    shadeContainer.appendChild(button);
                });
                shadeContainer.style.display = "block";
            } else {
                shadeContainer.innerHTML = "";
                shadeContainer.style.display = "none";
            }

          
            //  Add to Cart Button
            const addToCartBtn = document.querySelector(".add-to-cart-btn");
            addToCartBtn.replaceWith(addToCartBtn.cloneNode(true));

            document.querySelector(".add-to-cart-btn").addEventListener("click", function () {
                const selectedShade = document.querySelector(".shade-btn.selected")?.innerText;

                if (!selectedShade) {
                    alert("Please select a shade before adding to cart! 🎨");
                    return;
                }

                const quantity = parseInt(document.querySelector(".add-to-cart input").value);
                addToCart(product, selectedShade, quantity);
            });
        } else {
            document.querySelector(".product-details-container").innerHTML = "<h2>Product not found.</h2>";
        }
    } catch (error) {
        console.error("Error loading product data:", error);
    }

    // Load Cart Data on Page Load
    updateCartCounter(document.querySelector(".cart-counter"));
    renderCartItems(); // Show items when the cart is loaded
});




