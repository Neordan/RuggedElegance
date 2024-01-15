class Lines {

    products = []
    lines = []

    total = 0

    constructor(products) {
        this.products = products
    }

      /**
     * Calcul le total du panier
     *
     */
    calculTotalLines()
    {
        this.total = 0;

        // 1 - Calcul des lignes
        let dom_total_prices = document.querySelectorAll('.cart_product .total_price')
        this.lines.forEach((line) => {
            this.total += parseFloat(line.getTotal());
        });

        // 2 - Prise en compte du choix de livraison
        this.total += parseFloat(document.querySelector('.delivery-option:checked').value);
        document.querySelector('#cart .total_cart').textContent = this.total + "€";
    }

     /**
     * Création de tous les objets Line
     */
     #run() {
        this.products.forEach((product) => {
            let new_line = new Line(product);
            new_line.tr_cart_product.addEventListener('change', () => {
               this.calculTotalLines();
            });
            this.lines.push(new_line);
        })

        this.calculTotalLines();
    }
}