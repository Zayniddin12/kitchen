<script setup lang="ts">
import { defineEmits, defineProps, PropType, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

interface SidebarItem {
  title?: string;
  id?: string;
  icon?: string | number | null;
  route?: string;
  children?: SidebarItem[];
}

const route = useRoute();
const router = useRouter();
const emit = defineEmits<{ (e: string): void; }>();

const props = defineProps({
  childIsOpenPin: {
    type: Boolean,
    default: false,
  },
  children: {
    type: Array as PropType<SidebarItem[]>,
    required: true,
  },
  header: {
    type: String,
    default: "",
  },
});

const currentItem = ref<string>("");

watch(() => route, () => {
  if (route.params.id) {
    currentItem.value = route.params.id as string;
  } else {
    currentItem.value = route.path;
  }
}, { immediate: true });

const activeChildMenu = (item: SidebarItem) => {
  currentItem.value = item.id || item.route || "";
  if (item.route) {
    router.push(item.route);
  }
  emit("closeSidebar");
};
</script>

<template>
  <div @click.stop>
    <header class="flex items-center justify-between pt-[16px] pb-[32px] px-[24px]">
      <h1 class="text-[#000000] font-medium text-[20px] dark:text-white">{{ header }}</h1>

      <div class="flex items-center cursor-pointer" :class="{ activePin: childIsOpenPin }">

        <li @click.stop="emit('toggleSidebarPin')"
            :style="{
                  maskImage: 'url(/icons/pin.svg)',
                  backgroundColor: '#8F9194',
                  color: '#8F9194',
                  width: '24px',
                  height: '24px',
                  maskSize: '24px',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                   }"
        />
        <img src="@/assets/images/close.svg" class="ml-[15px]" alt="close" @click.stop="emit('closeSidebar', 'close')" />
      </div>
    </header>

    <el-collapse
      v-for="(item, index) in children"
      :key="index"
      accordion
      class="border-0 px-3"
    >
      <el-collapse-item
        v-if="item.children"
        :title="item.title"
        :name="index + 1"
        class="element-collapse"
      >
        <template #title>
          <div class="flex items-center px-3">
            <svg :data-src="'/sidebar/' + item.icon + '.svg'" class="svg-class shrink-1 mr-[12px]" width="24px"
                 height="24px" />
            <span class="dark:text-white">{{ item.title }}</span>
          </div>
        </template>
        <template #icon="{ isActive }">
          <img v-if="item.children && item.children.length"
               src="@/assets/images/arrowUp.svg"
               :class="!isActive ? 'rotate-180' : ''"
               class="transition-all"
               alt="arrow"
          />
          <div v-else />
        </template>

        <div v-for="(sub, index2) in item.children"
             :key="index2"
             class="ml-[36px] text-left py-[10px] px-[12px] text-dark text-[14px] font-medium cursor-pointer dark:text-white"
             :class="{ activeMenu: currentItem == sub.route }"
             @click.stop="activeChildMenu(sub)"
        >
          {{ sub.title }}
        </div>
      </el-collapse-item>

      <div v-else
           class="text-dark-gray text-[14px] text-left py-[10px] font-medium cursor-pointer px-[12px]"
           :class="{ activeMenu: currentItem == item.route ? true : currentItem == item.id }"
           @click.stop="activeChildMenu(item)"
      >
        <div class="flex items-center">
          <svg :data-src="'/sidebar/' + item.icon + '.svg'" class="svg-class shrink-1 mr-[12px]" width="24px" height="24px" />
          <span class="dark:text-white">{{ item?.title }}</span>
        </div>
      </div>
    </el-collapse>
  </div>
</template>

<style lang="scss">
.element-collapse {
  .el-collapse-item__header {
    color: #4f5662;
    font-size: 14px !important;
    font-weight: 500;
    background-color: transparent;
    border-bottom: 0;
    width: 100%;
    align-content: center;
    justify-content: space-between;
  }

  .el-collapse-item__wrap {
    border-bottom: none;
    background-color: transparent;
  }
}

.activeMenu {
  @apply bg-[#ffffff] dark:bg-body-dark rounded-[8px] shadow-menu;
}

.dark .svg-class path {
  stroke: #fff;
}

.activePin li {
  transform: rotate(-45deg);
  color: #000d24 !important;
  background-color: #000d24 !important;
}
</style>
