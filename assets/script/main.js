
function init(cart) {
    new Lines(cart.products)
}

/**
 * Recupère en AJAX les données du panier
 */
async function getCart() {
    let response = await fetch('/data/data.json');
    let cart = await response.json();
    init(cart);
}

getCart();
