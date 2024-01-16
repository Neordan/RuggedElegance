class Line {
    tr_cart_product;
    event;

    constructor(product) {
        this.product = product;
        this.#createHtml()
        this.#calculTotalProduct();
        this.#manageInfluentPriceOnChangeEvents();
        this.#manageRemoveProductEvent();
        this.event = new CustomEvent('change');
    }

    getTotal() {
        return this.product.total;
    }

    #createHtml() {
        this.tr_cart_product = document.createElement('tr');
        this.tr_cart_product.innerHTML +=
            `
                    <td>${this.product.name}</td>
                    <td class="unit_price" data-unit-price="${this.product.unit_price}">
                        <span class="value">${this.product.unit_price}</span> €
                    </td>
                    <td class="quantity">
                        <input type="number" class="influent-price-on-change" value="${this.product.quantity}"/>
                    </td>
                    <td class="total_price" data-total-price=></td>
                    <td>
                        <button class="remove">X</button>
                    </td>
           `;

        document.querySelector('#cart tbody').appendChild(this.tr_cart_product);
    }

    /**
     * Calcul le total d'une ligne dans le tableau
     */
    #calculTotalProduct() {
        this.product.quantity = this.tr_cart_product.querySelector('.quantity input').value;
        this.product.unit_price = parseFloat(this.tr_cart_product.querySelector('.unit_price').dataset.unitPrice);
        this.product.total = this.product.quantity * this.product.unit_price;

        this.tr_cart_product.querySelector('.total_price').textContent = this.product.total + '€';
        this.tr_cart_product.querySelector('.total_price').dataset.totalPrice = this.product.total;

    }

    /**
     * Gère le changement de prix dû à des changements sur certaines colonnes.
     * */
    #manageInfluentPriceOnChangeEvents() {
        this.tr_cart_product.querySelectorAll('.influent-price-on-change').forEach((element) => {
            element.addEventListener('change', (e) => {
                // Empêcher les quantités négatives dans les inputs number
                const newQuantity = parseFloat(e.target.value);
                if (newQuantity < 0) {
                    e.target.value = 0;
                }
    
                this.#calculTotalProduct();
                this.#emitChangeEvent();
            });
        });
    }

    /**
     * Gère la suppression d'une ligne via le bouton remove
     */
    #manageRemoveProductEvent() {
        this.tr_cart_product.querySelector('.remove').addEventListener('click', (e) => {
            this.tr_cart_product.remove();
            this.#emitChangeEvent();

            // Événement "remove" pour informer Lines de supprimer la ligne du tableau
            this.tr_cart_product.dispatchEvent(new CustomEvent('remove'));
        });
    }


    /**
     * Écouteur dévénement sur les lignes du paniers
     */
    #emitChangeEvent() {
        this.tr_cart_product.dispatchEvent(this.event);
    }
}
