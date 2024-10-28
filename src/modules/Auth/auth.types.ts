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

interface SendCodeOtpType{
    expires: number;
    code_length: number,
    session_id: string;
}
