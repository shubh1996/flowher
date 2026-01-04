import { ShoppingCart, Menu, Leaf } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';

interface HeaderProps {
    onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const itemCount = useCartStore((state) => state.getItemCount());

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="bg-sage-400 p-2 rounded-full">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-forest-800">
                            Flow<span className="text-sage-500">Her</span>
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#" className="text-forest-700 hover:text-sage-500 transition-colors font-medium">
                            Shop
                        </a>
                        <a href="#" className="text-forest-700 hover:text-sage-500 transition-colors font-medium">
                            About
                        </a>
                        <a href="#" className="text-forest-700 hover:text-sage-500 transition-colors font-medium">
                            Sustainability
                        </a>
                        <a href="#" className="text-forest-700 hover:text-sage-500 transition-colors font-medium">
                            Contact
                        </a>
                    </nav>

                    {/* Cart Icon */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onCartClick}
                            className="relative p-2 hover:bg-sage-50 rounded-full transition-colors"
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart className="w-6 h-6 text-forest-800" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-terracotta-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 hover:bg-sage-50 rounded-full transition-colors"
                            aria-label="Menu"
                        >
                            <Menu className="w-6 h-6 text-forest-800" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <nav className="md:hidden py-4 border-t border-sage-100 animate-slide-up">
                        <a href="#" className="block py-2 text-forest-700 hover:text-sage-500 transition-colors">
                            Shop
                        </a>
                        <a href="#" className="block py-2 text-forest-700 hover:text-sage-500 transition-colors">
                            About
                        </a>
                        <a href="#" className="block py-2 text-forest-700 hover:text-sage-500 transition-colors">
                            Sustainability
                        </a>
                        <a href="#" className="block py-2 text-forest-700 hover:text-sage-500 transition-colors">
                            Contact
                        </a>
                    </nav>
                )}
            </div>
        </header>
    );
}
