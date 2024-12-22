<script
  setup
  lang="ts"
>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useUsersStore } from "@/modules/Users/users.store";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import Avatar from "@/assets/images/avatar.png";
import { formatDate2, phoneFormatter } from "@/utils/helper";
import { useCommonStore } from "@/stores/common.store";
import AppEmpty from "@/components/ui/app-empty/AppEmpty.vue";

interface Tabs {
  title: string;
  value: number;
}

const router = useRouter();
const route = useRoute();

const usersStore = useUsersStore();
const commonStore = useCommonStore();

const loading = computed(() => {
  return usersStore.activeUserPage ? usersStore.userLoading : usersStore.employeeLoading;
});

const data = computed(() => {
  return usersStore.activeUserPage ? usersStore.user : usersStore.employee;
});

const gender = computed(() => {
  if (!data.value) return null;

  return commonStore.getGender(data.value.gender);
});

const avatar = computed(() => {
  return data.value?.avatar_link ?? gender.value?.photo ?? "";
});

const fullName = computed(() => {
  return usersStore.activeUserPage ? usersStore.userFullName : usersStore.employeeFullName;
})

const routeId = computed(() => {
  return parseInt(route.params.id as string);
});

const faceIdImage = computed(() => data.value?.face_image_link ?? data.value?.avatar_link);

const tabs = ref<Tabs[]>([
  {
    title: "Данные кандидата",
    value: 0,
  },
  {
    title: "Фотография для Face ID",
    value: 1,
  },
]);
const activeTab = ref<number>(0);

const setActiveTab = (item: any) => {
  activeTab.value = item.value;
};

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Кадры",
    },
    {
      label: String(route.meta.parentRouteTitle ?? ""),
      to: route.meta.parentRouteUrl,
    },
    {
      label: "Просмотр",
      isActionable: true,
    },
  ]);
};

const fetchData = () => {
  usersStore.activeUserPage ? usersStore.fetchUser(routeId.value) : usersStore.fetchEmployee(routeId.value);
};

onMounted(() => {
  setBreadCrumbFn();
  fetchData();
});

</script>

