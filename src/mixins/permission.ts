export const check = (role: string[] | string) => {
  const roles = [JSON.parse(localStorage.getItem("user_role"))];
  // const userData = getUserData();

  // if (userData && userData.is_superuser) return true;
  if (roles?.includes("super-admin")) return true;
  if (role && role.length) {
    return role.some((item) => roles?.includes(item));
  }

  return roles?.includes(role);
};
