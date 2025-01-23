import { AbilityBuilder, Ability } from "@casl/ability";

export type Actions = "view" | "add" | "edit";
export type Subjects = "Button";

export const defineAbilitiesFor = (roles: string[]) => {
  console.log(roles, "roles111");
  const { can, cannot, build } = new AbilityBuilder<Ability<[Actions, Subjects]>>(Ability);

  const rolePermissions = {
    fund_head_director: {
      can: ["view"],
      cannot: ["payment", "xls"],
    },
    fund_director_deputy: {
      can: ["view"],
      cannot: ["payment", "xls"],
    },
    reg_management_head: {
      can: ["view"],
      cannot: ["payment", "xls"],
    },
    dormitory_manager: {
      can: ["add", "view"],
      cannot: ["delete", "edit", "payment", "xls"],
    },
    dormitory_caretaker: {
      can: ["add", "edit", "view"],
      cannot: ["delete", "payment", "xls"],
    },
    dormitory_cashier: {
      can: ["add", "edit", "view", "payment"],
      cannot: ["xls"],
    },
    super_admin: {
      can: ["add", "edit", "view", "delete", "payment", "connect", "xls"],
      cannot: [],
    },
    fund_admin: {
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
  });

  return build();
};
