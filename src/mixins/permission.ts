import { getUserData } from "@/auth/jwtService";

export const check = (role: string[] | string) => {
  const roles = getUserData()?.roles?.map((val) => val.unique_name)
  const userData = getUserData();

  if (userData && userData.is_superuser) return true;
  if (roles?.includes("super_admin") || roles?.includes("fund_admin")) return true;
  if (role && role.length) {
    return role.some((item) => roles?.includes(item));
  }

  return roles?.includes(role);
};