import {
    getAccessToken,
    logout,
    setAccessToken,
    refreshToken,
} from "@/auth/jwtService";
import router from "@/router";
import axios from "axios";


import {refreshEndpoint} from "@/auth/jwt.config";

import {toast} from "vue3-toastify";
import i18n from "@/plugins/i18n";


const errorText = {
    ru: 'Система неверна или срок действия компании истек. Перезагрузите систему(Ctrl + R) или обратитесь к администратору',
    oz: 'Тизим нотўғри ёки компания муддати тугаган. Тизимни қайта ёқинг(Ctrl + R) ёки администраторингизга мурожаат қилинг',
    uz: 'Tizim noto\'g\'ri yoki kompaniya muddati tugagan. Tizimni qayta yoqing(Ctrl + R) yoki administratoringizga murojaat qiling'
}
const axiosIns = axios.create({
    baseURL: import.meta.env.VITE_BACKEND,
    timeout: 20000,

    headers: {Accept: "application/json"},
});

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

const onAccessTokenFetched = (accessToken) => {
    subscribers = subscribers.filter((callback) => callback(accessToken));
};

const addSubscriber = (callback) => {
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

                addSubscriber((access) => {
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
        } else if (error.response.status === 422) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                toast.error(error.response.data.message);
            }
        } else if (error.response.status === 500) {
            toast.error("Error from server!");
        } else if (error.response.status === 502) {
            toast.info(errorText[i18n.global.locale.value])
        }


        return Promise.reject(error);
    }
);

export default axiosIns;
