import { X, Minus, Plus, ShoppingBag, Leaf } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

export default function Cart({ isOpen, onClose, onCheckout }: CartProps) {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
                onClick={onClose}
            />

            {/* Cart Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-sage-100">
                    <h2 className="text-2xl font-serif font-bold text-forest-800">Your Tote</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-sage-50 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="w-6 h-6 text-forest-800" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag className="w-16 h-16 text-sage-300 mb-4" />
                            <p className="text-forest-600 text-lg">Your tote is empty</p>
                            <p className="text-forest-500 text-sm mt-2">Add some beautiful flowers to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="bg-cream-50 rounded-xl p-4 flex gap-4 animate-scale-in"
                                >
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-forest-800 mb-1">
                                            {item.product.name}
                                        </h3>
                                        <p className="text-sm text-forest-600 mb-2">
                                            {item.selectedQuantity.stems} stems
                                        </p>

                                        {item.selectedCombos.length > 0 && (
                                            <p className="text-xs text-sage-600 mb-2">
                                                + {item.selectedCombos.map(c => c.name).join(', ')}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                    className="p-1 hover:bg-sage-50 rounded-full transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-4 h-4 text-sage-600" />
                                                </button>
                                                <span className="text-sm font-medium w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-sage-50 rounded-full transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-4 h-4 text-sage-600" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.product.id)}
                                                className="text-sm text-terracotta-400 hover:text-terracotta-500 font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-forest-800">₹{item.totalPrice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-sage-100 p-6 space-y-4">
                        {/* Eco Message */}
                        <div className="bg-sage-50 rounded-lg p-4 flex items-start gap-3">
                            <Leaf className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-sage-700">
                                This order will ship 100% plastic-free and carbon-neutral
                            </p>
                        </div>

                        {/* Subtotal */}
                        <div className="flex items-center justify-between text-lg">
                            <span className="font-medium text-forest-700">Subtotal</span>
                            <span className="text-2xl font-bold text-forest-800">
                                ₹{getTotal().toFixed(2)}
                            </span>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={onCheckout}
                            className="btn-secondary w-full text-lg py-4"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
