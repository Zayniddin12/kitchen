import {
    getAccessToken,
    logout,
    setAccessToken,
    refreshToken,
} from "@/auth/jwtService";
import router from "@/router";
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError} from "axios";
import {i18n} from "@/localization";
import {ElNotification} from "element-plus";

import {refreshEndpoint} from "@/auth/jwt.config";
import { useRouter } from "vue-router";
import { useCommonStore } from "@/stores/common.store";

const axiosIns: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND,
    timeout: 20000,
    headers: {
        Accept: "application/json",
        "x-app-lang": i18n.locale.value,
        "x-device-type": "web",

        // "x-device-model": "Intel Mac OS",
        // "x-app-version": "0.0.1",
        // "x-app-build": "1",
        // "x-device-uid": "71C7B833-C6EA-4326-A8FF-CB8551867656",
        // "x-device-type": "web",
    },
});

let isAlreadyFetchingAccessToken = false;
let subscribers: Array<(accessToken: string) => void> = [];

const onAccessTokenFetched = (accessToken: string): void => {
    subscribers = subscribers.filter((callback) => callback(accessToken));
};

const addSubscriber = (callback: (accessToken: string) => void): void => {
    subscribers.push(callback);
};

// Send token
axiosIns.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = "Bearer " + token;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Handle responses for 404 or 401 pages
axiosIns.interceptors.response.use(
    async (response: AxiosResponse) => {
        if (response.data.success) return Promise.resolve(response);
        const error = response.data.error;

        if (error.code === 404){
            const commonStore = useCommonStore();
            commonStore.redirectNotFound(error.message);
        }

        return Promise.reject(error);
    },
    async (error: AxiosError) => {
        if (error) {
            console.log('ERROR ', error);
        }

        const {config: originalRequest} = error;

        if (error.response && error.response.status === 401 && router.currentRoute.value.meta.layout !== "LoginLayout") {
            const retryOriginalRequest = new Promise((resolve) => {
                addSubscriber((access: string) => {
                    const token = getAccessToken();
                    if (access && originalRequest?.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    resolve(axiosIns(originalRequest));
                });
            });

            if (!isAlreadyFetchingAccessToken) {
                isAlreadyFetchingAccessToken = true;
                const {data} = await refreshToken();
                onAccessTokenFetched(data.access);
                setAccessToken(data.access);
                isAlreadyFetchingAccessToken = false;
            } else if (
                isAlreadyFetchingAccessToken &&
                error.config?.url === refreshEndpoint
            ) {
                await logout();
            }
            return retryOriginalRequest;
        } else if (error.response?.status === 422) {
            if (error.response?.data?.message) {
                ElNotification({title: 'Error', message: error.response.data.message, type: 'error'});
            }
        } else if (error.response?.status === 500) {
            ElNotification({title: 'Error', message: "Error from server!", type: 'error'});
        } else if (error.response?.status === 502) {
            ElNotification({title: 'Error', message: "Error from server 502", type: 'info'});
        }

        return Promise.reject(error);
    }
);

export default axiosIns;
