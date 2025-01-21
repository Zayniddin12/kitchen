import { AbilityBuilder, Ability } from "@casl/ability";
import { useAuthStore } from "@/modules/Auth/auth.store";


const authStore = useAuthStore();
export type Actions = "view" | "add" | "edit";
export type Subjects = "Button";

export const defineAbilitiesFor = (roles: string[], currentPage: any) => {

  const { can, cannot, build } = new AbilityBuilder<Ability<[Actions, Subjects]>>(Ability);

  const rolePermissions = {
    super_admin: {
      can: ["add", "edit", "view", "delete", "payment", "connect", "xls"],
      cannot: [],
    },

  };

  // if (userData && userData.is_superuser) {
  //   can("manage", "all");
  //   return build();
  // }

  roles?.forEach((role) => {
    const permissions = rolePermissions[role];

    if (permissions) {
      permissions.can.forEach((action) => can(action, "Button"));
      permissions.cannot.forEach((action) => cannot(action, "Button"));
    }

    if (role == 'dormitory_manager' && currentPage == 'residents') {
      can("edit", "Button");
      can("add", "Button");
      can("view", "Button");
    }
  });

  return build();
};
