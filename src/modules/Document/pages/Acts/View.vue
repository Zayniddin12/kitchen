<script
  setup
  lang="ts"
>

import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { onMounted, watch } from "vue";
import { useDocumentStore } from "@/modules/Document/document.store";
import { useRoute } from "vue-router";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useUsersStore } from "@/modules/Users/users.store";

const route = useRoute();

const documentStore = useDocumentStore();
const userStore = useUsersStore();

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Документы",
    },
    {
      label: "Акты",
      to: { name: "acts" },
    },
    {
      label: "Просмотр",
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  documentStore.fetchDocument(route.params.id as string);
});

</script>

<template>
  <div class="flex items-start justify-center act-show">
    <AppOverlay
      :loading="documentStore.documentLoading"
      parent-class-name="w-[50%] min-w-[792px] border-[#E2E6F3] border rounded-[15px] px-[72px] pb-[50px] min-h-[75vh]"
    >
      <header class="flex items-center justify-center my-[24px] mb-6">
        <img
          src="@/assets/images/logo.svg"
          alt="logo"
        >
        <div class="flex flex-col ml-3">
          <b class="text-[#000D24] text-lg">NKMK</b>
          <span class="text-[#CBCCCE]">Jamg‘armasi</span>
        </div>
      </header>
      <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]">АКТ</h1>

      <div class="flex items-center justify-between">
        <div class="flex items-center mb-[24px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">№:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] block">{{ documentStore.document?.number }}</span>
        </div>

        <div class="flex items-center mb-[8px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">Дата:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] block">{{ documentStore.document?.date }}</span>
        </div>
      </div>

      <div class="text-[#4F5662] text-sm">
        {{ documentStore.document?.content }}
      </div>

      <div
        v-for="product in documentStore.document?.products"
        :key="product.id"
        class="bg-gray-50 p-6 rounded-[16px] mt-6 grid grid-cols-2 gap-6"
      >
        <div>
          <span class="text-blue-500">Название продукта</span>
          <p>{{ product.name || "-" }}</p>
        </div>
        <div>
          <span class="text-blue-500">Количество продукта</span>
          <p>{{ product.quantity ?? 0 }}</p>
        </div>
        <div>
          <span class="text-blue-500">Единица измерения</span>
          <p>{{ product.unit || "-" }}</p>
        </div>
        <div>
          <span class="text-blue-500">Номер и дата договора о поставке</span>
          <p>{{ documentStore.document?.number }} от {{ documentStore.document?.date }}</p>
        </div>
        <div>
          <span class="text-blue-500">
            Номер и дата накладной
          </span>
          <p>
            <template v-if="documentStore.document?.invoice_number && documentStore.document?.invoice_date">
              {{ documentStore.document.invoice_number }} от {{ documentStore.document.invoice_date }}
            </template>
            <template v-else>-</template>
          </p>
        </div>
        <div>
          <span class="text-blue-500">
            Производитель продукта
          </span>
          <p>
            {{ product.parent_name || "-" }}
          </p>
        </div>
        <div>
          <span class="text-blue-500">
            Поставщик
          </span>
          <p>
            {{ documentStore.document?.from_name || "-" }}
          </p>
        </div>
        <div>
          <span class="text-blue-500">
            Получатель
          </span>
          <p>
            {{ documentStore.document?.to_name }}
          </p>
        </div>
        <div>
          <span class="text-blue-500">
            Транспорт
          </span>
          <p>
            {{ documentStore.document?.shipping_method || "-" }}
          </p>
        </div>
        <div>
          <span class="text-blue-500">
            Номер и дата лицензии
          </span>
          <p>
            <template v-if="documentStore.document?.details">
              {{ documentStore.document.details.licence }} от
              {{ documentStore.document.details.licence_date }}
            </template>
            <template v-else>-</template>
          </p>
        </div>
        <div>
          <span class="text-blue-500">
            Номер и дата заключение Санитарно-эпидемиологического центра
          </span>
          <p>
            <template v-if="documentStore.document?.details">
              {{ documentStore.document.details.sanitary }} от
              {{ documentStore.document.details.sanitary_date }}
            </template>
            <template v-else>-</template>
          </p>
        </div>
        <div>
          <span class="text-blue-500">
            Номер и дата удостоверения ветеринарии
          </span>
          <p>
            <template v-if="documentStore.document?.details">
              {{ documentStore.document.details.vetirinary }} от
              {{ documentStore.document.details.vetirinary_date }}
            </template>
            <template v-else>-</template>
          </p>
        </div>
        <div>
          <span class="text-blue-500">
            Номер и дата удостоверения качества
          </span>
          <p>
            <template v-if="documentStore.document?.details">
              {{ documentStore.document.details.quality }} от
              {{ documentStore.document.details.quality_date }}
            </template>
            <template v-else>-</template>
          </p>
        </div>
      </div>
      <div
        class="mt-[40px] flex items-center justify-between gap-x-6"
        v-for="singer in documentStore.document?.singers"
        :key="singer.id"
      >
        <p class=" text-sm text-[#4F5662] font-medium w-[18%]">
          Кладовщик:
        </p>
        <img
          src="@/assets/images/icons/qr.svg"
          alt="qr"
        />
        <p class="text-[#A8AAAE] text-sm w-[22%]">{{ userStore.getUserFullName(singer) || "-" }}</p>
      </div>
    </AppOverlay>

    <div class="ml-6 w-[260px] flex flex-col gap-y-2">
      <ElButton
        plain
        text
        bg
        class="custom-white-btn w-full h-11"
      >
        <img
          src="@/assets/images/icons/plane.svg"
          alt="plane"
          class="mr-[12px]"
        />
        Отправить
      </ElButton>
      <ElButton
        plain
        text
        bg
        class="custom-white-btn w-full h-11 !ml-0"
      >
        <img
          src="@/assets/images/icons/print.svg"
          alt="plane"
          class="mr-[12px]"
        />
        Печать
      </ElButton>
      <ElButton
        :loading="documentStore.pdfLoading"
        @click="documentStore.getPdf(route.params.id as string)"
        plain
        text
        bg
        class="custom-white-btn w-full h-11 !ml-0"
      >
        <img
          src="@/assets/images/icons/download.svg"
          alt="plane"
          class="mr-[12px]"
        />
        Скачать
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss">
.act-show {
  &-table {
    tr * {
      @apply first:border-r-0;
    }

    tr:not(:last-child) * {
      @apply border-b-0;
    }

    tr:first-child * {
      @apply first:rounded-tl-[15px] last:rounded-tr-[15px];
    }

    tr:last-child * {
      @apply first:rounded-bl-[15px] last:rounded-br-[15px];
    }
  }
}
</style>
