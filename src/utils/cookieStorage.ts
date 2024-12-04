interface CookieOptions {
  maxAge?: number;
  expires?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

class CookiesStorage {
  setCookie(key: string, value: string, options: CookieOptions = {}): void {
    let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.expires) {
      const expiresDate = new Date();
      expiresDate.setTime(expiresDate.getTime() + options.expires * 1000);
      cookieString += `; expires=${expiresDate.toUTCString()}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += "; secure";
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  }

  getCookie(key: string): string | null {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split("=");
      if (decodeURIComponent(cookieKey) === key) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  removeCookie(key: string, path: string = "/"): void {
    this.setCookie(key, "", { maxAge: -1, path });
  }
}

export default new CookiesStorage();
