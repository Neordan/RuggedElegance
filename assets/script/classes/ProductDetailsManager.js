/**
 * Gestionnaire des détails des produits.
 * @class
 */
class ProductDetailsManager {

    constructor() {
        // Conteneur de la liste des produits dans le DOM
        this.productListContainer = document.getElementById('product');
        this.productId;
        // Liste des produits dans le panier
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        // Produit actuellement chargé
        this.loadedProduct = null;
    }

    /**
     * Initialise le gestionnaire des détails du produit.
     * Associe les événements au chargement du DOM.
     */
    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            //récupérer l'id dans l'url
            const urlParams = new URLSearchParams(window.location.search);
            this.productId = urlParams.get('id');

            if (this.productId) {
                this.loadProductDetails(this.productId, () => {
                    this.setupEventListeners();
                });
            } else {
                console.error('Product ID not found in URL');
            }
        });
    }

    /**
     * Configure les écouteurs d'événements.
     */
    setupEventListeners() {
        const addToCartButton = document.querySelector('.addToCartButtonProductDetails');
        const decrementButton = document.querySelector(`#decrement-${this.productId}`);
        const incrementButton = document.querySelector(`#increment-${this.productId}`);
        const quantityDisplay = document.querySelector(`#quantity-${this.productId}`);
    
        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                this.addToCart(this.productId, quantityDisplay);
            });
        }
    
        if (decrementButton && incrementButton && quantityDisplay) {
            decrementButton.addEventListener('click', () => {
                this.updateQuantity(-1, quantityDisplay);
            });
    
            incrementButton.addEventListener('click', () => {
                this.updateQuantity(1, quantityDisplay);
            });
        }
    }

    /**
     * Charge les détails du produit à partir du fichier JSON.
     * @param {string} productId - L'identifiant du produit.
     * @param {Function} callback - La fonction de rappel à appeler après le chargement des détails du produit.
     */
    loadProductDetails(productId, callback) {
        fetch('./data/products.json')
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === parseInt(productId));

                if (product) {
                    this.loadedProduct = product; // Stocker le produit chargé
                    const productCard = this.createProduct(product);
                    if (this.productListContainer) {
                        this.productListContainer.appendChild(productCard);
                    }

                    //
                    document.title = product.highQualityTitle;
                    localStorage.setItem('currentProductID', productId);

                    // Appeler le callback après avoir ajouté les détails du produit au DOM
                    if (callback) {
                        callback();
                    }
                } else {
                    console.error('Product not found');
                }
            })
            .catch(error => console.error('Error loading product details:', error));
    }

    /**
     * Crée la carte du produit à afficher dans le DOM.
     * @param {Object} product - Les détails du produit.
     * @returns {HTMLElement} - La carte du produit.
     */
    createProduct(product) {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <div class="group-img d-flex flex-column align-items-center p-4">
            <img class="main-img" src="${product.img}" alt="${product.name}">
            <div class="seconds-img mt-2 d-flex justify-content-between">
            <img src="https://picsum.photos/200/200">
            <img src="https://picsum.photos/200/200">
            <img src="https://picsum.photos/200/200">
            <img src="https://picsum.photos/200/200">
            <img src="https://picsum.photos/200/200">
            </div>
            </div>
            <h2 class="mt-4 mb-0">${product.name}</h2>
            <p class="marque">${product.description}</p>
            
            <div class="price-product mt-4 d-flex justify-content-between align-items-center">
            <div class="info-left">
            <p class="mb-0">Prix: ${product.price}€</p>
            <div class="opinion-product">
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            </div>
            </div>
            <div class="stock-product">
            <p class="mb-0">En stock</p>
            </div>
            </div>
            <div class="size-guide mt-5">
            <a class="text-uppercase text-decoration-none">guide des tailles</a>
            <p class="mt-3 mb-1">Tailles</p>
            <ul class="size-list p-0 d-flex justify-content-start gap-4">
            <li class="size-item text-center">XS</li>
            <li class="size-item text-center">S</li>
            <li class="size-item text-center">M</li>
            <li class="size-item text-center">L</li>
            <li class="size-item text-center">XL</li>
            </ul>
            </div>
            <div class="color-product">
            <p class="mt-4 mb-1">Couleurs</p>
            <ul class="color-list p-0 d-flex justify-content-start gap-4">
            <li class="color-item text-center">Noir</li>
            <li class="color-item text-center">Marron</li>
                </ul>
            </div>
            <div class="quantity-controls w-25 d-flex justify-content-center align-items-center text-center">
                <button class="btn-quantity justify-content-center" id="decrement-${product.id}">-</button>
                <span class="w-100 " id="quantity-${product.id}">1</span>
                <button class="btn-quantity justify-content-center" id="increment-${product.id}">+</button>
            </div>
            <button class="btn mt-4 w-100 addToCartButtonProductDetails">Ajouter au panier</button>
            
            </div>
            <div class="description-product p-4 mt-1">
            <p>${product.highQualityDescription}</p>
            <ul class="list-group w-75 m-auto justify-content-center">
            <li class="list-group-item p-0 d-block d-flex align-items-center">
            <p class="m-1">Lorem ipsum dolor sit amet.</p>
            </li>
            <li class="list-group-item p-0">
            <p class="m-1">Et corporis ipsum ea provident</p>
            </li>
            <li class="list-group-item p-0">
            <p class="m-1">Pochette en tissu compris</p>
            </li>
            <li class="list-group-item p-0">
            <p class="m-1">Cadeau idéal</p>
            </li>
            <li class="list-group-item p-0">
            <p class="m-1">Livraison gratuite</p>
            </li>
            </ul>
            </div>
            `;

        return card;
    }

    /**
     * Ajoute un produit au panier.
     * @param {string} productId - L'identifiant du produit à ajouter.
     * @param {HTMLElement} quantityDisplay - L'élément d'affichage de la quantité.
     */
    addToCart(productId, quantityDisplay) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
        // Vérifier si le produit est déjà chargé
        if (this.loadedProduct) {
            // Récupérer la quantité depuis le span
            const quantity = parseInt(quantityDisplay.textContent);
    
            const existingProduct = cart.find(p => p.id === productId);
    
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                const productToAdd = {
                    id: productId,
                    name: this.loadedProduct.name,
                    price: this.loadedProduct.price,
                    quantity: quantity,
                    img: this.loadedProduct.img // Ajouter l'image ici
                };
                cart.push(productToAdd);
            }
    
            // Mettre à jour le localStorage avec le nouveau panier
            localStorage.setItem('cart', JSON.stringify(cart));
            let shopUpdate = new shoppingCartManager();
            shopUpdate.updateCartDisplay();

        } else {
            console.error('Product not loaded');
        }
    }

    /**
     * Met à jour la quantité affichée.
     * @param {number} change - La variation de la quantité.
     * @param {HTMLElement} display - L'élément d'affichage de la quantité.
     */
    updateQuantity(change, display) {
        let quantity = parseInt(display.textContent) + change;
        if (quantity < 1) {
            quantity = 0;
        }
        display.textContent = quantity;
    }

    getTotalQuantity() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    //afficher la quantité de produit dans une bulle
    updateCartIcon() {
        const cartIcon = document.querySelector('.basket-icon-container');
        if (cartIcon) {
            const totalQuantity = this.getTotalQuantity();
            console.log(totalQuantity)
            // Vérifier si la bulle existe déjà
            let bubble = cartIcon.querySelector('.cart-quantity');
            if (!bubble) {
                // Créer la bulle s'elle n'existe pas
                bubble = document.createElement('span');
                bubble.classList.add('cart-quantity');
                cartIcon.appendChild(bubble);
            }
            // Mettre à jour la quantité dans la bulle
            bubble.textContent = totalQuantity;
        }
    }
    
}

// Instanciation de la classe et appel de la méthode d'initialisation
const productDetailsManager = new ProductDetailsManager();
productDetailsManager.initialize();
productDetailsManager.updateCartIcon();

