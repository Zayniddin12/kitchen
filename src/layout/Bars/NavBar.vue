<script
  setup
  lang="ts"
>
import { onMounted, ref } from "vue";
import Language from "@/components/language/index.vue";
import MemoModal from "@/layout/Create/components/MemoModal.vue";
import ComingModal from "@/layout/Create/components/ComingModal.vue";
import KitchenModal from "@/layout/Create/components/KitchenModal.vue";
import FreeModal from "@/layout/Create/components/FreeModal.vue";
import MonthlyModal from "@/layout/Create/components/MonthlyModal.vue";
import WorkshopAndPantryModal from "@/layout/Create/components/WorkshopAndPantryModal.vue";
import ThemeToggler from "@/layout/Bars/ThemeToggler.vue";
import { useSettingsStore } from "@/modules/Settings/store";
import { DocTypeListType } from "@/modules/Settings/settings.types";
import HeaderUser from "@/components/layouts/header-user/HeaderUser.vue";
import { useI18n } from "vue-i18n";
import { check } from "@/mixins/permission";

const { t } = useI18n();
const settingsStore = useSettingsStore();

const editModal = ref<boolean>(false);
const editModal2 = ref<boolean>(false);
const workshopAndPantryModal = ref<boolean>(false);
const kitchenModal = ref<boolean>(false);
const freeModal = ref<boolean>(false);
const monthlyModal = ref<boolean>(false);
const dropdown = ref<any>(null);
const input1 = ref<string>("");
const docTypeId = ref<number | null>(null);
const docTypeName = ref<string>("");
const docTypeTitle = ref<string>("");

const openModal = (item: DocTypeListType) => {
  alert(item.id)
  switch (item.id) {
    case 1:
      editModal.value = true;
      docTypeTitle.value = t("document.memo.create");
      break;
    case 7:
    case 11:
      editModal2.value = true;
      break;
    // case 11:
    // editConsumptionModal.value = true;
    // break;
    case 14:
      kitchenModal.value = true;
      break;
    case 15:
    case 16:
    case 17:
    case 18:
      workshopAndPantryModal.value = true;
      break;
    case 3:
      freeModal.value = true;
      docTypeTitle.value = t("document.freeRequest.create");
      break;
    case 4:
      monthlyModal.value = true;
      docTypeTitle.value = t("document.monthlyRequest.create");
      break;
    case 5:
      monthlyModal.value = true;
      docTypeTitle.value = t("document.annualRequest.create");
      break;
  }

  docTypeId.value = item.id;
  docTypeName.value = item.name;

  dropdown.value.handleClose();
};

onMounted(async () => {
  await settingsStore.getDocTypeList();
});
</script>

<template>
  <div class="flex justify-between items-start">
    <div class="relative">
      <div class="text-gray-900 font-semibold text-[25px] leading-[48px]">ФОНД НГМК</div>
      <div
        class="bg-[#F8F9FC] text-gray-900 shadow-md border absolute w-full rounded-md mt-[5px]"
        v-if="input1 && input1.length > 0"
      >
        <router-link
          v-for="index3 in 10"
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

      <!--        v-if="check()"-->
      <el-dropdown
        v-if="$can('payment', 'Button')"
        trigger="click"
        :hide-on-click="false"
        ref="dropdown"
      >
        <ElButton
          :loading="settingsStore.docTypeListLoading"
          type="primary"
          size="large"
          class="flex items-center bg-[#2E90FA] rounded-[8px] border-[1.5px] py-[10px] px-[20px] active:bg-[#175CD3] active:border-[#1849A9] active:border-[1.5px] h-[46px]"
        >
          <img
            src="@/assets/images/icons/plus.svg"
            class="mr-[8px]"
            alt="plus"
          />

          <span class="text-white vertical-mid">
            {{ t("form.create") }}
          </span>
        </ElButton>
        <template
          #dropdown
          v-if="settingsStore.docTypeList.length"
        >
          <el-dropdown-menu class="navbar-dropdown">
            <el-dropdown-item
              class="item-drop"
              v-for="(item, in1) in settingsStore.docTypeList"
              :key="in1"
            >
              <button
                @click="openModal(item)"
                v-if="!item.childs.length"
                class="flex items-center justify-between p-[10px] h-[42px] w-full"
              >
                <span class="text-[#4F5662] text-[14px] font-medium mr-[4px]">
                  {{ item.name }}
                </span>
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
                <button
                  class="flex items-center justify-between h-[42px] p-[10px] w-full"
                >
                  <span class="text-[#4F5662] text-[14px] font-medium mr-[4px]">
                    {{ item.name }}
                  </span>
                  <img
                    src="@/assets/arrow-right.svg"
                    alt="arrow icon"
                  />
                </button>

                <template #dropdown>
                  <el-dropdown-menu class="navbar-dropdown right-5" @click="() => dropdown.handleOpen()">
                    <el-dropdown-item
                      class="item-drop"
                      v-for="(child, index) in item.childs"
                      :key="index"
                    >
                      <button
                        @click="openModal(child)"
                        class="flex items-center justify-between p-[10px] w-full"
                      >
                        <span
                          class="text-[#4F5662] text-[14px] font-medium mr-12"
                        >
                          {{ child.name }}
                        </span>
                        <!--                        <img-->
                        <!--                          src="@/assets/arrow-right.svg"-->
                        <!--                          alt="arrow icon"-->
                        <!--                        />-->
                      </button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <ThemeToggler v-if="false" />

      <!--      <Notifications />-->

      <Language v-if="false" />

      <HeaderUser />
    </div>
    <MemoModal
      v-model="editModal"
      :id="docTypeId"
      :name="docTypeName"
      :title="docTypeTitle"
    />
    <ComingModal
      v-model="editModal2"
      :id="docTypeId"
      :name="docTypeName"
    />
    <WorkshopAndPantryModal
      v-model="workshopAndPantryModal"
      :id="docTypeId"
      :name="docTypeName"
    />
    <kitchenModal
      v-model="kitchenModal"
      :id="docTypeId"
      :name="docTypeName"
    />
    <FreeModal
      v-model="freeModal"
      :id="docTypeId"
      :name="docTypeName"
      :title="docTypeTitle"
    />
    <MonthlyModal
      v-model="monthlyModal"
      :id="docTypeId"
      :name="docTypeName"
      :title="docTypeTitle"
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
  background-color: #f8f9fc !important;
  border-radius: 16px !important;
  border: 1px solid #e2e6f3;
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
  background-color: #ffffff !important;
  border-radius: 8px;
  color: #000d24 !important;
  box-shadow: 0 1.9px 7px -1px #0a090b12;
}

.custom-dropdown {
  transform: translateX(10px);
  margin-left: 10px;
  margin-top: 5px;
}

.el-badge__content.is-fixed {
  background-color: #ea5455;
  font-size: 9px;
  position: absolute;
  right: calc(3px + var(--el-badge-size) / 2);
  top: 1px;
  transform: translateY(-50%) translateX(100%);
}
</style>
