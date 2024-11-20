<script
    setup
    lang="ts"
>
import { computed, onMounted, ref, watchEffect } from "vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { useRoute } from "vue-router";
import { useDocumentStore } from "@/modules/Document/document.store";
import { formatDate2, formatNumber } from "@/utils/helper";
import { DocumentProductType, DocumentType } from "@/modules/Document/document.types";
import { useUsersStore } from "@/modules/Users/users.store";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";

const documentStore = useDocumentStore();
const userStore = useUsersStore();

const route = useRoute();

const routeId = computed<string>(() => route.params.id as string);

const productsSum = computed(() => {
  if (!documentStore.document) return 0;
  return documentStore.document.products.reduce((sum: number, product: DocumentProductType) => {
    return (
        sum +
        Number(
            product.price && product.quantity ? product.price * product.quantity : 0
        )
    );
  }, 0);
});

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "Документы"
    },
    {
      label: "Накладные"
    },
    {
      label: String(route.meta?.parentRouteTitle ?? ""),
      to: route.meta.parentRouteUrl
    },
    {
      label: "Просмотр",
      isActionable: true
    }
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  documentStore.fetchDocument(routeId.value);
});

</script>

<template>
  <div class="flex items-start justify-center">
    <div class="w-[55%]">
      <AppOverlay
          :loading="documentStore.documentLoading"
          :rounded="15"
          parent-class-name="border-[#E2E6F3] border rounded-[15px] px-[72px] pb-[70px]"
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
        <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-6">
          {{ route.name === "invoice-inbox-id" ? "НАКЛАДНОЙ" : "НАЗВАНИЕ ДОКУМЕНТА" }}</h1>
        <div class="flex items-center justify-between">
          <div class="flex items-center mb-[8px]">
            <h1 class="text-[#4F5662] text-[14px] font-medium">Дата создания в системе:</h1>
            <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">
            {{
                documentStore.document?.created_at ? formatDate2(new Date(documentStore.document.created_at)) : ""
              }}
          </span>
          </div>
        </div>

        <div class="flex items-center mb-6">
          <h1 class="text-[#4F5662] text-[14px] font-medium">№ накладной в системе:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">
            {{
              documentStore.document?.generated_number
            }}
          </span>
        </div>

        <div class="flex items-center mb-[8px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">Дата накладной:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ documentStore.document?.date }}</span>
        </div>

        <div class="flex items-center mb-6">
          <h1 class="text-[#4F5662] text-[14px] font-medium">№ накладной:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ documentStore.document?.number }}</span>
        </div>

        <div class="flex items-center mb-6">
          <h1 class="text-[#4F5662] text-[14px] font-medium">Вид документа:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ documentStore.document?.type }}</span>
        </div>

        <div class="flex items-center mb-6">
          <h1 class="text-[#4F5662] text-[14px] font-medium">От кого:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ documentStore.document?.from_name }}</span>
        </div>
        <div class="flex items-baseline mb-[8px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">Кому:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ documentStore.document?.to_name }}</span>
        </div>
        <div class="flex items-baseline mb-6">
          <h1 class="text-[#4F5662] text-[14px] font-medium">Через кого:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{
              documentStore.document?.through_whom
            }}</span>
        </div>

        <div class="flex items-center mb-[14px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">Основание:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ documentStore.document?.basis }}</span>
        </div>
        <div class="flex items-center mb-6">
          <h1 class="text-[#4F5662] text-[14px] font-medium">Способ отправления:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">
            {{
              documentStore.document?.shipping_method
            }}
          </span>
        </div>

        <el-table
            :data="documentStore.document?.products ?? []"
            stripe
            class="custom-element-table custom-element-table--has-append"
        >
          <el-table-column
              prop="name"
              label="Название"
          />
          <el-table-column
              prop="quantity"
              label="Количество"
          />
          <el-table-column
              width="160"
              prop="unit"
              label="Ед. измерения"
          />
          <el-table-column
              prop="price"
              label="Цена"
          />
          <el-table-column
              prop="sum"
              label="Сумма"
          >
            <template #default="{row}:{row:DocumentType}">
              {{ formatNumber(row.quantity * row.price) }} сум
            </template>
          </el-table-column>
          <template
              v-if="productsSum"
              #append
          >
            <div class="flex items-center justify-end p-4">
              <h1 class="text-[#8F9194] text-sm font-bold mr-[5px]">
                Общая сумма:
              </h1>
              <h1 class="text-[#000D24] text-sm font-bold mr-5">
                {{ formatNumber(productsSum) }} сум
              </h1>
            </div>
          </template>
        </el-table>
        <template v-if="route.name === 'invoice-outgoing-id'">
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
        </template>
      </AppOverlay>
      <div
          v-if="route.name === 'invoice-inbox-id' && documentStore.document?.status === 'sent' || documentStore.document?.status === 'pending'"
          class="flex items-center justify-end mt-6 gap-x-4"
      >
        <ElButton
            :loading="documentStore.rejectLoading"
            @click="documentStore.changeDocumentStatus('rejected', routeId)"
            text
            bg
            plain
            size="large"
            class="custom-cancel-btn h-[41px]"
        >
          Отклонить
        </ElButton>
        <ElButton
            :loading="documentStore.approveLoading"
            @click="documentStore.changeDocumentStatus('approved', routeId)"
            type="success"
            size="large"
            class="custom-send-btn h-[41px] !ml-0"
        >
          Принять
        </ElButton>
      </div>
    </div>
    <div class="flex flex-col gap-y-6 ml-4 w-[260px]">
      <button class="custom-white-btn w-full">
        <img
            src="@/assets/images/icons/plane.svg"
            alt="plane"
            class="mr-[12px]"
        />
        Отправить
      </button>
      <a
          v-if="route.name === 'invoice-inbox-id' && documentStore.document?.file_info && documentStore.document?.file_link"
          class="border rounded-[16px] py-3 px-4 flex items-start cursor-pointer min-w-[180px]"
          :href="documentStore.document.file_link"
          target="_blank"
      >
        <img
            src="@/assets/images/icons/pdf2.svg"
            class="mr-[8px] mt-1"
            alt="pdf"
        />
        <span class="flex flex-col items-start">
              <span class="mb-[4px] text-[#000D24] text-[14px] font-medium">
                Накладной документ
              </span>
              <span class="text-[#A8AAAE] text-xs uppercase">{{
                  (documentStore.document.file_info.mimeType as string).replace("application/", "")
                }} | {{ documentStore.document.file_info.size }}</span>
            </span>
      </a>
    </div>
  </div>
</template>