<template>
  <div>
    <h1 class="m-0 font-semibold text-[32px]">Просмотр</h1>
    <div class="flex items-center justify-between">
      <div class="app-tabs w-[345px] my-6">
        <div
          v-for="item in tabs"
          :key="item.value"
          class="cursor-pointer"
          :class="['app-tab', {'app-tab--active': activeTab === item.value}]"
          @click="setActiveTab(item)"
        >
          {{ item.title }}
        </div>
      </div>

      <RouterLink
        :to="{name: `${usersStore.activeRoutePrefix}-edit`}"
        class="custom-cancel-btn flex items-center gap-2 text-[#4F5662] font-semibold !text-[18px]"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 20.0003H8L18.5 9.5003C19.6046 8.39573 19.6046 6.60487 18.5 5.5003C17.3954 4.39573 15.6046 4.39573 14.5 5.5003L4 16.0003V20.0003"
            stroke="#8F9194"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.5 6.5L17.5 10.5"
            stroke="#8F9194"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        Редактировать
      </RouterLink>
    </div>

    <AppOverlay
      :loading
      :loading-size="70"
      parent-class-name="border rounded-[24px] pb-[32px] overflow-hidden"
      v-if="activeTab === 0"
    >
      <div class="py-[70px] bg-[#F8F9FC] px-[24px] relative">
        <div class="top-[32px] absolute flex items-center">
          <div class="rounded-full overflow-hidden border-4 border-gray-100">
            <img
              v-if="avatar"
              :src="avatar"
              :alt="fullName || 'Profile Picture'"
              class="object-cover size-40 rounded-full"
            >
          </div>

          <div class="text-xl font-semibold text-gray-900 ml-[24px]">
            {{ fullName || "—" }}
          </div>
        </div>
      </div>

      <div class="px-[24px] mt-[90px]">
        <div class="bg-gray-50 p-6 rounded-[16px]">
          <h3 class="text-gray-500 mb-4">Основная информация</h3>
          <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <!-- Left Column -->
            <div>
              <span class="text-blue-500">Дата рождения:</span>
              <p>{{ data?.birthday ? formatDate2(new Date(data.birthday)) : "—" }}</p>
            </div>
            <div>
              <span class="text-blue-500">Национальность:</span>
              <p>{{ data?.nationality || "—" }}</p>
            </div>
            <div>
              <span class="text-blue-500">Пол:</span>
              <p>{{ gender?.name ?? "—" }}</p>
            </div>
            <div>
              <span class="text-blue-500">Серия и номер паспорта:</span>
              <p>{{ data?.pass_number || "—" }}</p>
            </div>
            <div>
              <span class="text-blue-500">Кем выдан:</span>
              <p>{{ data?.pass_given_by ?? "—" }}</p>
            </div>
            <div>
              <span class="text-blue-500">Дата выпуска:</span>
              <p>{{ data?.pass_given_at || "—" }}</p>
            </div>
            <div>
              <span class="text-blue-500">Срок действия:</span>
              <p>{{ data?.pass_valid_until ?? "—" }}</p>
            </div>
            <div>
              <span class="text-blue-500">ПИНФЛ:</span>
              <p>{{ data?.pinfl || "—" }}</p>
            </div>
            <div>
              <span class="text-blue-500">Номер телефона:</span>
              <p>{{ data?.phone ? phoneFormatter(data.phone) : "—" }}</p>
            </div>
            <template v-if="usersStore.activeUserPage">
              <div>
                <span class="text-blue-500">OneID:</span>
                <p>{{ data?.is_oneid_enabled ? "Есть" : "—" }}</p>
              </div>
              <div>
                <span class="text-blue-500">Должность в системе:</span>
                <p>{{ data?.position || "—" }}</p>
              </div>
              <div>
                <span class="text-blue-500">Роли:</span>
                <p>{{ data?.responsible_name || "—" }}</p>
              </div>
            </template>
            <template v-else>
              <div>
                <span class="text-blue-500">
                  График работы:
                </span>
                <p>
                  —
                </p>
              </div>
              <div>
                <span class="text-blue-500">
                  Место работы:
                </span>
                <p>
                  —
                </p>
              </div>
            </template>
          </div>
        </div>

        <div class="bg-gray-50 p-6 mt-[24px] rounded-[16px]">
          <h3 class="text-gray-500 mb-4">История сотрудника</h3>

          <div class="p-[16px] rounded-[8px] border mb-[16px]">
            Здесь будет текст
          </div>

          <div class="grid grid-cols-2 gap-8">
            <div>
              <span class="text-blue-500 mb-[4px] block">Дата и время изменения:</span>
              <p>28.09.2024</p>
            </div>

            <div>
              <span class="text-blue-500 mb-[4px] block">Кто внес изменение:</span>
              <p>{{ data?.responsible_name || "—" }}</p>
            </div>
          </div>
        </div>
      </div>
    </AppOverlay>

    <AppOverlay
      :loading
      parent-class-name="border rounded-[24px] py-[32px] px-[24px] w-[50%] m-auto relative"
      v-else
    >
      <!--      <button class="absolute top-2 left-2 opacity-0 group-hover:opacity-100  edit__btn transition-opacity duration-300 bg-blue-500 text-white px-4 py-2 rounded-lg">-->
      <!--        Изменить фото-->
      <!--      </button>-->
      <img
        v-if="faceIdImage"
        :src="faceIdImage"
        class="w-full h-[550px] object-contain rounded-[24px]"
        :alt="usersStore.employeeFullName ?? 'face id image'"
      />
      <AppEmpty
        class="!min-h-[50vh]"
        v-else
      />
    </AppOverlay>
  </div>
</template>

<style lang="scss">
.edit__btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 z-50;
}
</style>