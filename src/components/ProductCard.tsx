import type { Product } from '../types/product';
import { Leaf } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onQuickAdd: (product: Product) => void;
    onClick: (product: Product) => void;
}

export default function ProductCard({ product, onQuickAdd, onClick }: ProductCardProps) {
    return (
        <div
            className="card overflow-hidden group cursor-pointer animate-fade-in"
            onClick={() => onClick(product)}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-cream-50">
                <img
                    src={product.images[0]?.startsWith('http') ? product.images[0] : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.ecoFriendly && (
                    <div className="absolute top-3 left-3 eco-badge backdrop-blur-sm">
                        <Leaf className="w-4 h-4" />
                        <span>Eco-Friendly</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-serif font-semibold text-forest-800 mb-2 group-hover:text-sage-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-forest-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-forest-800">
                        ₹{product.basePrice}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onQuickAdd(product);
                        }}
                        className="btn-primary text-sm px-5 py-2"
                    >
                        Quick Add
                    </button>
                </div>
            </div>
        </div>
    );
}
