/**
 * Gestionnaire des détails des produits.
 * @class
 */
class ProductDetailsManager {

    constructor() {
        this.productListContainer = document.getElementById('product');
        this.productId;
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.loadedProduct = null; 
    }
    
    
    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
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
    
    setupEventListeners() {
        const addToCartButton = document.querySelector('.addToCartButtonProductDetails');
    
        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                this.addToCart(this.productId);
            });
        }
    }
    
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
                    document.title = product.highQualityTitle;
                    localStorage.setItem('currentProductID', productId);
    
                    // Appeler le callback après avoir ajouté les détails du produit au DOM
                    if (typeof callback === 'function') {
                        callback();
                    }
                } else {
                    console.error('Product not found');
                }
            })
            .catch(error => console.error('Error loading product details:', error));
    }
    
        
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
            <label for="quantity-${product.id}">Quantité:</label>
            <input type="number" id="quantity-${product.id}" min="1" value="1">
            <button class="btn w-100 mt-2 addToCartButtonProductDetails">Ajouter au panier</button>
            
            
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
        
        addToCart(productId) {
            // Charger les produits depuis le localStorage
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
            // Vérifier si le produit est déjà chargé
            if (this.loadedProduct) {
                // Récupérer la quantité depuis l'input
                const quantityInput = document.getElementById(`quantity-${productId}`);
                const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
                // Vérifier si le produit est déjà dans le panier
                const existingProduct = cart.find(p => p.id === productId);
        
                if (existingProduct) {
                    // Si le produit existe déjà, augmentez simplement la quantité
                    existingProduct.quantity += quantity;
                } else {
                    // Ajoutez le produit au panier avec la quantité spécifiée
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
                let shopUpdate = new shoppingCartManager()
                shopUpdate.updateCartDisplay();
            } else {
                console.error('Product not loaded');
            }
        }
        
        
   
    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
}

// Instanciation de la classe et appel de la méthode d'initialisation
const productDetailsManager = new ProductDetailsManager();
productDetailsManager.initialize();