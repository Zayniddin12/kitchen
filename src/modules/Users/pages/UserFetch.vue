<script
  setup
  lang="ts"
>
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import AppDatePicker from "@/components/ui/form/app-date-picker/AppDatePicker.vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import { useUsersStore } from "@/modules/Users/users.store";
import { SearchUserDataType } from "@/modules/Users/users.types";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import { useCommonStore } from "@/stores/common.store";
import { filterObjectValues } from "@/utils/helper";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";

enum TABS {
  PASSPORT = 1,
  PINFL
}

interface TabType {
  title: string;
  icon: string;
  value: 1 | 2;
}

const router = useRouter();
const route = useRoute();

const defaultTab = TABS.PASSPORT;

const tabs = ref<TabType[]>([
  {
    title: "Серия и номер паспорта",
    icon: "seria",
    value: TABS.PASSPORT,
  },
  {
    title: "ПИНФЛ",
    icon: "pinFl",
    value: TABS.PINFL,
  },
]);

const validTabs = tabs.value.map(tab => tab.value);

const validRouteTab = (tab: string | null): TABS => {
  const newTab = Number(tab);
  return validTabs.includes(newTab as TABS) ? (newTab as TABS) : defaultTab;
};

const activeTab = computed(() => validRouteTab(route.query.tab as string | null));

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Кадры",
    },
    {
      label: String(route.meta?.parentRouteTitle ?? ""),
      to: route.meta?.parentRouteUrl,
    },
    {
      label: "Добавить",
      isActionable: true,
    },
  ]);
};

const userStore = useUsersStore();
const commonStore = useCommonStore();

const form = reactive<SearchUserDataType>({
  pinfl: "",
  pass_number: "",
  birthday: "",
});

const v$ = ref<ValidationType | null>(null);

const validationErrors = ref<Record<string, any> | null>(null);

const fetchSearchUser = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    commonStore.errorToast("Validation Error");
    return;
  }

  const newForm: SearchUserDataType = {
    birthday: form.birthday,
  };

  if (activeTab.value === TABS.PINFL) {
    newForm.pinfl = form.pinfl;
  } else {
    newForm.pass_number = form.pass_number?.replace(/\s+/g, "");
  }

  try {
    await userStore.fetchSearchUser(userStore.activeUserPage ? "users" : "employee", filterObjectValues(newForm));
    validationErrors.value = null;
    router.push({ name: `${userStore.activeRoutePrefix}-create` });
  } catch (error: any) {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
};

const minAge = computed(() => {
  const now = new Date();
  return new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
});

const disabledDate = (time: Date) => {
  return time > minAge.value;
};

onMounted(() => {
  setBreadCrumbFn();
});

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">{{ route.meta?.title }}</h1>
    <div class="flex items-center justify-center min-h-[60vh]">
      <div>
        <div class="app-tabs w-full">
          <RouterLink
            v-for="item in tabs"
            :key="item.value"
            :class="['app-tab flex items-center gap-x-2', {'app-tab--active': activeTab === item.value}]"
            :to="{query: {...route.query, tab: item.value}}"
          >
            <svg
              :data-src="'/sidebar/' + item.icon + '.svg'"
              class="size-5 tab-icon tab-icon--"
              :class="['size-5', {'tab-icon--no-active': activeTab !== item.value}]"
            />
            {{ item.title }}
          </RouterLink>
        </div>
        <AppForm
          :value="form"
          :validation-errors
          @validation="(value) => v$=value"
          @submit.prevent="fetchSearchUser"
        >
          <div class="border rounded-3xl p-6 my-4 flex flex-col gap-y-1.5">
            <TransitionGroup
              :name="activeTab>defaultTab ? 'nested' : 'nested-reverse'"
              :duration="{ enter: 1000, leave: 2000 }"
            >
              <AppInput
                v-if="activeTab === TABS.PINFL"
                v-model="form.pinfl"
                type="number"
                custom-type="text"
                prop="pinfl"
                placeholder="Введите"
                label="ПИНФЛ"
                label-class="text-[#A8AAAE] text-xs"
                required
                :min="14"
                :max="14"
                :mask="'#'.repeat(14)"
              />
              <AppInput
                v-else
                v-model="form.pass_number"
                custom-type="passport"
                prop="pass_number"
                placeholder="Введите"
                label="Серия и номер паспорта"
                label-class="text-[#A8AAAE] text-xs"
                required
              />
            </TransitionGroup>
            <AppDatePicker
              v-model="form.birthday"
              :default-value="minAge"
              prop="birthday"
              label="Дата рождения"
              placeholder="дд.мм.гггг"
              :disabled-date
              label-class="text-[#A8AAAE] text-xs"
              required
            />
          </div>
          <ElButton
            :loading="userStore.searchUserLoading"
            type="primary"
            size="large"
            class="custom-apply-btn ml-auto"
            @click="fetchSearchUser"
          >
            Найти
          </ElButton>
        </AppForm>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.tab-icon--no-active * {
  fill: #A8AAAE;
}
</style>
