import { defineStore } from "pinia";
import { ref, onMounted, onUnmounted, computed } from "vue";
import {
    AuthCreateDataType,
    AuthLoginDataType, ForgotPasswordDataType,
    SendCodeDataType,
    SendCodeOtpType,
    UserType, VerifyCodeDataType
} from "@/modules/Auth/auth.types";
import authApi from "@/modules/Auth/auth.api";
import { removeAccessToken, setAccessToken } from "@/utils/token.manager";
import { useRouter } from "vue-router";
import { useCommonStore } from "@/stores/common.store";
import { getSessionItem, removeSessionItem, setSessionItem } from "@/utils/sessionStorage";

export const useAuthStore = defineStore("authStore", () => {
    const router = useRouter();
    const commonStore = useCommonStore();

    const isAuth = ref(false);

    const createLoading = ref(false);

    const create = async (data: AuthCreateDataType) => {
        createLoading.value = true;
        await authApi.create(data).finally(() => createLoading.value = false);
    };

    const loginLoading = ref(false);

    const login = async (data: AuthLoginDataType) => {
        loginLoading.value = true;

        try {
            const response = await authApi.login(data);
            setAccessToken(response.token.access_token);
            isAuth.value = true;
        } finally {
            loginLoading.value = false;
        }
    };

    const userLoading = ref(false);
    const user = ref<null | UserType>(null);

    const userFullName = computed(() => {
        if (!user.value) return "";

        const { firstname, lastname } = user.value;

        if (!firstname) return lastname || "";
        if (!lastname) return firstname;

        return `${firstname} ${lastname}`;
    });


    const me = async () => {
        isAuth.value = true;
        userLoading.value = true;

        await authApi.me()
            .then(response => {
                user.value = response;
            })
            .finally(() => {
                userLoading.value = false;
            });
    };

    const clear = async () => {
        user.value = null;
        removeAccessToken();
        isAuth.value = false;
        await router.push({ name: "login" });
    };

    const logout = async () => {
        userLoading.value = true;
        await authApi.logout()
            .then(async () => {
                await clear();
                commonStore.successToast();
            })
            .finally(() => {
                userLoading.value = false;
            });
    };

    const codeLoading = ref(false);
    const otp = ref<SendCodeOtpType | null>(null);
    const otpKey = "otp";

    const setOtp = (new_otp: SendCodeOtpType) => {
        otp.value = {
            phone: new_otp.phone,
            session_id: new_otp.session_id,
            expires: new_otp.expires,
            code_length: new_otp.code_length,
            date: new Date()
        };

        if (new_otp.code) otp.value.code = new_otp.code;

        setSessionItem(otpKey, JSON.stringify(otp.value));
        startRemainingTimeInterval();
    };

    const getSessionOtp = () => {
        const sessionOtp = getSessionItem(otpKey);
        if (!sessionOtp) return;

        otp.value = JSON.parse(sessionOtp, (key, value) => {
            return key === "date" ? new Date(value) : value;
        });
        startRemainingTimeInterval();
    };

    const clearSessionOtp = () => {
        otp.value = null;
        remainingTime.value = 0;
        removeSessionItem(otpKey);
        stopRemainingTimeInterval();
    };

    const sendCode = async (data: SendCodeDataType) => {
        data.reason = "forgot_password";
        codeLoading.value = true;

        try {
            const response = await authApi.sendCode(data);
            const { otp: responseOtp }: { otp: SendCodeOtpType } = response;
            setOtp({
                ...responseOtp,
                phone: data.phone
            });
        } finally {
            codeLoading.value = false;
        }
    };

    const remainingTime = ref(0);
    let intervalId: NodeJS.Timeout | number | null = null;

    const updateRemainingTime = () => {
        if (!otp.value) {
            remainingTime.value = 0;
            return;
        }

        const currentTime = Date.now();
        const expiryTime = new Date(otp.value.date).getTime() + otp.value.expires * 1000;
        const timeLeft = expiryTime - currentTime;

        remainingTime.value = Math.max(0, Math.floor(timeLeft / 1000));
    };

    const startRemainingTimeInterval = () => {
        if (intervalId === null) {
            updateRemainingTime();
            intervalId = setInterval(() => {
                updateRemainingTime();
            }, 1000);
        }
    };

    const stopRemainingTimeInterval = () => {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    const verifyCode = async (data: VerifyCodeDataType) => {
        codeLoading.value = true;

        try {
            await authApi.verifyCode(data);
            if (otp.value) setOtp({ ...otp.value, code: data.code });
        } finally {
            codeLoading.value = false;
        }
    };

    const forgotPassword = async (data: ForgotPasswordDataType) => {
        codeLoading.value = true;

        try {
            await authApi.forgotPassword(data);
        } finally {
            codeLoading.value = false;
        }
    };

    return {
        createLoading,
        create,
        loginLoading,
        login,
        userLoading,
        user,
        me,
        clear,
        logout,
        codeLoading,
        sendCode,
        otp,
        getSessionOtp,
        remainingTime,
        updateRemainingTime,
        clearSessionOtp,
        stopRemainingTimeInterval,
        verifyCode,
        forgotPassword,
        isAuth,
        userFullName
    };
});
