const baseURL = import.meta.env.VITE_API_BASE_URL;

export const uploadImage = `${baseURL}/upload`;
export const addProduct = `${baseURL}/addproduct`;
export const allProducts = `${baseURL}/allproducts`;
export const removeProduct = `${baseURL}/removeproduct`; // <-- ✅ used above
