<script
  setup
  lang="ts"
>

import { RouteLocationRaw, useRoute } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { computed, onMounted, watch } from "vue";
import ProfileIcon from "@/assets/images/icons/profile.svg";
import KeyIcon from "@/assets/images/icons/key.svg";
import { useAuthStore } from "@/modules/Auth/auth.store";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";

const route = useRoute();

const authStore = useAuthStore();

const { setBreadCrumb } = useBreadcrumb();

const routeTitle = computed(() => route.meta.title ?? "");

const setBreadCrumbFn = () => {
  setBreadCrumb([{
    label: "Настройки",
  }, {
    label: routeTitle.value,
    isActionable: true,
  }]);
};

interface NavigationLinkType {
  to: RouteLocationRaw;
  uniqueKey: string;
  title: string,
  icon: string,
}

const navigationLinks = computed<NavigationLinkType[]>(() => {
  return [{
    to: { name: "profile-settings-profile" },
    uniqueKey: "settingsProfileProfile",
    title: "Мой профиль",
    icon: ProfileIcon,
  }, {
    to: { name: "profile-settings-password" },
    uniqueKey: "settingsProfilePassword",
    title: "Пароль",
    icon: KeyIcon,
  }];
});

const navigationLinkIsActive = (key: string): boolean => {
  return !!route.meta.uniqueKeys?.[key];
};

onMounted(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <section class="profile-settings">
    <h1 class="text-dark font-semibold text-[32px]">
      {{ routeTitle }}
    </h1>
    <div class="flex items-start gap-x-6 mt-6">
      <div class="sticky pr-6 pb-6 border-r border-[#EEEEEF] flex flex-col gap-y-1 min-h-[68vh] w-[285px]">
        <RouterLink
          v-for="link in navigationLinks"
          :key="link.uniqueKey"
          :to="link.to"
          :class="['profile-settings__navigation-link', {'profile-settings__navigation-link--active': navigationLinkIsActive(link.uniqueKey)}]"
        >
          <svg
            :data-src="link.icon"
            class="profile-settings__navigation-link__icon"
          />
          <span class="profile-settings__navigation-link__title">
            {{ link.title }}
          </span>
        </RouterLink>
      </div>
      <div class="w-[calc(100%-309px)]">
        <RouterView v-show="!authStore.userLoading" />
        <AppOverlay
          v-if="authStore.userLoading"
          loading
          class="w-full min-h-[40vh] "
          :rounded="16"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.profile-settings {
  &__navigation-link {
    @apply w-full flex items-center gap-x-3 rounded-lg text-sm text-dark-gray font-medium py-2.5 px-3 duration-300 transition-all ease-linear;

    &__icon {
      @apply size-5 duration-200 transition-all ease-linear;
    }

    &:hover, &--active {
      @apply bg-[#F8F9FC] text-dark;

      & > .profile-settings__navigation-link__icon * {
        stroke: #000D24;
      }
    }
  }
}
</style>