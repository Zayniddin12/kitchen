import cookieStorage from "@/utils/cookieStorage";
import { AuthLoginResponseType } from "@/modules/Auth/auth.types";


const accessTokenKey: string = "access_token";
const refreshTokenKey: string = "refresh_token";

class TokenManager {
  private setToken(key: string, token: string, expires: number): void {
    cookieStorage.setCookie(key, token, {
      path: "/",
      maxAge: expires * 60,
    });
  }

  private getToken(key: string): string | null {
    return cookieStorage.getCookie(key);
  }

  private removeToken(key: string): void {
    cookieStorage.removeCookie(key, "/");
  }

  setAccessToken(accessToken: string, expires: number): void {
    this.setToken(accessTokenKey, accessToken, expires);
  }

  getAccessToken(): string | null {
    return this.getToken(accessTokenKey);
  }

  removeAccessToken(): void {
    this.removeToken(accessTokenKey);
  }

  setRefreshToken(refreshToken: string, expires: number): void {
    this.setToken(refreshTokenKey, refreshToken, expires);
  }

  getRefreshToken(): string | null {
    return this.getToken(refreshTokenKey);
  }

  removeRefreshToken(): void {
    this.removeToken(refreshTokenKey);
  }

  setTokens(tokens: AuthLoginResponseType):void{
    this.setAccessToken(tokens.token.access_token, tokens.token.expires_in);
    this.setRefreshToken(tokens.refresh_token.refresh_token, tokens.refresh_token.expires_in);
  }

  remove():void{
    this.removeAccessToken();
    this.removeRefreshToken();
  }
}

export default new TokenManager();