import { create } from "zustand";

export const useProductStore = create((set, get) => ({
    products: [],
    setProducts: (products) => set({ products }),
    offset: 0,
    limit: 9,
    hasMore: true,
    createProduct: async (newProduct) => {
        const userId = localStorage.getItem("userId");

        if (!newProduct.name || !newProduct.image || !newProduct.price) {
            return { success: false, message: "Please fill in all fields." };
        }

        const res = await fetch("http://localhost:5002/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...newProduct, userId }),
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set((state) => ({ products: [...state.products, data.data] }));
        return { success: true, message: "Product created successfully" };
    },
    loadMoreProducts: async () => {
        const userId = localStorage.getItem("userId");
        const { offset, limit, hasMore, products } = get();
        if (!hasMore) return;
        const res = await fetch(`http://localhost:5002/api/products/${userId}/${offset}/${limit}`);
        const data = await res.json();
        if (data.data.length < limit) {
            set({ hasMore: false });
        }
        set({
            products: [...products, ...data.data],
            offset: offset + limit
        })
    },
    resetPagination: () => set({ offset: 0, products: [], hasMore: true }),
    deleteProduct: async (pid) => {
        const userId = localStorage.getItem("userId");
        const res = await fetch(`http://localhost:5002/api/products/${pid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
        return { success: true, message: data.message };
    },
    updateProduct: async (pid, updatedProduct) => {
        const userId = localStorage.getItem("userId");
        const res = await fetch(`http://localhost:5002/api/products/${pid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...updatedProduct, userId }),
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set((state) => ({
            products: state.products.map((product) => (product._id === pid ? data.data : product)),
        }));

        return { success: true, message: data.message };
    },


}));