export type ComboOption = {
    id: string;
    name: string;
    price: number;
    image?: string;
    category: 'accessory' | 'quantity';
}

export type FlowerQuantity = {
    stems: number;
    priceModifier: number;
}

export type Product = {
    id: string | number;
    name: string;
    description: string;
    basePrice: number;
    images: string[];
    category: 'roses' | 'peonies' | 'daisies' | 'mixed' | 'wildflowers';
    ecoFriendly: boolean;
    sustainabilityInfo?: string;
    comboOptions: ComboOption[];
    quantityOptions: FlowerQuantity[];
    inStock: boolean;
}

export type CartItem = {
    product: Product;
    quantity: number;
    selectedCombos: ComboOption[];
    selectedQuantity: FlowerQuantity | null;
    totalPrice: number;
}

export type CartState = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'totalPrice'>) => void;
    removeItem: (productId: string | number) => void;
    updateQuantity: (productId: string | number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}
