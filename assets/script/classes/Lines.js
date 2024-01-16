class Lines {
    lines = [];
    total = 0;
    delivery = null; // Ajoutez cette ligne

    constructor(products, delivery) {
        this.products = products;
        this.delivery = delivery;
        this.#run();
    }

    // Enregistrement du panier dans le localStorage
    saveToLocalStorage() {
        // Filtrer les lignes avec une quantité supérieure à 0 avant de sauvegarder
        const nonZeroQuantityLines = this.lines.filter(line => line.product.quantity > 0);

        localStorage.setItem('cart', JSON.stringify(nonZeroQuantityLines));
    }

    // Récupération des données du localStorage et conversion en tableau de lignes
    loadFromLocalStorage() {
        const storedLines = localStorage.getItem('cart');
        if (storedLines) {
            this.lines = JSON.parse(storedLines);
        }
    }

    setDelivery(delivery) {
        this.delivery = delivery;
    }

    /**
     * Calcul le total du panier
     */
    calculTotalLines() {
        this.total = 0;

        // 1 - Calcul des lignes
        this.lines.forEach((line) => {
            if (line instanceof Line) {
                this.total += parseFloat(line.getTotal());
            }
        });

        // 2 - Ajout du coût de livraison au total
        this.total += this.delivery.getTotalDeliveryCost();

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
        const delivery = new Delivery();
  
        this.setDelivery(delivery);
    
        // Mettez à jour le coût de livraison dans le panier après avoir sélectionné l'option de livraison
        this.calculTotalLines();
    
        this.products.forEach((product) => {
            let new_line = new Line(product);
            new_line.tr_cart_product.addEventListener('change', () => {
                this.calculTotalLines();
                this.saveToLocalStorage();
            });
    
            new_line.tr_cart_product.addEventListener('remove', () => {
                this.removeLine(new_line);
                this.saveToLocalStorage();
            });
    
            this.lines.push(new_line);
        });
    
        // Écoutez les changements de l'option de livraison
        document.querySelectorAll('.delivery-option').forEach((option, index) => {
            option.addEventListener('change', () => {
                // Sélection de l'option de livraison avec l'index choisis
                this.delivery.selectDeliveryOption(index);

                this.calculTotalLines();
                this.saveToLocalStorage();
            });
        });
    }
}