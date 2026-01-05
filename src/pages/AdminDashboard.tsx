import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { ProductData } from '../services/api';
import { Plus, Edit, Trash2, LogOut, Upload, X, Sparkles } from 'lucide-react';

export default function AdminDashboard() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCleaning, setIsCleaning] = useState(false);
  const [hasCustomizations, setHasCustomizations] = useState(true);
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    description: '',
    basePrice: 0,
    category: 'roses',
    ecoFriendly: true,
    sustainabilityInfo: '',
    inStock: true,
    comboOptions: [],
    quantityOptions: [{ stems: 12, priceModifier: 0 }],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      category: product.category,
      ecoFriendly: product.ecoFriendly,
      sustainabilityInfo: product.sustainabilityInfo || '',
      inStock: product.inStock,
      comboOptions: product.comboOptions || [],
      quantityOptions: product.quantityOptions || [{ stems: 12, priceModifier: 0 }],
    });
    setHasCustomizations(
      (product.comboOptions && product.comboOptions.length > 0) ||
      (product.quantityOptions && product.quantityOptions.length > 0)
    );
    setSelectedFiles([]);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        ...formData,
        comboOptions: hasCustomizations ? formData.comboOptions : [],
        quantityOptions: hasCustomizations ? formData.quantityOptions : [],
      };

      let productId = editingProduct?.id;

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
      } else {
        const newProduct = await api.createProduct(productData);
        productId = newProduct.id;
      }

      if (selectedFiles.length > 0 && productId) {
        setIsCleaning(true);
        try {
          for (const file of selectedFiles) {
            // Simulate "Nano Banana" / Gemini cleaning
            // In a real app, you would send the file to an AI service here
            console.log(`Cleaning image: ${file.name}...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay

            await api.uploadProductImage(productId, file);
          }
        } finally {
          setIsCleaning(false);
        }
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      alert('Failed to save product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      basePrice: 0,
      category: 'roses',
      ecoFriendly: true,
      sustainabilityInfo: '',
      inStock: true,
      comboOptions: [],
      quantityOptions: [{ stems: 12, priceModifier: 0 }],
    });
    setHasCustomizations(true);
    setSelectedFiles([]);
  };

  const addComboOption = () => {
    setFormData({
      ...formData,
      comboOptions: [...formData.comboOptions, { name: '', price: 0, category: 'accessory' }],
    });
  };

  const updateComboOption = (index: number, field: string, value: any) => {
    const newOptions = [...formData.comboOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, comboOptions: newOptions });
  };

  const removeComboOption = (index: number) => {
    setFormData({
      ...formData,
      comboOptions: formData.comboOptions.filter((_, i) => i !== index),
    });
  };

  const addQuantityOption = () => {
    setFormData({
      ...formData,
      quantityOptions: [...formData.quantityOptions, { stems: 0, priceModifier: 0 }],
    });
  };

  const updateQuantityOption = (index: number, field: string, value: number) => {
    const newOptions = [...formData.quantityOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, quantityOptions: newOptions });
  };

  const removeQuantityOption = (index: number) => {
    setFormData({
      ...formData,
      quantityOptions: formData.quantityOptions.filter((_, i) => i !== index),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-forest-800">Admin Dashboard</h1>
              <p className="text-sm text-forest-600">Welcome back, {username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-terracotta-50 text-terracotta-600 rounded-xl hover:bg-terracotta-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-semibold text-forest-800">Products</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingProduct(null);
              resetForm();
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-forest-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-forest-600">No products yet. Add your first product!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card overflow-hidden">
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0]?.startsWith('http') ? product.images[0] : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-serif font-semibold text-lg text-forest-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-forest-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-xl font-bold text-sage-600 mb-4">₹{product.basePrice}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sage-50 text-sage-700 rounded-xl hover:bg-sage-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-terracotta-50 text-terracotta-600 rounded-xl hover:bg-terracotta-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
          <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl z-50 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-sage-100">
              <h2 className="text-2xl font-serif font-bold text-forest-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="p-2 hover:bg-sage-50 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-forest-800" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Product Image
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-sage-50 text-sage-700 rounded-xl hover:bg-sage-100 transition-colors border border-sage-200">
                        <Upload className="w-4 h-4" />
                        Choose Images
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-sm text-forest-600">
                        {selectedFiles.length} file(s) selected
                      </span>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="bg-white border border-sage-100 px-3 py-1 rounded-lg text-sm text-forest-600 flex items-center gap-2">
                            <span className="truncate max-w-[150px]">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                              className="text-terracotta-500 hover:text-terracotta-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {isCleaning && (
                      <div className="text-sm text-sage-600 animate-pulse flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Cleaning images with AI...
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field min-h-24"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">
                      Base Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) =>
                        setFormData({ ...formData, basePrice: parseFloat(e.target.value) })
                      }
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="roses">Roses</option>
                      <option value="peonies">Peonies</option>
                      <option value="daisies">Daisies</option>
                      <option value="wildflowers">Wildflowers</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    Sustainability Info
                  </label>
                  <textarea
                    value={formData.sustainabilityInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, sustainabilityInfo: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.ecoFriendly}
                      onChange={(e) =>
                        setFormData({ ...formData, ecoFriendly: e.target.checked })
                      }
                      className="w-5 h-5 text-sage-500 rounded focus:ring-sage-400"
                    />
                    <span className="text-sm text-forest-700">Eco-Friendly</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-5 h-5 text-sage-500 rounded focus:ring-sage-400"
                    />
                    <span className="text-sm text-forest-700">In Stock</span>
                  </label>
                </div>

                <div className="border-t border-sage-100 pt-6">
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={hasCustomizations}
                      onChange={(e) => setHasCustomizations(e.target.checked)}
                      className="w-5 h-5 text-sage-500 rounded focus:ring-sage-400"
                    />
                    <span className="font-medium text-forest-800">Enable Customizations (Combos & Quantities)</span>
                  </label>

                  {hasCustomizations && (
                    <div className="space-y-6 animate-fade-in">
                      {/* Quantity Options */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-forest-700">Quantity Options</label>
                          <button
                            type="button"
                            onClick={addQuantityOption}
                            className="text-sm text-sage-600 hover:text-sage-700"
                          >
                            + Add Option
                          </button>
                        </div>
                        {formData.quantityOptions.map((option, index) => (
                          <div key={index} className="flex gap-3 mb-3">
                            <input
                              type="number"
                              placeholder="Stems"
                              value={option.stems}
                              onChange={(e) =>
                                updateQuantityOption(index, 'stems', parseInt(e.target.value) || 0)
                              }
                              className="input-field flex-1"
                            />
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Price Modifier"
                              value={option.priceModifier}
                              onChange={(e) =>
                                updateQuantityOption(
                                  index,
                                  'priceModifier',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="input-field flex-1"
                            />
                            {formData.quantityOptions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeQuantityOption(index)}
                                className="px-3 py-2 text-terracotta-600 hover:bg-terracotta-50 rounded-xl transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Combo Options */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-forest-700">Combo Options</label>
                          <button
                            type="button"
                            onClick={addComboOption}
                            className="text-sm text-sage-600 hover:text-sage-700"
                          >
                            + Add Option
                          </button>
                        </div>
                        {formData.comboOptions.map((option, index) => (
                          <div key={index} className="flex gap-3 mb-3">
                            <input
                              type="text"
                              placeholder="Name (e.g., Gift Box)"
                              value={option.name}
                              onChange={(e) => updateComboOption(index, 'name', e.target.value)}
                              className="input-field flex-1"
                            />
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Price"
                              value={option.price}
                              onChange={(e) =>
                                updateComboOption(index, 'price', parseFloat(e.target.value) || 0)
                              }
                              className="input-field w-32"
                            />
                            <button
                              type="button"
                              onClick={() => removeComboOption(index)}
                              className="px-3 py-2 text-terracotta-600 hover:bg-terracotta-50 rounded-xl transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="submit" className="btn-secondary flex-1">
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                    }}
                    className="px-6 py-3 border-2 border-sage-200 text-forest-700 rounded-xl hover:bg-sage-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div >
        </>
      )
      }
    </div >
  );
}
