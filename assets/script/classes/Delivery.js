class Delivery {
    deliveryOptions = [];
    
    // Index de l'option de livraison sélectionnée par défaut
    selectedDeliveryIndex = 0;

    constructor() {
        // Ajout des options de livraison
        this.addDeliveryOption('Relais colis', 5);
        this.addDeliveryOption('Domicile', 12);
        
        // Option de livraison par défaut (index 0 pour "Relais Colis")
        this.selectDeliveryOption(0);
    }

    // Ajout des option de livraison au tableau
    addDeliveryOption(name, cost) {
        this.deliveryOptions.push({ name, cost });
    }

    // Méthode pour sélectionner une option de livraison en fonction de l'index
    selectDeliveryOption(index) {
        this.selectedDeliveryIndex = index;
    }
}
