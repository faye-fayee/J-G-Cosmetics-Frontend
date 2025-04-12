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
});


// Function to change the main image when clicking a thumbnail
function changeMainImage(imageSrc) {
    document.getElementById("product-image").src = imageSrc;
}

// Function to handle shade selection
function selectShade(shade) {
    document.querySelector(".price-dropdown-btn").innerText = shade;
}
