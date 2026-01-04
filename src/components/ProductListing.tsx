import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';
import type { Product } from '../types/product';
import { useCartStore } from '../store/cartStore';
import { Sparkles, Loader } from 'lucide-react';

type Category = 'all' | 'roses' | 'peonies' | 'daisies' | 'mixed' | 'wildflowers';

export default function ProductListing() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const categories: { id: Category; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'roses', label: 'Roses' },
        { id: 'peonies', label: 'Peonies' },
        { id: 'daisies', label: 'Daisies' },
        { id: 'wildflowers', label: 'Wildflowers' },
        { id: 'mixed', label: 'Mixed' },
    ];

    const filteredProducts =
        selectedCategory === 'all'
            ? products
            : products.filter((p) => p.category === selectedCategory);

    const handleQuickAdd = (product: Product) => {
        addItem({
            product,
            quantity: 1,
            selectedCombos: [],
            selectedQuantity: product.quantityOptions[0],
        });
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsDetailOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-sage-50 px-4 py-2 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-sage-600" />
                    <span className="text-sm font-medium text-sage-700">Eco-Friendly • Reusable • Forever Beautiful</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-forest-800 mb-4">
                    Sustainable Paper Flowers
                </h1>
                <p className="text-lg md:text-xl text-forest-600 max-w-2xl mx-auto">
                    Handcrafted with love, designed to last forever. Each bloom is a work of art made from 100% recycled materials.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader className="w-8 h-8 text-sage-600 animate-spin" />
                </div>
            ) : (
                <>
                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-full font-medium transition-all ${selectedCategory === category.id
                                    ? 'bg-sage-400 text-white shadow-lg scale-105'
                                    : 'bg-white text-forest-700 hover:bg-sage-50 border border-sage-200'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onQuickAdd={handleQuickAdd}
                                onClick={handleProductClick}
                            />
                        ))}
                    </div>

                    <ProductDetail
                        product={selectedProduct}
                        isOpen={isDetailOpen}
                        onClose={() => {
                            setIsDetailOpen(false);
                            setSelectedProduct(null);
                        }}
                    />
                </>
            )}
        </div>
    );
}
