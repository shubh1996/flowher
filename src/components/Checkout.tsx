import { useState } from 'react';
import { X, CreditCard, Leaf, CheckCircle } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

interface CheckoutProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Checkout({ isOpen, onClose }: CheckoutProps) {
    const [orderPlaced, setOrderPlaced] = useState(false);
    const { items, getTotal, clearCart } = useCartStore();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setOrderPlaced(true);
        setTimeout(() => {
            clearCart();
            setOrderPlaced(false);
            onClose();
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (orderPlaced) {
        return (
            <>
                <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={onClose} />
                <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-3xl z-50 p-8 animate-scale-in">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-sage-600" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-forest-800 mb-3">
                            Order Confirmed!
                        </h2>
                        <p className="text-forest-600 mb-6">
                            Thank you for your purchase. Your eco-friendly flowers are on their way!
                        </p>
                        <div className="bg-sage-50 rounded-xl p-4 flex items-start gap-3">
                            <Leaf className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-sage-700 text-left">
                                Your order will be shipped plastic-free and carbon-neutral. Thank you for choosing sustainable beauty!
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={onClose} />

            {/* Checkout Modal */}
            <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl z-50 overflow-hidden flex flex-col animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-sage-100">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-forest-800">Checkout</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-sage-50 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6 text-forest-800" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
                        {/* Form Section */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h3 className="text-xl font-serif font-semibold text-forest-800 mb-4">
                                    Contact Information
                                </h3>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <h3 className="text-xl font-serif font-semibold text-forest-800 mb-4">
                                    Shipping Address
                                </h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        />
                                        <input
                                            type="text"
                                            name="zipCode"
                                            placeholder="ZIP Code"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-serif font-semibold text-forest-800 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Payment
                                </h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        placeholder="Card Number"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            name="expiry"
                                            placeholder="MM/YY"
                                            value={formData.expiry}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        />
                                        <input
                                            type="text"
                                            name="cvv"
                                            placeholder="CVV"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn-secondary w-full text-lg py-4">
                                Place Order • ₹{getTotal().toFixed(2)}
                            </button>
                        </form>

                        {/* Order Summary */}
                        <div>
                            <h3 className="text-xl font-serif font-semibold text-forest-800 mb-4">
                                Order Summary
                            </h3>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex gap-4 pb-4 border-b border-sage-100">
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-forest-800">{item.product.name}</h4>
                                            <p className="text-sm text-forest-600">
                                                {item.selectedQuantity?.stems || 0} stems × {item.quantity}
                                            </p>
                                            {item.selectedCombos.length > 0 && (
                                                <p className="text-xs text-sage-600 mt-1">
                                                    + {item.selectedCombos.map(c => c.name).join(', ')}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-forest-800">₹{item.totalPrice}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-sage-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                                <Leaf className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-sage-700">
                                    Free carbon-neutral shipping on all orders. Your flowers will arrive in 100% plastic-free packaging.
                                </p>
                            </div>

                            <div className="space-y-3 text-lg">
                                <div className="flex justify-between">
                                    <span className="text-forest-700">Subtotal</span>
                                    <span className="font-semibold text-forest-800">₹{getTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-forest-700">Shipping</span>
                                    <span className="font-semibold text-sage-600">Free</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t-2 border-sage-200">
                                    <span className="font-bold text-forest-800">Total</span>
                                    <span className="text-2xl font-bold text-forest-800">₹{getTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
