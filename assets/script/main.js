// Fonction d'initialisation principale
function init() {
    const productManager = new ProductManager();
    productManager.loadProducts();
}

document.addEventListener('DOMContentLoaded', init);



//Apparition du menu en version mobile
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".custom-navbar-toggler-icon");
    const navbarList = document.querySelector(".menu-hamburger");

    if (menuButton && navbarList) {
        menuButton.addEventListener("click", () => {
            // Utilisez la méthode toggle pour basculer la classe 'show'
            navbarList.classList.toggle("show");

        });
    } else {
        console.error("Le bouton du menu ou l'élément de la liste du menu n'a pas été trouvé.");
    }
});
