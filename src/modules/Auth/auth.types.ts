export interface AuthTokenType {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface AuthLoginDataType {
    phone: string,
    password: string,
}

export interface AuthLoginResponseType {
    token: AuthTokenType;
}

export interface AuthCreateDataType extends AuthLoginDataType {
    name: string;
}

export interface UserType {
    id: number;
    phone: string;
}

export interface SendCodeDataType {
    phone: string;
    reason?: "forgot_password";
}

export interface SendCodeOtpType {
    phone: string;
    expires: number;
    code_length: number,
    session_id: string;
    date: Date,
    code?: string
}

export interface VerifyCodeDataType {
    phone: string;
    code: string,
    otp_session_id: string,
}

export interface ForgotPasswordDataType extends VerifyCodeDataType {
    new_password: string,
    password_confirmation: string
}