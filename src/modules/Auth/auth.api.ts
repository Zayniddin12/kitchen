import { AuthCreateDataType, AuthLoginDataType, AuthLoginResponseType } from "@/modules/Auth/auth.types";
import axios from "@/plugins/axios";

export default {
    async create(data: AuthCreateDataType) {
        const { data: createResponse } = await axios.post("/admin", data);
        return createResponse.data;
    },

    async login(data: AuthLoginDataType): Promise<AuthLoginResponseType> {
        const { data: loginResponse } = await axios.post("/auth/login", data);
        return loginResponse.data;
    }
};