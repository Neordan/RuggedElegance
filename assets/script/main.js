function init(cart) {

}



/**
 * Recupère en AJAX les données du panier
 */
async function getCard() {
    let response = await fetch('/data/cart.json');
    let cart = await response.json();
    init(cart);
}

getCart();