/**
 * LEGACY AUTH UTILS
 * These are being deprecated in favor of next-auth hooks (useSession, signIn, signOut).
 * Mock data has been removed.
 */

export const login = async (email, password) => {
    console.warn("lib/auth: login() is deprecated. Use next-auth signIn() instead.");
    return null;
};

export const logout = () => {
    console.warn("lib/auth: logout() is deprecated. Use next-auth signOut() instead.");
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('erp_auth_token');
    }
    return null;
};

export const getUser = () => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('erp_user_data');
        return userStr ? JSON.parse(userStr) : null;
    }
    return null;
};

export const isAuthenticated = () => {
    return !!getToken();
};
