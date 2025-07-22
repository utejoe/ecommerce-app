const baseURL = process.env.REACT_APP_API_BASE_URL;

export const signupAPI = `${baseURL}/signup`;
export const loginAPI = `${baseURL}/login`;
export const allProductsAPI = `${baseURL}/allproducts`;
export const newCollectionsAPI = `${baseURL}/newcollections`;
export const popularWomenAPI = `${baseURL}/popularinwomen`;
export const addToCartAPI = `${baseURL}/addtocart`;
export const removeFromCartAPI = `${baseURL}/removefromcart`;
export const getCartAPI = `${baseURL}/getcart`;
export const syncCartAPI = `${baseURL}/synccart`;

// ✅ Admin-specific endpoints (ADD THESE)
export const uploadImage = `${baseURL}/upload`;
export const addProduct = `${baseURL}/addproduct`;
export const allProducts = `${baseURL}/allproducts`; // already exists; just alias
export const removeProduct = `${baseURL}/removeproduct`;
