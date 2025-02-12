<script
  setup
  lang="ts"
>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import useConfirm from "@/components/ui/app-confirm/useConfirm";
import { useSettingsStore } from "@/modules/Settings/store";
import { ElNotification } from "element-plus";
import AppForm from "@/components/ui/form/app-form/AppForm.vue";
import { ValidationType } from "@/components/ui/form/app-form/app-form.type";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useI18n } from "vue-i18n";

interface DataValue {
  name: string;
  address: string;
  tin: string;
  status: string;
}

const v$ = ref<ValidationType | null>(null);
const setValidation = (value: ValidationType) => {
  v$.value = value;
};

const {t} = useI18n()
const store = useSettingsStore();
const route = useRoute();
const router = useRouter();
const { setBreadCrumb } = useBreadcrumb();
const { confirm } = useConfirm();
const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Настройки",
    },
    {
      label: "Справочники",
      to: { name: "reference" },
    },

    {
      label: "Поставщики и организации",
      to: { name: "reference" },
    },

    {
      label: "Организации",
      to: { name: "reference-organization" },
    },
    {
      label: t(String(route?.meta?.breadcrumbItemTitle ?? "")),
      isActionable: true,
    },
  ]);
};

const status = ref<boolean>(true);
const dataValue = ref<DataValue>({
  name: "",
  address: "",
  tin: "",
  status: "active",
});
const loading = ref<boolean>(false);

onMounted(async () => {
  if (route.params.id) {
    loading.value = true;
    try {
      const data = await store.GET_ORGANIZATION_DETAIL(route.params.id as string | number);
      if (data && data.organization) {
        dataValue.value = data.organization;

        status.value = data.organization.status === "active";
      }
    } catch (e) {
      loading.value = false;
    }
    loading.value = false;
  }
});

const cancelFn = () => {
  confirm.cancel().then(response => {
    router.push({ name: "reference-organization" });
  });
};

const deleteFn = () => {
  confirm.delete().then(() => {
    store.DELETE_ORGANIZATION(route.params.id);
    router.push("/reference-organization");
    ElNotification({ title: "Success", type: "success" });
  });
};

const switchChange = async (): Promise<boolean> => {
  try {
    const response = await confirm.show();
    return true;
  } catch (error) {
    return false;
  }
};

const handleSubmit = async () => {
  if (!v$.value) return;

  if ((await v$.value.validate())) {
    try {
      const payload = dataValue.value as DataValue;

      if (route.params.id) {
        await store.UPDATE_ORGANIZATION({
          id: route.params.id as string | number,
          data: {
            name: payload.name,
            address: payload.address,
            tin: payload.tin,
            status: dataValue.value.status,
          },
        });
      } else {
        await store.CREATE_ORGANIZATION(payload);
      }
      ElNotification({ title: "Success", type: "success" });
      await router.push("/reference-organization");
    } catch (e) {
      ElNotification({ title: "Error", type: "error" });
    }
  }
};

const changeStatus = () => {
  if (status.value) {
    dataValue.value.status = "active";
  } else {
    dataValue.value.status = "inactive";
  }
};

const isDisabled = computed(() => {
  return route.name === "reference-organization-view";
});

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-[24px]">
      <h1 class="m-0 font-semibold text-[32px] leading-[48px]">{{ $t(route.meta.title) }}</h1>
    </div>

    <div class="flex gap-6">
      <div class="w-[70%]">
        <AppForm
          :value="dataValue"
          @validation="setValidation"
        >
          <AppOverlay
            :loading
            :rounded="16"
            parent-class-name="border border-[#E2E6F3] rounded-2xl p-[24px]"
            class="flex flex-col min-h-[55vh]"
          >
            <div class="grid grid-cols-2 gap-4">
              <app-input
                v-model="dataValue.name"
                :label="$t('common.name2')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                required
                prop="name"
                :disabled="isDisabled"
              />

              <app-input
                v-model="dataValue.address"
                :label="$t('common.legalAddress')"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                required
                prop="address"
                :disabled="isDisabled"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <app-input
                v-model="dataValue.tin"
                :label="$t('common.tin')"
                maxlength="9"
                :placeholder="$t('form.select')"
                label-class="text-[#A8AAAE] font-medium text-[12px]"
                class="w-full"
                prop="tin"
                :disabled="isDisabled"
              />
            </div>

            <ElSwitch
              v-if="route.params.id && !route.query.type"
              :active-text="$t('status.deactivation')"
              class="app-switch mt-auto"
              @change="changeStatus"
              v-model="status"
            />
            <!--              :before-change="switchChange"-->
          </AppOverlay>
        </AppForm>

        <div
          v-if="!route.query.type"
          class="flex items-center mt-[24px] "
          :class="!route.params.id ? 'justify-end' : 'justify-between'"
        >
          <button
            v-if="$can('delete', 'Button')"
            v-show="route.params.id"
            class="custom-danger-btn"
            @click="deleteFn"
          >
            {{$t('method.delete')}}
          </button>


          <div class="flex items-center gap-4">
            <button
              @click="cancelFn"
              class="custom-cancel-btn"
            >
              {{$t('method.cancel')}}
            </button>

            <button
              class="custom-apply-btn"
              @click="handleSubmit"
            >
              {{ $route.params.id ? $t('method.save') : $t('method.add') }}
            </button>
          </div>
        </div>
      </div>

      <div class="w-[30%]">
        <button
          @click="router.push({name: 'reference-organization-edit', params: {id: route.params.id}})"
          v-if="route.query.type == 'view'"
          class="flex items-center gap-4 bg-[#F8F9FC] py-[10px] px-[20px] rounded-[8px]"
        >
          <li
            :style="{
                  maskImage: 'url(/icons/edit.svg)',
                  backgroundColor: '#8F9194',
                  color: '#8F9194',
                  width: '20px',
                  height: '20px',
                  maskSize: '20px',
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat'
                   }"
          ></li>
          {{$t('method.edit')}}
        </button>
      </div>
    </div>
  </div>
</template>

