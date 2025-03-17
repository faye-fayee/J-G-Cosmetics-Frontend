document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    try {
        const response = await fetch("products.json");
        const products = await response.json();
        const product = products.find(p => p.id == productId);

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

            // Shades Section Fix
            const shadeContainer = document.querySelector(".shades-container");

            if (product.shades && product.shades.length > 0) {
                shadeContainer.innerHTML = "<h4>Shades</h4>";
                product.shades.forEach(shade => {
                    const button = document.createElement("button");
                    button.innerText = shade;
                    button.classList.add("shade-btn");
                    shadeContainer.appendChild(button);
                });

                shadeContainer.style.display = "block";  // Show shades
            } else {
                shadeContainer.innerHTML = ""; // Remove all content inside
                shadeContainer.style.display = "none";  // **Force hide it**
            }
        } else {
            document.querySelector(".product-details-container").innerHTML = "<h2>Product not found.</h2>";
        }
    } catch (error) {
        console.error("Error loading product data:", error);
    }
});
