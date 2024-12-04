import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { activeLocale } from "@/localization";
import { getAccessToken } from "@/utils/token.manager";
import { ElNotification } from "element-plus";
import { useAuthStore } from "@/modules/Auth/auth.store";
import { useCommonStore } from "@/stores/common.store";
import { AxiosResponseDataType, ErrorType } from "@/plugins/axios/axios.types";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
  timeout: 120000,
  headers: {
    Accept: "application/json",
    "x-app-lang": activeLocale.value,
    "x-device-type": "web",
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig<any>) => {
    const accessToken = getAccessToken();

    if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any, any>): Promise<AxiosResponse | ErrorType> => {
    const data = response.data;
    const error = data.error;

    if (data.success) return Promise.resolve(response);
    else if (!data.success && error) {
      useCommonStore().errorToast(error.message);
      return Promise.reject(data);
    }
  },

  async (error) => {
    const authStore = useAuthStore();
    const commonStore = useCommonStore();
    const message = error?.message ?? error.response?.data?.error?.message ?? "";

    if (error.status === 401) {
      authStore.clear();
    } else {
      commonStore.errorToast(message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;