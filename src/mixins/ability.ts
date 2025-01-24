import { AbilityBuilder, Ability } from "@casl/ability";

export type Actions = "create" | "read" | "update" | "delete" | "payment";
export type Subjects = "Button";

export const defineAbilitiesFor = (roles: string[]) => {
  const { can, cannot, build } = new AbilityBuilder<Ability<[Actions, Subjects]>>(Ability);

  const rolePermissions = {
    hr: {
      can: ["create", "read", "update"],
      cannot: ["delete", "payment"],
    },
    "cashier-llp": {
      can: ["create", "read", "update", "delete", "payment"],
      cannot: [],
    },
    "cashier-sales": {
      can: ["create", "read", "update", "delete", "payment"],
      cannot: [],
    },
    "cashier-sales": {
      can: ["create", "read", "update", "delete", "payment"],
      cannot: [],
    },
    admin: {
      can: ["create", "read", "update", "payment"],
      cannot: ["delete"],
    },
    "super-admin": {
      can: ["create", "read", "update", "delete", "payment"],
      cannot: [],
    },
    "director-foundation": {
      can: ["read"],
      cannot: ["create", "update", "delete", "payment"],
    },
    "deputy-director-foundation": {
      can: ["read"],
      cannot: ["create", "update", "delete", "payment"],
    },
    broker: {
      can: ["create", "read", "update", "payment"],
      cannot: ["delete"],
    },
    "head-management": {
      can: ["read"],
      cannot: ["update", "delete", "payment", "create"],
    },
    "head-factory": {
      can: ["read"],
      cannot: ["update", "delete", "payment", "create"],
    },
    "head-warehouse": {
      can: ["create", "read", "update", "delete", "payment"],
      cannot: [],
    },
    "accountant-base-warehouse": {
      can: ["create", "read"],
      cannot: ["update", "delete", "payment"],
    },
    "manager-base": {
      can: ["create", "read", "update", "delete", "payment"],
      cannot: [],
    },
    "merchandiser": {
      can: ["create", "read", "update", "delete", "payment"],
      cannot: [],
    },
    "freight-forwarder": {
      can: ["create", "read", "update", "delete", "payment"],
      cannot: [],
    },
    "head-chef": {
      can: ["read"],
      cannot: ["create", "update", "delete", "payment"],
    },
    chef: {
      can: ["create", "read", "update", "delete", "payment"],
      cannot: [],
    },
    technologist: {
      can: ["create", "read", "update"],
      cannot: ["delete", "payment"],
    },
    warehouseman: {
      can: ["create", "read", "update", "delete", "payment"],
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
