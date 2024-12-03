import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { activeLocale } from "@/localization";
import tokenManager from "@/utils/token.manager";
import { useAuthStore } from "@/modules/Auth/auth.store";
import { useCommonStore } from "@/stores/common.store";
import { ErrorType } from "@/plugins/axios/axios.types";
import { generateRandomID } from "@/utils/helper";
import router from "@/router";

const id = generateRandomID();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
  timeout: 120000,
  headers: {
    Accept: "application/json",
    "x-app-lang": activeLocale.value,
    "x-device-type": "web",
  },
});

// variables and functions
let isAlreadyFetchingAccessToken = false;
let subscribers = [];

const onAccessTokenFetched = () => {
  subscribers = subscribers.filter((callback) => callback());
};

const addSubscriber = (callback) => {
  subscribers.push(callback);
};

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig<any>) => {
    const accessToken = tokenManager.getAccessToken();

    if (accessToken && !config.headers.Authorization) config.headers["Authorization"] = `Bearer ${accessToken}`;

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
   async (response: AxiosResponse<any, any>): Promise<AxiosResponse | ErrorType> => {
    const data = response.data;
    const error = data.error;

    if (data.success) return Promise.resolve(response);
    else if (!data.success && error) {
       await useCommonStore().errorToast(error.message, "", `${id}1`);
      return Promise.reject(data);
    }
  },

  async (error) => {
    const authStore = useAuthStore();
    const commonStore = useCommonStore();

    const response = error.response;
    const message = response?.data?.error?.message ?? error?.message ?? "";
    const originalConfig = error.config;

    if (response && response.status === 401 && router.currentRoute.value.meta.layout !== "LoginLayout") {
      const retryOriginalRequest = new Promise((resolve) => {
        addSubscriber(() => {
          originalConfig.headers.Authorization = `Bearer ${tokenManager.getAccessToken()}`;
          resolve(axiosInstance(originalConfig));
        });
      });


      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true;
        await authStore.refresh();
        onAccessTokenFetched();
        isAlreadyFetchingAccessToken = false;
      } else if (isAlreadyFetchingAccessToken && error.config.url === "auth/refresh") {
        console.log("SSS");
        await commonStore.errorToast(message, "", id);
        await authStore.clear();
      }

      return retryOriginalRequest;
    } else {
      await commonStore.errorToast(message, "", `${id}error`);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;