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
import { AppInputValueType } from "@/components/ui/form/app-input/app-input.type";

enum TABS {
  PINFL = 1,
  PASSPORT
}

interface TabType {
  title: string;
  icon: string;
  value: 1 | 2;
}

const router = useRouter();
const route = useRoute();

const defaultTab = TABS.PINFL;

const tabs = ref<TabType[]>([
  {
    title: "ПИНФЛ",
    icon: "pinFl",
    value: TABS.PINFL
  },
  {
    title: "Серия и номер паспорта",
    icon: "seria",
    value: TABS.PASSPORT
  }
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
      label: "Кадры"
    },
    {
      label: String(route.meta?.parentRouteTitle ?? ""),
      to: route.meta?.parentRouteUrl
    },
    {
      label: "Добавить",
      isActionable: true
    }
  ]);
};

const userStore = useUsersStore();
const commonStore = useCommonStore();

const form = reactive<SearchUserDataType>({
  pinfl: "",
  pass_number: "",
  birthday: ""
});

const v$ = ref<ValidationType | null>(null);

const validationErrors = ref<Record<string, any> | null>(null);

const fetchSearchUser = async () => {
  if (!v$.value) return;

  if (!(await v$.value.validate())) {
    commonStore.errorToast("Validation Error");
    return;
  }

  const newForm: SearchUserDataType = activeTab.value === TABS.PINFL ? { pinfl: form.pinfl } : {
    ...form,
    pinfl: undefined
  };

  try {
    await userStore.fetchSearchUser(userStore.activeUserPage ? "users" : "employee", filterObjectValues(newForm));
    validationErrors.value = null;
  } catch (error: any) {
    if (error?.error?.code === 422) {
      validationErrors.value = error.meta.validation_errors;
    }
  }
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
                class="size-5"
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
          <TransitionGroup
              :name="activeTab>defaultTab ? 'nested' : 'nested-reverse'"
              :duration="{ enter: 1000, leave: 2000 }"
              tag="div"
              class="border rounded-3xl p-6 my-4 flex flex-col gap-y-1.5"
          >
            <AppInput
                v-if="activeTab === defaultTab"
                v-model="form.pinfl"
                type="number"
                prop="pinfl"
                placeholder="Введите"
                label="ПИНФЛ"
                label-class="text-[#A8AAAE] text-xs"
                required
                :min="14"
                :max="14"
                trigger="blur"
                :mask="'#'.repeat(14)"
            />
            <template v-else>
              <AppInput
                  v-model="form.pass_number"
                  prop="pass_number"
                  placeholder="Введите"
                  label="Серия и номер паспорта"
                  label-class="text-[#A8AAAE] text-xs"
                  required
                  :min="9"
                  :max="9"
                  trigger="blur"
                  :mask="{
                    mask: '@@#######',
                    tokens: {
                     'A': {
                        pattern: /[A-Z]/,
                       transform: (chr: string) => chr.toUpperCase(),
                       multiple: true
                     }
                    }
                  }"
              />
              <AppDatePicker
                  v-model="form.birthday"
                  prop="birthday"
                  label="Дата рождения"
                  placeholder="дд.мм.гггг"
                  label-class="text-[#A8AAAE] text-xs"
                  format="DD.MM.YYYY"
                  required
                  trigger="blur"
              />
            </template>
          </TransitionGroup>
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
.create-form {
  .el-input-group__prepend {
    background-color: transparent;
  }

  .el-input-group__append {
    color: #FFFFFF;
    background-color: #2E90FA;
  }
}
</style>
