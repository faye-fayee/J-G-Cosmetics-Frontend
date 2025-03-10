function myDropdownPrice() {
    document.getElementById("myPriceDropdown").classList.toggle("show");
    console.log("clicked");
}

window.onclick = function(event) {
    if (!event.target.matches('.price-dropdown-btn')) {
      var dropdowns = document.getElementsByClassName("dropdown-price-list");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }