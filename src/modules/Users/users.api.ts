import {
    SearchUserDataType,
    UserApiUrlType, UserCreateOrUpdateDataType,
    UserShowType,
    UsersParamsType,
    UsersType
} from "@/modules/Users/users.types";
import axios from "@/plugins/axios/axios";

export default (url: UserApiUrlType) => {
    return {
        async fetchUsers(params: UsersParamsType = {}): Promise<UsersType> {
            const { data }: { data: Record<string, any> } = await axios.get(url, { params });
            return data.data as UsersType;
        },

        async fetchUser(id: number): Promise<UserShowType> {
            const { data }: { data: Record<string, any> } = await axios.get(`${url}/${id}`);
            return data.data.user;
        },

        deleteUser(id: number) {
            return axios.delete(`${url}/${id}`);
        },

        async fetchSearchUser(userData: SearchUserDataType): Promise<UserShowType> {
            const { data }: { data: Record<string, any> } = await axios.post(`${url}/search`, userData);
            return data.data.user;
        },

        createUser(data: UserCreateOrUpdateDataType) {
            return axios.post(`${url}`, data);
        },

        updateUser(id: number, data: UserCreateOrUpdateDataType) {
            return axios.put(`${url}/${id}`, data);
        }
    };
}

