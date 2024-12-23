export interface AuthTokenStructureType{
    expires_in: number;
}

export interface AuthTokenType extends AuthTokenStructureType {
    access_token: string;
    token_type: "bearer";
}

export interface AuthRefreshTokenType extends AuthTokenStructureType {
    refresh_token: string;
    token_type: "refresh";
}

export interface AuthLoginDataType {
    phone: string,
    password: string,
}

export interface AuthLoginResponseType {
    token: AuthTokenType;
    refresh_token: AuthRefreshTokenType;
}

export interface AuthCreateDataType extends AuthLoginDataType {
    name: string;
}

export type PositionType = string | null;

export interface UserWorkplaceType {
    position: PositionType;
    workplace: string;
    workplace_id: number;
    workplace_type: string;
}

export interface UserType {
    id: number;
    phone: string;
    image: null | string;
    firstname: string;
    lastname: string;
    patronymic: string;
    role_id: number;
    role_name: string;
    role_title: string;
    position: PositionType;
    position_id: number;
    organization_id: number;
    organization_name: string;
    workplaces: UserWorkplaceType[];
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
    date: Date;
    code?: string;
}

export interface VerifyCodeDataType {
    phone: string;
    code: string;
    otp_session_id: string;
}

export interface ForgotPasswordDataType extends VerifyCodeDataType {
    new_password: string;
    password_confirmation: string;
}

export type CodeType = string;

export interface UpdateUserDataType {
    phone: string;
    avatar?: File | null,
}

export interface UpdatePasswordDataType {
    old_password: string;
    new_password: string;
}