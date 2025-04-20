document.addEventListener("DOMContentLoaded", () => {
  updateAccountLinks();
});

// In your shared JS
function updateAccountLinks() {
  const accountLinks = document.querySelectorAll(".account-link");
  const userId = localStorage.getItem("userId");

  accountLinks.forEach(link => {
      link.setAttribute("href", userId ? "acc-details.html" : "log-in.html");
  });
}

document.addEventListener("DOMContentLoaded", updateAccountLinks);


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