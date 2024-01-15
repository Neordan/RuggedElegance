class Line {
    tr_cart_product;


    constructor(product) {
        this.product = product
        this.#createHtml()
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
}