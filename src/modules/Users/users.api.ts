import { UsersParamsType, UsersType } from "@/modules/Users/users.types";
import axios from "@/plugins/axios/axios";

const prefix = "users";

export default {
    async fetchUsers(params: UsersParamsType = {}): Promise<UsersType> {
        const { data }: { data: Record<string, any> } = await axios.get(prefix, { params });
        return data.data as UsersType;
    }
};