class Lines {
    lines = [];
    total = 0;

    constructor(products) {
        this.products = products;
        this.#run();
    }

    // Enregistrement du panier dans le localStorage
    saveToLocalStorage() {
        // Conversion du tableau lines en une représentation JSON
        localStorage.setItem('cart', JSON.stringify(this.lines));
    }

    // Récupération des données du localStorage et conversion en tableau de lignes
    loadFromLocalStorage() {
        const storedLines = localStorage.getItem('cart');
        if (storedLines) {
            this.lines = JSON.parse(storedLines);
        }
    }

    /**
     * Calcul le total du panier
     */
    calculTotalLines() {
        this.total = 0;

        // 1 - Calcul des lignes
        this.lines.forEach((line) => {
            console.log(line);
            this.total += parseFloat(line.getTotal());
        });
        document.querySelector('#cart .total_cart').textContent = this.total + "€";
    }

    /**
     * Supprime une ligne du tableau lines
     */
    removeLine(line) {
        const index = this.lines.indexOf(line);
        if (index !== -1) {
            this.lines.splice(index, 1);
            this.calculTotalLines(); 
        }
    }

    /**
     * Création de tous les objets Line + suppression de lignes
     */
    #run() {
        this.loadFromLocalStorage();
    
        this.products.forEach((product) => {
            let new_line = new Line(product);
            new_line.tr_cart_product.addEventListener('change', () => {
                this.calculTotalLines();
                this.saveToLocalStorage(); // Sauvegardez le panier chaque fois qu'une modification est apportée
            });
    
            new_line.tr_cart_product.addEventListener('remove', () => {
                this.removeLine(new_line);
                this.saveToLocalStorage();
            });
    
            this.lines.push(new_line);
        });
    
        this.calculTotalLines();
    }
    
    
}