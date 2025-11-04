import axios from "axios";

let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    // console.log("🔐 Sending request with token:", accessToken);
    if (accessToken && accessToken !== "null") {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                        return API(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newToken = res.data.token;
                accessToken = newToken;

                processQueue(null, newToken);

                // Retry original request
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                accessToken = null;
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const setAccessToken = (token) => {
    accessToken = token;
}

export default API;
