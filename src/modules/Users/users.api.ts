import {
    SearchUserDataType,
    UserApiUrlType,
    UserShowType,
    UsersParamsType,
    UsersType
} from "@/modules/Users/users.types";
import axios from "@/plugins/axios/axios";


export default {
    async fetchUsers(url: UserApiUrlType, params: UsersParamsType = {}): Promise<UsersType> {
        const { data }: { data: Record<string, any> } = await axios.get(url, { params });
        return data.data as UsersType;
    },

    async fetchUser(url: UserApiUrlType, id: number): Promise<UserShowType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${url}/${id}`);
        return data.data.user;
    },

    deleteUser(url: UserApiUrlType, id: number) {
        return axios.delete(`${url}/${id}`);
    },

    async fetchSearchUser(url: UserApiUrlType, userData: SearchUserDataType): Promise<UserShowType> {
        const { data }: { data: Record<string, any> } = await axios.get(`${url}/search`, { params: userData });
        return data.data.user;
    }
};