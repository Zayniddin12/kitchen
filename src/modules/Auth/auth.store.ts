import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
	AuthCreateDataType, AuthLoginDataType, CodeType, ForgotPasswordDataType, SendCodeDataType, SendCodeOtpType,
	UpdatePasswordDataType, UpdateUserDataType, UserType, UserWorkplaceType, VerifyCodeDataType,
} from "@/modules/Auth/auth.types";
import authApi from "@/modules/Auth/auth.api";
import tokenManager from "@/utils/token.manager";
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
			tokenManager.setTokens(response);
			isAuth.value = true;
		} finally {
			loginLoading.value = false;
		}
	};

	const refresh = async () => {
		try {
			const response = await authApi.refresh();
			if(!response) return;

			tokenManager.setTokens(response);
		} catch (error: any) {
			tokenManager.remove();
		}
	};

	const userLoading = ref(false);
	const user = ref<null | UserType>(null);

	const userFullName = computed(() => {
		if(!user.value) return "";

		const {
			firstname,
			lastname,
		} = user.value;

		if(!firstname) return lastname || "";
		if(!lastname) return firstname;

		return `${firstname} ${lastname}`;
	});

	const disabledUserWorkplace = computed<boolean>(() => {
		return user.value?.workplaces.length === 1;
	});

	const getUserWorkplace = (id: number, type: string): null | UserWorkplaceType => {
		if(!user.value?.workplaces.length) return null;

		return user.value.workplaces.find(el => el.workplace_id === id && el.workplace_type === type) ?? null;
	};


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
		tokenManager.remove();
		isAuth.value = false;
		await router.push({ name: "login" });
	};

	const logout = async () => {
		userLoading.value = true;
		try {
			await authApi.logout();
			await clear();
			commonStore.successToast();
		} finally {
			userLoading.value = false;
		}
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
			date: new Date(),
		};

		if(new_otp.code) otp.value.code = new_otp.code;

		setSessionItem(otpKey, JSON.stringify(otp.value));
		startRemainingTimeInterval();
	};

	const getSessionOtp = () => {
		const sessionOtp = getSessionItem(otpKey);
		if(!sessionOtp) return;

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
				phone: data.phone,
			});
		} finally {
			codeLoading.value = false;
		}
	};

	const remainingTime = ref(0);
	let intervalId: NodeJS.Timeout | number | null = null;

	const updateRemainingTime = () => {
		if(!otp.value) {
			remainingTime.value = 0;
			return;
		}

		const currentTime = Date.now();
		const expiryTime = new Date(otp.value.date).getTime() + otp.value.expires * 1000;
		const timeLeft = expiryTime - currentTime;

		remainingTime.value = Math.max(0, Math.floor(timeLeft / 1000));
		if(remainingTime.value <= 0) {
			clearSessionOtp();
		}
	};

	const startRemainingTimeInterval = () => {
		if(intervalId === null) {
			updateRemainingTime();
			intervalId = setInterval(() => {
				updateRemainingTime();
			}, 1000);
		}
	};

	const stopRemainingTimeInterval = () => {
		if(intervalId !== null) {
			clearInterval(intervalId);
			intervalId = null;
		}
	};

	const verifyCode = async (data: VerifyCodeDataType) => {
		codeLoading.value = true;

		try {
			await authApi.verifyCode(data);
			if(otp.value) setOtp({
				...otp.value,
				code: data.code,
			});
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

	const oneIdLoading = ref(false);

	const loginOneId = async (code: CodeType) => {
		oneIdLoading.value = true;

		try {
			const response = await authApi.loginOneId(code);
			tokenManager.setTokens(response);
			isAuth.value = true;
		} finally {
			oneIdLoading.value = false;
		}
	};

	const updateUserLoading = ref(false);

	const updateUser = async (data: UpdateUserDataType) => {
		updateUserLoading.value = true;

		try {
			await authApi.updateUser(data);
		} finally {
			updateUserLoading.value = false;
		}
	};

	const updatePasswordLoading = ref(false);

	const updatePassword = async (data: UpdatePasswordDataType) => {
		updatePasswordLoading.value = true;

		try {
			await authApi.updatePassword(data);
		} finally {
			updatePasswordLoading.value = false;
		}
	};

	return {
		createLoading,
		create,
		loginLoading,
		login,
		refresh,
		userLoading,
		user,
		disabledUserWorkplace,
		getUserWorkplace,
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
		userFullName,
		oneIdLoading,
		loginOneId,
		updateUserLoading,
		updateUser,
		updatePasswordLoading,
		updatePassword,
	};
});
