import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only handle 401 errors for expired tokens (ignore login/refresh failures)
        if (error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh')) {

            originalRequest._retry = true;

            try {
                // 1. Attempt refresh
                const res = await axios.post(
                    `${originalRequest.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // 2. Store new token
                const newAccessToken = res.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                // 3. Update current request header
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // 4. Retry request
                return api(originalRequest);
            } catch (refreshError) {
                // 5. If refresh fails, clear all auth data
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                window.location.href = "/login?session_expired=1";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;