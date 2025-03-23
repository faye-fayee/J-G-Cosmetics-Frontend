// Toggle Price Dropdown Visibility
document.addEventListener("DOMContentLoaded", function () {
    const dropdownBtn = document.querySelector(".price-dropdown-btn");
    const dropdownMenu = document.getElementById("myPriceDropdown");
    const productContainer = document.querySelector(".products-card-container");

    // Toggle Dropdown
    dropdownBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents immediate closing
        dropdownMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    window.addEventListener("click", function (event) {
        if (!event.target.closest(".dropdown-price")) {
            dropdownMenu.classList.remove("show");
        }
    });

    // Sort Products Function
    function sortProducts(order) {
        let products = Array.from(document.querySelectorAll(".products-card")); // Get fresh product list

        products.sort((a, b) => {
            let priceAElement = a.querySelector("ul li:nth-child(2) p");
            let priceBElement = b.querySelector("ul li:nth-child(2) p");

            if (!priceAElement || !priceBElement) {
                console.error("Price element not found!");
                return 0; // Skip sorting if price is missing
            }

            let priceA = parseInt(priceAElement.textContent.replace(/[^0-9]/g, "")) || 0;
            let priceB = parseInt(priceBElement.textContent.replace(/[^0-9]/g, "")) || 0;

            return order === "asc" ? priceA - priceB : priceB - priceA;
        });

        // Re-append sorted products to container
        productContainer.innerHTML = "";
        products.forEach(product => productContainer.appendChild(product));
    }

    // Handle Click on Sorting Options
    document.querySelectorAll("#myPriceDropdown a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            let order = this.textContent.includes("Lowest") ? "asc" : "desc";
            sortProducts(order);

            // Close dropdown after selection
            dropdownMenu.classList.remove("show");
        });
    });
});


// Dynamic Creation of Product Details Page from JSON
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')); // Convert to number for matching

    // Fetch product data from JSON file
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            const product = products.find(item => item.id === productId);

            if (product) {
                // Populate product details
                document.querySelector(".product-name").innerText = product.name;
                document.querySelector(".product-price").innerText = `₱${product.price}`;
                document.querySelector(".product-tagline").innerText = product.tagline;
                document.querySelector(".product-description").innerText = product.description;

                // Set the main image
                document.querySelector(".product-image").src = product.images[0];

                // Populate image gallery if multiple images exist
                const gallery = document.querySelector(".image-gallery");
                gallery.innerHTML = "";
                product.images.forEach(image => {
                    const imgElement = document.createElement("img");
                    imgElement.src = image;
                    imgElement.alt = product.name;
                    imgElement.classList.add("gallery-image");
                    imgElement.onclick = () => changeMainImage(image); // Change main image on click
                    gallery.appendChild(imgElement);
                });

                // Populate shade selection if shades are available
                const dropdownList = document.querySelector(".dropdown-price-list");
                dropdownList.innerHTML = ""; // Clear previous items

                if (product.shades.length > 0) {
                    product.shades.forEach(shade => {
                        const shadeItem = document.createElement("div");
                        shadeItem.classList.add("dropdown-item");
                        shadeItem.innerText = shade;
                        shadeItem.onclick = () => selectShade(shade);
                        dropdownList.appendChild(shadeItem);
                    });
                } else {
                    // Hide dropdown if no shades available
                    document.querySelector(".price-dropdown-btn").style.display = "none";
                }
                } else {
                    // If product not found
                    document.getElementById("product-details").innerHTML = `<p>Product not found.</p>`;
                    
                }
        })
        .catch(error => {
            console.error("Error loading product data:", error);
            document.getElementById("product-details").innerHTML = `<p>Error loading product data.</p>`;
        });
});

// Function to change the main image when clicking a thumbnail
function changeMainImage(imageSrc) {
    document.getElementById("product-image").src = imageSrc;
}

// Function to handle shade selection
function selectShade(shade) {
    document.querySelector(".price-dropdown-btn").innerText = shade;
}
