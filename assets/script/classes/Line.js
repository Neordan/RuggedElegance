class Line {
    tr_cart_product;


    constructor(product) {
        this.product = product
        this.#createHtml()
        this.#calculTotalProduct()
    }

    getTotal() {
        return this.product.total
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
     * Ecouteur d'évènement sur chaque ligne
     */
    #emitChangeEvent()
    {
        this.tr_cart_product.dispatchEvent(this.event);
    }
}