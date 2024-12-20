import {
  AuthCreateDataType,
  AuthLoginDataType,
  AuthLoginResponseType, CodeType, ForgotPasswordDataType,
  SendCodeDataType,
  UserType, VerifyCodeDataType,
} from "@/modules/Auth/auth.types";
import axios from "@/plugins/axios/axios";
import tokenManager from "@/utils/token.manager";

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

  async refresh(): Promise<AuthLoginResponseType | null> {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) return Promise.reject(null);

    const { data } = await axios.get(`${prefix}/refresh`, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return data.data;
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
  },

  async loginOneId(code: CodeType): Promise<AuthLoginResponseType> {
    const { data } = await axios.post(`${prefix}/login-via-oneid`, { code });
    return data.data;
  },

};