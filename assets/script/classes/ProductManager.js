/**
 * Gestionnaire de produits.
 * @class
 */
class ProductManager {

    constructor() {
        // Conteneur des catégories dans le DOM
        this.categoryListContainer = document.getElementById('category-list');
    }

    /**
     * Charge les produits à partir d'un fichier JSON et les affiche par catégorie.
     */
    loadProducts() {
        fetch('./data/products.json')
            .then(response => response.json())
            .then(products => {
                // Regroupe les produits par catégorie
                const productsByCategory = this.groupProductsByCategory(products);

                // Parcourt les catégories et affiche les produits
                Object.keys(productsByCategory).forEach(category => {
                    const categoryContainer = this.createCategoryContainer(category);
                    productsByCategory[category].forEach(product => {
                        const productCard = this.createProductCard(product);
                        categoryContainer.appendChild(productCard);
                    });

                    // Ajoute la catégorie au conteneur principal
                    if (this.categoryListContainer) {
                        this.categoryListContainer.appendChild(categoryContainer);
                    }
                });
            })
            .catch(error => console.error('Error loading products:', error));
    }

    /**
     * Regroupe les produits par catégorie.
     * @param {Array} products - Liste des produits.
     * @returns {Object} - Produits regroupés par catégorie.
     */
    groupProductsByCategory(products) {
        const productsByCategory = {};

        products.forEach(product => {
            const category = product.category;

            if (!productsByCategory[category]) {
                productsByCategory[category] = [];
            }

            productsByCategory[category].push(product);
        });

        return productsByCategory;
    }

    /**
     * Crée un conteneur de catégorie.
     * @param {string} category - Nom de la catégorie.
     * @returns {HTMLElement} - Conteneur de catégorie.
     */
    createCategoryContainer(category) {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        // Crée un titre de catégorie
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;
        categoryContainer.appendChild(categoryTitle);
        categoryTitle.id = category.toLowerCase();

        return categoryContainer;
    }

    /**
     * Crée une carte de produit.
     * @param {Object} product - Détails du produit.
     * @returns {HTMLElement} - Carte de produit.
     */
    createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('product-card');

        // Structure de la carte avec les détails du produit
        card.innerHTML = `
            <a href="./product.html?id=${product.id}" class="card mb-2" id="${product.category}">
                <img src="${product.img}" alt="${product.name}">
                <div class="card-footer">
                    <p class="card-title">${product.name}</p>
                    <p class="stars">
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                        <i class="far fa-star"></i>
                    </p>
                    <p class="card-price">${product.price}€</p>
                </div>
            </a>
        `;

        return card;
    }
}