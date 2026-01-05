import { useState } from 'react';
import { X, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product, ComboOption, FlowerQuantity } from '../types/product';
import { useCartStore } from '../store/cartStore';

interface ProductDetailProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedCombos, setSelectedCombos] = useState<ComboOption[]>([]);
    const [selectedQuantity, setSelectedQuantity] = useState<FlowerQuantity | null>(null);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    if (!isOpen || !product) return null;

    // Initialize selected quantity if not set
    if (!selectedQuantity && product.quantityOptions.length > 0) {
        setSelectedQuantity(product.quantityOptions[0]);
    }

    const toggleCombo = (combo: ComboOption) => {
        setSelectedCombos((prev) =>
            prev.find((c) => c.id === combo.id)
                ? prev.filter((c) => c.id !== combo.id)
                : [...prev, combo]
        );
    };

    const calculateTotal = () => {
        const priceModifier = selectedQuantity?.priceModifier || 0;
        return (
            product.basePrice +
            priceModifier +
            selectedCombos.reduce((sum, combo) => sum + combo.price, 0)
        ) * quantity;
    };

    const handleAddToCart = () => {
        if (product.quantityOptions.length > 0 && !selectedQuantity) return;

        addItem({
            product,
            quantity,
            selectedCombos,
            selectedQuantity: selectedQuantity || { stems: 1, priceModifier: 0 }, // Fallback for simple products
        });

        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl z-50 overflow-hidden flex flex-col animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-colors"
                    aria-label="Close"
                >
                    <X className="w-6 h-6 text-forest-800" />
                </button>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
                        {/* Image Section */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-50">
                                <img
                                    src={product.images[currentImageIndex]?.startsWith('http') ? product.images[currentImageIndex] : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${product.images[currentImageIndex]}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {product.ecoFriendly && (
                                    <div className="absolute top-4 left-4 eco-badge backdrop-blur-sm">
                                        <Leaf className="w-4 h-4" />
                                        <span>Eco-Friendly</span>
                                    </div>
                                )}

                                {/* Image Navigation */}
                                {product.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-forest-800" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5 text-forest-800" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Sustainability Info */}
                            {product.sustainabilityInfo && (
                                <div className="bg-sage-50 rounded-xl p-5">
                                    <h3 className="font-serif font-semibold text-forest-800 mb-3 flex items-center gap-2">
                                        <Leaf className="w-5 h-5 text-sage-600" />
                                        Meaning & Impact
                                    </h3>
                                    <p className="text-sm text-forest-700 leading-relaxed">
                                        {product.sustainabilityInfo}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-800 mb-3">
                                    {product.name}
                                </h2>
                                <p className="text-lg text-forest-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Quantity Selection */}
                            {product.quantityOptions.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-forest-800 mb-3">Select Quantity</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {product.quantityOptions.map((option) => (
                                            <button
                                                key={option.stems}
                                                onClick={() => setSelectedQuantity(option)}
                                                className={`p-3 rounded-xl border-2 transition-all ${selectedQuantity?.stems === option.stems
                                                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                                                    : 'border-sage-200 hover:border-sage-300'
                                                    }`}
                                            >
                                                <div className="font-semibold">{option.stems}</div>
                                                <div className="text-xs text-forest-600">stems</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Combo Options */}
                            <div>
                                <h3 className="font-semibold text-forest-800 mb-3">Add Accessories</h3>
                                <div className="space-y-2">
                                    {product.comboOptions.map((combo) => (
                                        <label
                                            key={combo.id}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedCombos.find((c) => c.id === combo.id)
                                                ? 'border-sage-500 bg-sage-50'
                                                : 'border-sage-200 hover:border-sage-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={!!selectedCombos.find((c) => c.id === combo.id)}
                                                    onChange={() => toggleCombo(combo)}
                                                    className="w-5 h-5 text-sage-500 rounded focus:ring-sage-400"
                                                />
                                                <span className="font-medium text-forest-800">{combo.name}</span>
                                            </div>
                                            <span className="font-semibold text-sage-600">+₹{combo.price}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div>
                                <h3 className="font-semibold text-forest-800 mb-3">Quantity</h3>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 rounded-full border-2 border-sage-300 hover:border-sage-500 transition-colors flex items-center justify-center"
                                    >
                                        <span className="text-xl text-sage-600">−</span>
                                    </button>
                                    <span className="text-2xl font-bold text-forest-800 w-12 text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 rounded-full border-2 border-sage-300 hover:border-sage-500 transition-colors flex items-center justify-center"
                                    >
                                        <span className="text-xl text-sage-600">+</span>
                                    </button>
                                </div>
                            </div>

                            {/* Price and Add to Cart */}
                            <div className="pt-6 border-t border-sage-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium text-forest-700">Total</span>
                                    <span className="text-3xl font-bold text-forest-800">
                                        ₹{calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="btn-secondary w-full text-lg py-4"
                                >
                                    Add to Tote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
