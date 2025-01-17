import { RouteRecordRaw } from "vue-router";

export default [
  {
    path: "/profile-settings",
    name: "profile-settings",
    component: () => import("@/modules/Settings/pages/ProfileSettings/modules/ProfileSettingsIndex.vue"),
    redirect: { name: "profile-settings-profile" },
    meta: {
      title: "settings.profile",
      isTranslate: true,
      uniqueKeys: {
        settings: true,
        settingsProfile: true,
      },
    },
    children: [
      {
        path: "profile",
        name: "profile-settings-profile",
        component: () => import("@/modules/Settings/pages/ProfileSettings/modules/pages/profile/ProfileIndex.vue"),
        meta: {
          childTitle: "common.myProfile",
          childIsTranslate: true,
          uniqueKeys: {
            settings: true,
            settingsProfile: true,
            settingsProfileProfile: true,
          },
        },
      },
      {
        path: "profile-edit",
        name: "profile-settings-profile-edit",
        component: () => import("@/modules/Settings/pages/ProfileSettings/modules/pages/profile/ProfileEdit.vue"),
        meta: {
          childTitle: "common.myProfile",
          childIsTranslate: true,
          uniqueKeys: {
            settings: true,
            settingsProfile: true,
            settingsProfileProfile: true,
          },
        },
      },
      {
        path: "password",
        name: "profile-settings-password",
        component: () => import("@/modules/Settings/pages/ProfileSettings/modules/pages/Password.vue"),
        meta: {
          childTitle: "common.password",
          childIsTranslate: true,
          uniqueKeys: {
            settings: true,
            settingsProfile: true,
            settingsProfilePassword: true,
          },
        },
      },
    ],
  },
] as RouteRecordRaw[];