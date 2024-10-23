import {
    getAccessToken,
    logout,
    setAccessToken,
    refreshToken,
} from "@/auth/jwtService";
import router from "@/router";
import axios from "axios";
import {i18n} from "@/localization";
import {ElNotification} from "element-plus";

import {refreshEndpoint} from "@/auth/jwt.config";


const axiosIns = axios.create({
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
let subscribers = [];

const onAccessTokenFetched = (accessToken: any) => {
    subscribers = subscribers.filter((callback) => callback(accessToken));
};

const addSubscriber = (callback: any) => {
    subscribers.push(callback);
};

//send token
axiosIns.interceptors.request.use(
    (config) => {
        let token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//404 or 401 pages use this response
axiosIns.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error) {
            console.log('ERROR ', error)
        }

        const {config: originalRequest} = error;
        if (error.response && error.response.status === 401 && router.currentRoute.value.meta.layout !== "LoginLayout") {

            const retryOriginalRequest = new Promise((resolve) => {

                addSubscriber((access: any) => {
                    let token = getAccessToken();
                    if (access) {
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
                error.config.url === refreshEndpoint
            ) {
                await logout()
            }
            return retryOriginalRequest;
        } else if (error.response?.status === 422) {
            if (error.response && error.response.data && error.response.data.message) {
                ElNotification({title: 'Error', message: error.response.data.message, type: 'error',})
            }
        } else if (error.response?.status === 500) {
            ElNotification({title: 'Error', message: "Error from server!", type: 'error',})
        } else if (error.response.status === 502) {
            ElNotification({title: 'Error', message: "Error from server 502", type: 'info',})
        }


        return Promise.reject(error);
    }
);

export default axiosIns;
