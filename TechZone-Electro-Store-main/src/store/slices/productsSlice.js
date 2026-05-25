import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api.js";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => api.getProducts());
export const fetchCatalog = createAsyncThunk("products/fetchCatalog", async () => api.getCatalog());
export const saveProductToBackend = createAsyncThunk("products/saveProductToBackend", async (product) => api.saveProduct(product));
export const saveCategoryToBackend = createAsyncThunk("products/saveCategoryToBackend", async (category) => api.saveCategory(category));
export const deleteCategoryFromBackend = createAsyncThunk("products/deleteCategoryFromBackend", async (category) => {
    const id = category.id || category;
    await api.deleteCategory(id);
    return id;
});
export const saveBrandToBackend = createAsyncThunk("products/saveBrandToBackend", async (brand) => api.saveBrand(brand));
export const deleteBrandFromBackend = createAsyncThunk("products/deleteBrandFromBackend", async (brand) => {
    const id = brand.id || brand;
    await api.deleteBrand(id);
    return id;
});
export const addProductReview = createAsyncThunk("products/addProductReview", async ({ productId, review }) => api.addReview(productId, review));
export const deleteProductFromBackend = createAsyncThunk("products/deleteProductFromBackend", async (id) => {
    await api.deleteProduct(id);
    return id;
});

const productsSlice = createSlice({
    name: "products",
    initialState: {
        all: [],
        customCategories: [],
        customBrands: [],
        catalogCategories: [],
        catalogBrands: [],
        isCatalogLoading: false,
        isLoading: false,
        error: null
    },
    reducers: {
        updateProducts: (state, action) => {
            state.all = action.payload;
        },
        addCategory: (state, action) => {
            const newCat = action.payload;
            if (!state.customCategories.includes(newCat)) state.customCategories.push(newCat);
        },
        addBrand: (state, action) => {
            const { name, category } = action.payload;
            if (!state.customBrands.some(b => b.name === name && b.category === category)) {
                state.customBrands.push({ name, category });
            }
        },
        deleteBrand: (state, action) => {
            const { name, category } = action.payload;
            state.customBrands = state.customBrands.filter(b => !(b.name === name && b.category === category));
        },
        deleteCategory: (state, action) => {
            state.customCategories = state.customCategories.filter(c => c !== action.payload);
        },
        addReview: (state, action) => {
            const { productId, review } = action.payload;
            const product = state.all.find(p => p.id === productId);
            if (product) {
                product.reviews_list = [{ ...review, id: Date.now(), date: new Date().toISOString() }, ...(product.reviews_list || [])];
                product.reviews = (product.reviews || 0) + 1;
            }
        },
        deleteReview: (state, action) => {
            const { productId, reviewId } = action.payload;
            const product = state.all.find(p => p.id === productId);
            if (product && product.reviews_list) {
                product.reviews_list = product.reviews_list.filter(r => r.id !== reviewId);
                product.reviews = Math.max(0, product.reviews_list.length);
            }
        },
        deductStock: (state, action) => {
            action.payload.forEach(item => {
                const itemId = item.productId || item.id;
                const product = state.all.find(p => String(p.id) === String(itemId));
                if (product && product.stock !== undefined) {
                    product.stock = Math.max(0, product.stock - (Number(item.quantity) || 1));
                    product.isOutOfStock = product.stock <= 0;
                }
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.all = action.payload;
                state.customCategories = [...new Set(action.payload.map(p => p.category).filter(Boolean))];
                state.customBrands = [...new Map(action.payload
                    .filter(p => p.brand)
                    .map(p => [`${p.brand}-${p.category || ''}`, { name: p.brand, category: p.category }])).values()];
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.all = [];
                state.error = action.error.message;
            })
            .addCase(fetchCatalog.pending, (state) => {
                state.isCatalogLoading = true;
            })
            .addCase(fetchCatalog.fulfilled, (state, action) => {
                state.isCatalogLoading = false;
                state.catalogCategories = action.payload.categories || [];
                state.catalogBrands = action.payload.brands || [];
            })
            .addCase(fetchCatalog.rejected, (state) => {
                state.isCatalogLoading = false;
            })
            .addCase(saveCategoryToBackend.fulfilled, (state, action) => {
                const index = state.catalogCategories.findIndex(category => category.id === action.payload.id);
                if (index >= 0) state.catalogCategories[index] = action.payload;
                else state.catalogCategories.push(action.payload);
            })
            .addCase(deleteCategoryFromBackend.fulfilled, (state, action) => {
                state.catalogCategories = state.catalogCategories.filter(category => category.id !== action.payload);
            })
            .addCase(saveBrandToBackend.fulfilled, (state, action) => {
                const nextBrand = { ...action.payload, category: action.meta.arg.category || action.payload.category };
                const index = state.catalogBrands.findIndex(brand => brand.id === action.payload.id);
                if (index >= 0) state.catalogBrands[index] = nextBrand;
                else state.catalogBrands.push(nextBrand);
            })
            .addCase(deleteBrandFromBackend.fulfilled, (state, action) => {
                state.catalogBrands = state.catalogBrands.filter(brand => brand.id !== action.payload);
            })
            .addCase(saveProductToBackend.fulfilled, (state, action) => {
                const index = state.all.findIndex(p => p.id === action.payload.id);
                if (index >= 0) state.all[index] = action.payload;
                else state.all.unshift(action.payload);
            })
            .addCase(addProductReview.fulfilled, (state, action) => {
                const index = state.all.findIndex(p => p.id === action.payload.id);
                if (index >= 0) state.all[index] = action.payload;
            })
            .addCase(deleteProductFromBackend.fulfilled, (state, action) => {
                state.all = state.all.filter(p => p.id !== action.payload);
            });
    }
});

export const {
    updateProducts, addReview, deleteReview, deductStock,
    addCategory, addBrand, deleteCategory, deleteBrand
} = productsSlice.actions;
export default productsSlice.reducer;
