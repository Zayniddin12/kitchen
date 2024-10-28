import { setItem, getItem, removeItem } from "@/utils/localStorage";

const accessTokenKey: string = "access_token";

export const setAccessToken = (access_token: string): void => {
    setItem(accessTokenKey, access_token);
};

export const getAccessToken = (): string | null => {
    return getItem(accessTokenKey);
};

export const removeAccessToken = (): void => {
    removeItem(accessTokenKey);
};