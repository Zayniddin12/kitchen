<script
    setup
    lang="ts"
>
import {
  AppNavDrawerItemType,
  NavDrawerItemType,
  NavDrawerPropsType
} from "@/components/layouts/nav/nav-drawer/nav-drawer.types";
import { useRoute } from "vue-router";
import { computed, ref, useTemplateRef, watch, watchEffect } from "vue";
import NavList from "@/components/layouts/nav/nav-list/NavList.vue";

const props = defineProps<NavDrawerPropsType>();

const emit = defineEmits<{
  changeWidth: [value: number]
}>();

const route = useRoute();

const appItems = ref<NavDrawerItemType[]>([]);

const navDrawerItemClick = (item: NavDrawerItemType) => {
  if (item.to) return;
  item.itemsOpen = !item.itemsOpen;
  console.log(item.itemsOpen);
};

const navDrawer = useTemplateRef<HTMLDivElement>("nav-drawer");

const navDrawerWidth = computed<number>(() => {
  if (!navDrawer.value) return 0;
  return (navDrawer.value.offsetWidth as number) + 24;
});

const navListWidth = ref<number>(0);

const navDrawerContentWidth = computed<number>(() => navListWidth.value + navDrawerWidth.value);

watch(navDrawerContentWidth, (newWidth) => {
  emit("changeWidth", newWidth);
});

watch(() => props.items, (newItems) => {
  if (newItems) {
    appItems.value = newItems.map(el => {
      el.itemsOpen = false;
      return el;
    });
  }
}, { immediate: true });

</script>

<template>
  <div
      ref="nav-drawer"
      class="nav-drawer nav-wrap px-3 ml-4"
  >
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
    <div class="nav-drawer__items mt-10 flex flex-col gap-y-2">
      <div
          v-for="item in appItems"
          :key="item.title"
          class="nav-drawer__item"
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
              v-if="item.items"
              ref="nav-list"
              v-model="item.itemsOpen"
              :title="item.title"
              :items="item.items"
              class="nav-wrap"
              :style="{left: `${navDrawerWidth}px`}"
              @changeWidth="(value:number) => navListWidth=value"
          />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.nav-wrap {
  @apply fixed z-10 h-[calc(100%-32px)] rounded-2xl bg-[#F8F9FC] top-0 my-4;
}

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