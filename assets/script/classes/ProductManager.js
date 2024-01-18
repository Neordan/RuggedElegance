class ProductManager {
    constructor() {
        this.categoryListContainer = document.getElementById('category-list');
    }

    loadProducts() {
        fetch('./data/products.json')
            .then(response => response.json())
            .then(products => {
                const productsByCategory = this.groupProductsByCategory(products);

                Object.keys(productsByCategory).forEach(category => {
                    const categoryContainer = this.createCategoryContainer(category);
                    productsByCategory[category].forEach(product => {
                        const productCard = this.createProductCard(product);
                        categoryContainer.appendChild(productCard);
                    });
                    if (this.categoryListContainer) {
                        this.categoryListContainer.appendChild(categoryContainer);
                    }
                });
            })
            .catch(error => console.error('Error loading products:', error));
    }

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

    createCategoryContainer(category) {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;
        categoryContainer.appendChild(categoryTitle);
        categoryTitle.id = category.toLowerCase();

        return categoryContainer;
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <a href="./product.html?id=${product.id}" class="card" id="${product.category}">
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

document.addEventListener('DOMContentLoaded', function () {
    const productManager = new ProductManager();
    productManager.loadProducts();
});
