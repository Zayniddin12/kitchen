<script
    setup
    lang="ts"
>
import { AppNavDrawerItemType, NavDrawerPropsType } from "@/components/layouts/nav/nav-drawer/nav-drawer.types";
import { useRoute } from "vue-router";
import { ref, watchEffect } from "vue";
import NavList from "@/components/layouts/nav/nav-list/NavList.vue";

const props = defineProps<NavDrawerPropsType>();

const appItems = ref<AppNavDrawerItemType[]>([]);

const route = useRoute();

watchEffect(() => {
  appItems.value = props.items ?? [];
});

const navDrawerItemClick = (item: AppNavDrawerItemType) => {
  if (item.to) return;
  item.itemsOpen = !item.itemsOpen;
};

</script>

<template>
  <div class="nav-drawer fixed z-10 h-[calc(100%-32px)] rounded-2xl bg-[#F8F9FC] px-3">
    <RouterLink
        :to="{name: 'home'}"
        class="nav-drawer__logo mx-3 my-4 flex items-center justify-center"
    >
      <img
          src="@/assets/images/logo.svg"
          alt="logo"
          class="size-10"
      >
    </RouterLink>
    <div
        v-for="item in appItems"
        :key="item.title"
        class="nav-drawer__item mt-10 flex flex-col gap-y-2"
    >
      <component
          :is="item.to ? 'RouterLink' :  'button'"
          :to="item.to"
          :class="['nav-drawer__item-link', {'nav-drawer__item-link--active': item.key && route.meta?.uniqueKeys?.[item.key]}]"
          @click="navDrawerItemClick(item)"
      >
        <svg
            v-if="item.icon"
            :data-src="item.icon"
            class="nav-drawer__item-link-icon"
        />
        <span
            v-if="item.title"
            class="nav-drawer__item-link-title"
        >
          {{ item.title }}
        </span>
      </component>
      <NavList
          :title="item.title"
          :items="item.items"
      />
    </div>
  </div>
</template>

<style lang="scss">
.nav-drawer {

  &__item {

    &-link {
      @apply flex flex-col items-center gap-y-1 py-5 px-3 text-center rounded-lg w-[104px] transition duration-200;

      &:hover, &:focus, &--active {
        @apply bg-white shadow-[0_1.5px_4px_-1px_#0A090B12];

        .nav-drawer__item-link-icon * {
          stroke: #000D24;
        }

        .nav-drawer__item-link-title {
          @apply text-dark;
        }
      }

      &-icon {
        @apply size-6;
      }

      &-title {
        @apply text-sm font-medium text-dark-gray;
      }
    }
  }
}
</style>