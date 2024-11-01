<script
    setup
    lang="ts"
>
import { Search } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import Language from "@/components/language/index.vue";
import MemoModal from "@/layout/Create/components/MemoModal.vue";
import ComingModal from "@/layout/Create/components/ComingModal.vue";
import ConsumptionModal from "@/layout/Create/components/ConsumptionModal.vue";
import FreeModal from "@/layout/Create/components/FreeModal.vue";
import MonthlyModal from "@/layout/Create/components/MonthlyModal.vue";
import YearlyModal from "@/layout/Create/components/YearlyModal.vue";
import ThemeToggler from "@/layout/Bars/ThemeToggler.vue";
import { useSettingsStore } from "@/modules/Settings/store";

const editModal = ref<boolean>(false);
const editModal2 = ref<boolean>(false);
const editConsumptionModal = ref<boolean>(false);
const freeModal = ref<boolean>(false);
const monthlyModal = ref<boolean>(false);
const yearlyModal = ref<boolean>(false);
const dropdown = ref<any>(null);
const input1 = ref<string>("");

const settingsStore = useSettingsStore();

const docTypeId = ref<number | null>(null);

const openModal = (id: number) => {
  switch (id) {
    case 1:
      editModal.value = true;
      break;
    case 7:
      editModal2.value = true;
      break;
    case 11:
      editConsumptionModal.value = true;
      break;
    case 3:
      freeModal.value = true;
      break;
    case 4:
      monthlyModal.value = true;
      break;
    case 5:
      yearlyModal.value = true;
  }

  docTypeId.value = id;

  dropdown.value.handleClose();
};

onMounted(() => {
  settingsStore.getDocTypeList();
});

</script>

<template>
  <div class="flex justify-between items-start">
    <div class="relative">
      <div class="relative">
        <el-icon
            class="absolute top-[50%] translate-y-[-50%] left-[19px]"
            color="#8F9194"
        >
          <Search/>
        </el-icon>
        <input
            v-model="input1"
            class="bg-white-blue dark:bg-dark w-[552px] rounded-2xl text-black px-[16px] py-[12px] pl-[50px] outline-none"
            placeholder="Поиск"
        />
      </div>

      <div
          class="bg-[#F8F9FC] text-gray-900 shadow-md border absolute w-full rounded-md mt-[5px]"
          v-if="input1 && input1.length > 0"
      >
        <router-link
            v-for="(index3) in 10"
            :key="index3"
            class="px-4 py-2 block"
            to="#"
        >
          lorem ipsum dolor
        </router-link>
      </div>
    </div>

    <!----------Создать modal---------->
    <div class="flex items-center gap-6">
      <el-dropdown
          trigger="click"
          :hide-on-click="false"
          ref="dropdown"
      >
        <button
            class="flex items-center bg-[#2E90FA] rounded-[8px] border-[1.5px] py-[10px] px-[20px] active:bg-[#175CD3] active:border-[#1849A9] active:border-[1.5px]"
        >
          <img
              src="@/assets/images/icons/plus.svg"
              class="mr-[8px]"
              alt="plus"
          />

          <span class="text-white vertical-mid">Создать</span>
        </button>
        <template #dropdown>
          <el-dropdown-menu class="navbar-dropdown">
            <el-dropdown-item
                class="item-drop"
                v-for="(item, in1) in settingsStore.docTypeList"
                :key="in1"
            >
              <button
                  @click="openModal(item.id)"
                  v-if="!item.childs.length"
                  class="flex items-center justify-between p-[10px] h-[42px] w-full"
              >
                <span class="text-[#4F5662] text-[14px] font-medium mr-[4px]">{{ item.name }}</span>
                <img
                    v-if="in1 !== 0"
                    src="@/assets/arrow-right.svg"
                    alt="arrow icon"
                />
              </button>
              <el-dropdown
                  trigger="click"
                  class="w-full"
                  placement="right-start"
                  popper-class="custom-dropdown"
                  v-else
              >
                <button class="flex items-center justify-between h-[42px] p-[10px] w-full">
                  <span class="text-[#4F5662] text-[14px] font-medium mr-[4px]">{{ item.name }}</span>
                  <img
                      src="@/assets/arrow-right.svg"
                      alt="arrow icon"
                  />
                </button>

                <template #dropdown>
                  <el-dropdown-menu class="navbar-dropdown right-5">
                    <el-dropdown-item
                        class="item-drop"
                        v-for="(child, index) in item.childs"
                        :key="index"
                    >
                      <button
                          @click="openModal(child.id)"
                          class="flex items-center justify-between p-[10px] w-full"
                      >
                        <span class="text-[#4F5662] text-[14px] font-medium mr-12">{{ child.name }}</span>
                        <img
                            src="@/assets/arrow-right.svg"
                            alt="arrow icon"
                        />
                      </button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-dropdown-item>

          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <ThemeToggler v-if="false"/>

      <el-badge
          value="18"
          class="item cursor-pointer"
      >
        <img
            src="@/assets/images/icons/bell.svg"
            alt="bell"
        />
      </el-badge>

      <Language v-if="false"/>

      <div class="flex items-center gap-3">
        <img
            src="@/assets/images/avatar.png"
            class="h-[40px] w-[40px] object-contain rounded-full"
            alt="avatar"
        />
        <div class="flex flex-col">
          <h2 class="m-0 text-[14px] font-medium text-black dark:text-white">
            Мухаммадамин Нурматов
          </h2>
          <span class="text-[#A8AAAE] text-sm">Директор</span>
        </div>
      </div>
    </div>
    <MemoModal
        v-model="editModal"
        :id="docTypeId"
    />
    <ComingModal
        v-model="editModal2"
        :id="docTypeId"
    />
    <ConsumptionModal
        v-model="editConsumptionModal"
        :id="docTypeId"
    />
    <FreeModal
        v-model="freeModal"
        :id="docTypeId"
    />
    <MonthlyModal
        v-model="monthlyModal"
        :id="docTypeId"
    />
    <YearlyModal
        v-model="yearlyModal"
        :id="docTypeId"
    />
    <!----------Создать modal---------->
  </div>
</template>

<style lang="scss">
.navbar-dropdown .el-dropdown-menu__item {
  padding: 0;
}

.navbar-dropdown {
  padding: 12px !important;
  background-color: #F8F9FC !important;
  border-radius: 16px !important;
  border: 1px solid #E2E6F3;
}

.el-scrollbar {
  background-color: transparent !important;
}

.el-popper.is-pure {
  border-radius: 16px;
}

.item-drop:focus {
  background-color: initial !important;

}

.item-drop:hover {
  background-color: #FFFFFF !important;
  border-radius: 8px;
  color: #000D24 !important;
  box-shadow: 0 1.9px 7px -1px #0A090B12;
}

.custom-dropdown {
  transform: translateX(10px);
  margin-left: 10px;
  margin-top: 5px;
}

.el-badge__content.is-fixed {
  background-color: #EA5455;
  font-size: 9px;
  position: absolute;
  right: calc(3px + var(--el-badge-size) / 2);
  top: 1px;
  transform: translateY(-50%) translateX(100%);
}
</style>
