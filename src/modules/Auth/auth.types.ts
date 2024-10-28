export interface AuthTokenType {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface AuthLoginDataType {
    username: string,
    password: string,
}

export interface AuthLoginResponseType {
    token: AuthTokenType;
}

export interface AuthCreateDataType extends AuthLoginDataType {
    name: string;
}

