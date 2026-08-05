"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Search, Pencil, Trash2, X, Check, Loader2, Sparkles, TrendingUp, DollarSign, Layers, AlertTriangle } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/app/actions/services/productsService";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: "", price: "", description: "" });
    const [errorMsg, setErrorMsg] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState(null);

    useEffect(() => {
        async function fetchProductsData() {
            setLoading(true);
            const result = await getProducts();
            if (result?.success) {
                setProducts(result?.data || []);
            } else {
                console.error("Failed to load products:", result?.message);
            }
            setLoading(false);
        }
        fetchProductsData();
    }, []);


    const handleOpenModal = (product = null) => {
        setErrorMsg("");
        if (product) {
            setEditingId(product.id);
            setFormData({
                name: product.name || "",
                price: product.price || "",
                description: product.description || "",
            });
        } else {
            setEditingId(null);
            setFormData({ name: "", price: "", description: "" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: "", price: "", description: "" });
        setErrorMsg("");
    };

    const handleOpenDeleteModal = (product) => {
        setDeletingProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingProduct(null);
    };


    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setErrorMsg("Product name is required.");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        const result = await createProduct(formData);
        if (result?.success) {
            const newItem = result.data || { id: result.id, ...formData };
            setProducts((prev) => [newItem, ...prev]);
            handleCloseModal();
        } else {
            console.error(result?.message,"Failed to create product.")
        }
        setLoading(false);
    };


    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setErrorMsg("Product name is required.");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        const result = await updateProduct(editingId, formData);
        if (result?.success) {
            setProducts((prev) =>
                prev.map((item) => (item.id === editingId ? { ...item, ...formData } : item))
            );
            handleCloseModal();
        } else {
            setErrorMsg(result?.message || "Failed to update product.");
        }
        setLoading(false);
    };


    const handleDeleteConfirm = async () => {
        if (!deletingProduct) return;

        setLoading(true);
        const result = await deleteProduct(deletingProduct.id);
        if (result?.success) {
            setProducts((prev) => prev.filter((item) => item.id !== deletingProduct.id));
            handleCloseDeleteModal();
        } else {
            alert(result?.message || "Delete failed.");
        }
        setLoading(false);
    };

    const filteredProducts = products.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase())
    );


    const totalProducts = products.length;
    const avgPrice = totalProducts > 0
        ? (products.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0) / totalProducts).toFixed(2)
        : "0.00";

    return (
        <div className="min-h-screen bg-slate-50/60 p-6 md:p-10 flex justify-center">
            <div className="w-full max-w-6xl flex flex-col gap-8">


                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                Products & Services
                                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                            </h1>
                            <p className="text-slate-500 text-xs mt-0.5 font-medium">
                                Manage all available products to link them with deals and clients.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-blue-600/20 cursor-pointer shrink-0"
                    >
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                        <span>Add New Product</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalProducts}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            <Layers className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Price</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">${avgPrice}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Status</p>
                            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full mt-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Active & Ready
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by product name or description..."
                        className="w-full bg-white border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {loading && products.length === 0 ? (
                        <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200/80 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            <p className="text-slate-500 text-sm font-semibold">Loading products...</p>
                        </div>
                    ) : (
                        filteredProducts.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 p-5 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden"
                            >
                                {/* Top decorative gradient line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center font-bold transition-colors">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        {item.price ? (
                                            <span className="text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                                                ${item.price}
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                                                N/A
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {item.name}
                                        </h3>
                                        <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                                            {item.description || "No description provided for this product."}
                                        </p>
                                    </div>
                                </div>


                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => handleOpenModal(item)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer disabled:opacity-40"
                                        title="Edit"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => handleOpenDeleteModal(item)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer disabled:opacity-40"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <Package className="w-6 h-6" />
                            </div>
                            <p className="text-slate-700 text-sm font-bold">No products found.</p>
                            <p className="text-slate-400 text-xs">Try adding a new product or searching with a different keyword.</p>
                        </div>
                    )}
                </div>


                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-150 border border-slate-100">

                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Package className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-base font-extrabold text-slate-900">
                                        {editingId ? "Edit Product Details" : "Add New Product"}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={editingId ? handleUpdate : handleCreate} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700">Product or Service Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Cloud SaaS Subscription"
                                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700">Default Price ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700">Description & Details</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Write a brief description of the product..."
                                        className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                                    />
                                </div>

                                {errorMsg && (
                                    <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                                        {errorMsg}
                                    </p>
                                )}

                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Check className="w-4 h-4 stroke-[3]" />
                                        )}
                                        <span>{editingId ? "Update Product" : "Save Product"}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150 border border-slate-100">
                            
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-extrabold text-slate-900">Delete Product</h2>
                                    <p className="text-slate-500 text-xs font-medium mt-0.5">This action cannot be undone.</p>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                Are you sure you want to delete <span className="font-bold text-slate-900">{deletingProduct?.name}</span>?
                            </p>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleCloseDeleteModal}
                                    className="px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleDeleteConfirm}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    <span>Delete</span>
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}