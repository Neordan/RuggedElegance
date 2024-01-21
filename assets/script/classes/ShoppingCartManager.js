/**
 * Gestionnaire du panier d'achat.
 * @class
 */
class ShoppingCartManager {

    constructor() {
        // Conteneur des éléments du panier dans le DOM
        this.cartItemsContainer = document.getElementById('cart');
        // Élément affichant le total du panier
        this.totalCart = document.getElementById('total-cart');
        // Options de livraison disponibles
        this.deliveryOptions = document.querySelectorAll('input[name="delivery"]');
        // Élément affichant le coût de la livraison
        this.deliveryCostDisplay = document.getElementById('delivery-cost');
        // Liste des éléments dans le panier
        this.items = [];

        // Initialisation de l'événement DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            this.initialize();
        });
    }


    /**
     * Initialise le gestionnaire du panier.
     * Ajoute des écouteurs d'événements et charge les éléments du panier depuis le localStorage.
     */
    initialize() {
        if (this.cartItemsContainer) {
            this.cartItemsContainer.addEventListener('click', (event) => this.handleQuantityChange(event));
            this.deliveryOptions.forEach(option => {
                option.addEventListener('change', () => this.updateCartDisplay());
            });
        }

        this.items = JSON.parse(localStorage.getItem('cart')) || [];

        this.updateCartDisplay();

        window.addToCart = (productId, productName, productPrice, productImg) => {
            const existingItem = this.items.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                const newItem = new CartItem(productId, productName, productPrice, 1, productImg);
                this.addItem(newItem);
            }

            this.saveToLocalStorage();
        };
    }

    /**
     * Enregistre les éléments du panier dans le localStorage.
     */
    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    /**
     * Ajoute un élément au panier.
     * @param {CartItem} item - L'élément à ajouter.
     */
    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }

        this.saveToLocalStorage();
        this.updateCartDisplay();

    }

    /**
     * Met à jour la quantité d'un élément dans le panier.
     * @param {string} itemId - L'identifiant de l'élément.
     * @param {number} newQuantity - La nouvelle quantité.
     */
    updateQuantity(itemId, newQuantity) {
        this.items.forEach(item => {
            if (item.id === itemId) {
                item.quantity = parseInt(newQuantity);
            }
        });

        this.saveToLocalStorage();
        this.updateCartDisplay();
        console.log(`Quantity updated for item with ID ${itemId} to ${newQuantity}`);
    }

    /**
     * Supprime un élément du panier.
     * @param {string} itemId - L'identifiant de l'élément à supprimer.
     */
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveToLocalStorage();
        this.updateCartDisplay();
    }

    /**
     * Calcule le total du panier en fonction des éléments et de leurs quantités.
     * @returns {number} - Le total du panier.
     */
    calculateTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    /**
     * Met à jour l'affichage du panier.
     * Affiche les éléments du panier, le total, le coût de la livraison, et les options de livraison.
     */
    updateCartDisplay() {
        if (this.cartItemsContainer) {
            this.cartItemsContainer.innerHTML = '';

            if (this.totalCart) {
                if (this.items.length === 0) {
                    const emptyCartMessage = document.createElement('div');
                    document.querySelector('.delivery').style.display = "none";
                    emptyCartMessage.textContent = 'Le panier est vide';
                    this.cartItemsContainer.appendChild(emptyCartMessage);
                } else {
                    const cart = document.createElement('div');
                    cart.classList.add('title-cart', 'd-flex', 'justify-content-between');

                    this.items.forEach(item => {
                        const productContainer = document.createElement('div');
                        productContainer.classList.add('body-cart', 'd-flex', 'justify-content-between', 'mt-3', 'pb-3');

                        const subtotal = item.price * item.quantity;

                        productContainer.innerHTML = `
                        <div class="d-flex align-items-start info-product-cart w-75">
                            <img src="${item.img}" alt="${item.name}">
                            <div class="info-line-cart d-flex flex-column ms-3">
                                <p class="m-0">${item.name}</p>
                                <p class="">Mini description</p>
                                <p class="m-0">${item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                                <p class="">Taille : XS</p>
                                <p class="m-0">Couleur : Noir</p>
                                <div class="d-flex align-items-center mt-2">
                                    <div class="quantity-controls d-flex align-items-center justify-content-between w-50">
                                        <button class="btn-quantity" data-action="decrement" data-product-id="${item.id}">-</button>
                                        <span class="quantity">${item.quantity}</span>
                                        <button class="btn-quantity" data-action="increment" data-product-id="${item.id}">+</button>
                                    </div>
                                    <i class="fa-solid fa-trash ms-3 remove-button" data-product-id="${item.id}"></i>
                                </div>
                            </div>
                        </div>
                        <p>${subtotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                        `;

                        this.cartItemsContainer.appendChild(productContainer);

                        this.addRemoveButtonListener(item.id);
                    });

                    this.cartItemsContainer.appendChild(cart);

                    this.items.forEach(item => this.addRemoveButtonListener(item.id));
                }

                // Mettre à jour l'affichage du total
                const deliveryCost = this.updateDeliveryCost();
                const total = this.calculateTotal() + deliveryCost;
                if (this.totalCart) {
                    this.totalCart.textContent = total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
                } else {
                    console.error("L'élément avec l'ID 'total-cart' n'a pas été trouvé.");
                }

                // Mettre à jour l'affichage du coût de la livraison
                if (this.deliveryCostDisplay) {
                    this.deliveryCostDisplay.textContent = deliveryCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
                } else {
                    console.error("L'élément avec l'ID 'delivery-cost' n'a pas été trouvé.");
                }
            } else {
                console.error("L'élément avec l'ID 'total-cart' n'a pas été trouvé.");
            }
        }
    }

    /**
     * Récupère l'identifiant du produit à partir d'un bouton.
     * @param {HTMLElement} button - Le bouton contenant l'attribut data-product-id.
     * @returns {string|null} - L'identifiant du produit ou null si non trouvé.
     */
    getProductIdFromButton(button) {
        const productId = button.dataset.productId;

        if (!productId) {
            console.error('Invalid product ID');
            return null;
        }

        return productId;
    }

    /**
     * Gère le changement de quantité d'un élément du panier.
     * Met à jour la quantité, le localStorage et l'affichage du panier.
     * @param {Event} event - L'événement de clic.
     */
    handleQuantityChange(event) {
        const target = event.target;

        // Vérifier si le clic est sur un bouton d'ajout/suppression
        if (target.classList.contains('btn-quantity')) {
            const productId = this.getProductIdFromButton(target);

            if (productId !== null) {
                console.log('Product ID:', productId);

                const selectedItem = this.items.find(item => item.id === productId);

                if (selectedItem) {
                    const action = target.dataset.action;

                    if (action === 'increment') {
                        selectedItem.quantity++;
                    } else if (action === 'decrement') {
                        const currentQuantity = selectedItem.quantity;
                        if (currentQuantity > 1) {
                            selectedItem.quantity--;
                        }
                    }

                    this.saveToLocalStorage();
                    this.updateCartDisplay();
                } else {
                    console.error('Selected item not found in cart:', this.items);
                }
            } else {
                console.error('Invalid product ID');
            }
        }
    }

    /**
     * Ajoute des écouteurs d'événements Remove à tous les boutons de suppression.
     * @param {string} productId - L'identifiant du produit.
     */
    addRemoveButtonListener(productId) {
        const removeButtons = this.cartItemsContainer.querySelectorAll(`.remove-button[data-product-id="${productId}"]`);

        if (removeButtons) {
            removeButtons.forEach(removeButton => {
                removeButton.addEventListener('click', () => {
                    console.log(`Remove button clicked for item with ID ${productId}`);
                    this.removeItem(productId);
                });
            });
        }
    }

    /**
     * Met à jour le coût de la livraison en fonction du total du panier.
     * Affiche les options de livraison et retourne le coût de la livraison.
     * @returns {number} - Le coût de la livraison.
     */
    updateDeliveryCost() {
        const total = this.calculateTotal();
        let deliveryCost = 0;

        if (total < 300) {
            if (this.items.length !== 0) {
 
                document.querySelectorAll('.delivery').forEach(deliveryOption => {
                    deliveryOption.style.display = 'block';
                });

                const selectedDeliveryOption = document.querySelector('input[name="delivery"]:checked');
                if (selectedDeliveryOption) {
                    if (selectedDeliveryOption.value === 'home') {
                        deliveryCost = 10;
                    } else if (selectedDeliveryOption.value === 'pickup') {
                        deliveryCost = 5;
                    }
                }
                document.querySelector(".delivery-free").style.display = "none";
            }
        } else {
            // Le total est supérieur ou égal à 100€, afficher "Livraison gratuite"
            document.querySelectorAll('.delivery').forEach(deliveryOption => {
                deliveryOption.style.display = 'none';
                document.querySelector(".delivery-free").style.display = "block";
                document.querySelector(".delivery-free").textContent = "Livraison gratuite";
            });
        }

        return deliveryCost;
    }
}

const shoppingCartManager = new ShoppingCartManager();
