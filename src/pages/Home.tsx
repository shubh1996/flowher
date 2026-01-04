import { useState } from 'react';
import Header from '../components/Header';
import ProductListing from '../components/ProductListing';
import Cart from '../components/Cart';
import Checkout from '../components/Checkout';

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main>
        <ProductListing />
      </main>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-forest-800 text-cream-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-3">FlowHer</h3>
              <p className="text-cream-200 text-sm">
                Sustainable beauty that lasts forever. Handcrafted with love, designed with care.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Our Promise</h4>
              <ul className="space-y-2 text-sm text-cream-200">
                <li>100% Recycled Materials</li>
                <li>Carbon-Neutral Shipping</li>
                <li>Plastic-Free Packaging</li>
                <li>Fair Trade Certified</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <p className="text-sm text-cream-200">
                Email: hello@flowher.com<br />
                Phone: (555) 123-4567<br />
                Mon-Fri: 9am-6pm EST
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-forest-700 text-center text-sm text-cream-200">
            <p>&copy; 2024 FlowHer. All rights reserved. Made with 💚 for the planet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
