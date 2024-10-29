import {
    AuthCreateDataType,
    AuthLoginDataType,
    AuthLoginResponseType, ForgotPasswordDataType,
    SendCodeDataType,
    UserType, VerifyCodeDataType
} from "@/modules/Auth/auth.types";
import axios from "@/plugins/axios/axios";

const prefix = "auth";

export default {
    async create(data: AuthCreateDataType) {
        const { data: createResponse } = await axios.post("/admin", data);
        return createResponse.data;
    },

    async login(data: AuthLoginDataType): Promise<AuthLoginResponseType> {
        const { data: loginResponse } = await axios.post(`${prefix}/login`, data);
        return loginResponse.data;
    },

    logout() {
        return axios.post(`${prefix}/logout`);
    },

    async me(): Promise<UserType> {
        const { data } = await axios.get(`${prefix}/me`);

        return data.data.user;
    },

    async sendCode(data: SendCodeDataType) {
        const { data: sendCodeData } = await axios.post("/otp/send-code", data);
        return sendCodeData.data;
    },

    verifyCode(data: VerifyCodeDataType) {
        return axios.post(`${prefix}/verify-code`, data);
    },

    forgotPassword(data: ForgotPasswordDataType) {
        return axios.post(`${prefix}/forgot-password`, data);
    }
};