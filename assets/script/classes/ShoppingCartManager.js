class ShoppingCartManager {
    constructor() {
        this.cartItemsContainer = document.getElementById('cart');
        this.totalCart = document.getElementById('total-cart');
        this.deliveryOptions = document.querySelectorAll('input[name="delivery"]');
        this.deliveryCostDisplay = document.getElementById('delivery-cost');
        this.items = [];

        // Initialisation de l'événement DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            this.initialize();
        });
    }

    initialize() {
        // Ajouter des écouteurs d'événements
        if (this.cartItemsContainer) {
            this.cartItemsContainer.addEventListener('click', (event) => this.handleQuantityChange(event));
            this.deliveryOptions.forEach(option => {
                option.addEventListener('change', () => this.updateCartDisplay());
            });
        }

        // Charger les éléments du panier depuis le localStorage
        this.items = JSON.parse(localStorage.getItem('cart')) || [];

        // Mettre à jour l'affichage initial du panier
        this.updateCartDisplay();

        // Exposer la fonction addToCart sur la fenêtre globale
        window.addToCart = (productId, productName, productPrice, productImg) => {
            console.log('addToCart function called');
            const existingItem = this.items.find(item => item.id === productId);

            if (existingItem) {
                console.log('Existing item found. Incrementing quantity.');
                existingItem.quantity++;
            } else {
                console.log('Item not found. Adding new item.');
                const newItem = new CartItem(productId, productName, productPrice, 1, productImg); // Remplacez ces valeurs par celles appropriées
                this.addItem(newItem);
            }

            // Ajouter des logs pour voir le contenu du panier après l'ajout
            console.log('Updated cart items:', this.items);

            // Mettre à jour le localStorage
            this.saveToLocalStorage();
        };
    }

    saveToLocalStorage() {
        console.log('Saving to localStorage:', this.items);
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }

        this.saveToLocalStorage();
        this.updateCartDisplay();
        console.log(`Item added: ${JSON.stringify(item)}`);
    }

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

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveToLocalStorage();
        this.updateCartDisplay();
        console.log(`Item removed with ID ${itemId}`);
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    updateCartDisplay() {
        console.log('Cart Items:', this.items);
        console.log('Updating cart display'); // Ajoutez cette ligne
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
                                    <div class="btn-quantity d-flex align-items-center justify-content-between">
                                    <button class="quantity-control" data-action="decrement" data-product-id="${item.id}">-</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="quantity-control" data-action="increment" data-product-id="${item.id}">+</button>
                                    </div>
                                    <i class="fa-solid fa-trash ms-3 remove-button" data-product-id="${item.id}"></i>
                                </div>
                            </div>
                        </div>
                        <p>${subtotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                        `;

                    this.cartItemsContainer.appendChild(productContainer);

                    // Ajouter des écouteurs d'événements Remove une fois que les boutons sont créés
                    this.addRemoveButtonListener(item.id);
                });

                this.cartItemsContainer.appendChild(cart);

                // Ajouter les écouteurs d'événements Remove une fois que les boutons sont créés
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

    getProductIdFromButton(button) {
        const productId = button.dataset.productId;

        if (!productId) {
            console.error('Invalid product ID');
            return null;
        }

        return productId;
    }



    handleQuantityChange(event) {
        const target = event.target;

        // Vérifier si le clic est sur un bouton d'ajout/suppression
        if (target.classList.contains('quantity-control')) {
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

                    // Mettre à jour le localStorage et l'affichage du panier
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

    // Fonction pour mettre à jour le coût de la livraison
    updateDeliveryCost() {
        const total = this.calculateTotal();
        let deliveryCost = 0;

        if (total < 150) {
            if (this.items.length !== 0) {
                // Le total est inférieur à 100€, afficher les options de livraison normales
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

// Créer une instance de la classe ShoppingCartManager
const shoppingCartManager = new ShoppingCartManager();