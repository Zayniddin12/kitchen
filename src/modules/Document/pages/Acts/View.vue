<script
  setup
  lang="ts"
>

import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { computed, onMounted, watch } from "vue";
import { useDocumentStore } from "@/modules/Document/document.store";
import { useRoute } from "vue-router";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useUsersStore } from "@/modules/Users/users.store";
import { useI18n } from "vue-i18n";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const route = useRoute();

const { t } = useI18n();

const documentStore = useDocumentStore();
const userStore = useUsersStore();

const { setBreadCrumb } = useBreadcrumb();

const title = computed(() => route.meta.title ?? "");

const isTranslate = computed(() => !!route.meta.isTranslate);

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "document.title1",
      isTranslate: true,
    },
    {
      label: "document.act.title2",
      isTranslate: true,
      to: { name: "acts" },
    },
    {
      label: title.value,
      isTranslate: isTranslate.value,
      isActionable: true,
    },
  ]);
};

onMounted(() => {
  setBreadCrumbFn();
  documentStore.fetchDocument(route.params.id as string);
});

const downloadPdf = async () => {
  const element = document.getElementById("pdf-content");
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("Document.pdf");
}
</script>

<template>
  <div class="flex items-start justify-center act-show">
    <AppOverlay
      :loading="documentStore.documentLoading"
      id="pdf-content"
      parent-class-name="w-[50%] min-w-[792px] border-[#E2E6F3] border rounded-[15px] px-[72px] pb-[50px] min-h-[100vh] "
    >
      <header class="flex items-center justify-center my-[24px] mb-6">
        <img
          src="@/assets/images/logo.svg"
          alt="logo"
        >
        <div class="flex flex-col ml-3">
          <b class="text-[#000D24] text-lg">{{
              t("logo.title")
            }}</b>
          <span class="text-[#CBCCCE]">{{
              t("logo.subtitle")
            }}</span>
        </div>
      </header>
      <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px]">
        {{ t("document.act.title") }}
      </h1>

      <div class="flex items-center justify-between">
        <div class="flex items-center mb-[24px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">№:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] block">
	          {{
              documentStore.document?.number ?? "-"
            }}
          </span>
        </div>

        <div class="flex items-center mb-[8px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">{{ t("common.date") }}:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] block">
	          {{
              documentStore.document?.date ?? "-"
            }}
          </span>
        </div>
      </div>

      <div class="text-[#4F5662] text-sm">
        {{
          documentStore.document?.content ?? "-"
        }}
      </div>

      <div
        v-for="product in documentStore.document?.products"
        :key="product.id"
        class="bg-gray-50 p-6 rounded-[16px] mt-6 grid grid-cols-2 gap-6"
      >
        <div>
          <span class="text-blue-500">{{ t("product.name") }}</span>
          <p>{{
              product.name || "-"
            }}</p>
        </div>
        <div>
          <span class="text-blue-500">{{ t("product.quantity") }}</span>
          <p>{{
              product.quantity ?? 0
            }}</p>
        </div>
        <div>
          <span class="text-blue-500">{{ t("common.unitMeasurement") }}</span>
          <p>{{
              product.unit || "-"
            }}</p>
        </div>
        <div>
          <span class="text-blue-500">{{ t("document.act.numberDateAgreement") }}</span>
          <p>{{
              documentStore.document?.number
            }} {{ t("common.from") }} {{
              documentStore.document?.date
            }}</p>
        </div>
        <div>
          <span class="text-blue-500">
	          {{ t("document.consignmentNumberDate") }}
          </span>
          <p>
            <template v-if="documentStore.document?.invoice_number && documentStore.document?.invoice_date">
              {{
                documentStore.document.invoice_number
              }} {{ t("common.from") }} {{
                documentStore.document.invoice_date
              }}
            </template>
            <template v-else>-</template>
          </p>
        </div>
        <div>
          <span class="text-blue-500">
	          {{ t("product.manufacturer") }}
          </span>
          <p>
            {{
              product.parent_name || "-"
            }}
          </p>
        </div>
        <div>
          <span class="text-blue-500">
	          {{ t("common.supplier") }}
          </span>
          <p>
            {{
              documentStore.document?.from_name || "-"
            }}
          </p>
        </div>
        <div>
          <span class="text-blue-500">
	          {{ t("common.recipient") }}
          </span>
          <p>
            {{
              documentStore.document?.to_name ?? "-"
            }}
          </p>
        </div>
        <div>
          <span class="text-blue-500">
	          {{ t("common.transport") }}
          </span>
          <p>
            {{
              documentStore.document?.shipping_method || "-"
            }}
          </p>
        </div>
        <div>
          <span class="text-blue-500">
	          {{ t("licence.numberAndDate") }}
          </span>
          <p>
            <template v-if="documentStore.document?.details">
              {{
                documentStore.document.details.licence
              }}
              {{ t("common.from") }}
              {{
                documentStore.document.details.licence_date
              }}
            </template>
            <template v-else>-</template>
          </p>
        </div>
        <div>
          <span class="text-blue-500">
	          {{ t("document.numberAndDateOfTheConclusionOfTheSanitaryAndEpidemiologicalCenter") }}
          </span>
          <p>
            <template v-if="documentStore.document?.details">
              {{
                documentStore.document.details.sanitary
              }}
              {{ t("common.from") }}
              {{
                documentStore.document.details.sanitary_date
              }}
            </template>
            <template v-else>-</template>
          </p>
        </div>
        <div>
          <span class="text-blue-500">
	          {{ t("document.numberAndDateOfVeterinaryCertificate") }}
          </span>
          <p>
            <template v-if="documentStore.document?.details">
              {{
                documentStore.document.details.vetirinary
              }}
              {{ t("common.from") }}
              {{
                documentStore.document.details.vetirinary_date
              }}
            </template>
            <template v-else>-</template>
          </p>
        </div>
        <div>
          <span class="text-blue-500">
	          {{ t("document.numberAndDateOfQualityCertificate") }}
          </span>
          <p>
            <template v-if="documentStore.document?.details">
              {{
                documentStore.document.details.quality
              }}
              {{ t("common.from") }}
              {{
                documentStore.document.details.quality_date
              }}
            </template>
            <template v-else>-</template>
          </p>
        </div>
      </div>
      <div
        class="mt-[40px] flex items-center justify-between gap-x-6"
        v-for="(singer,index) in documentStore.document?.singers"
        :key="singer.id"
      >
        <p class=" text-sm text-[#4F5662] font-medium w-[18%]">
          {{ index == 0 ? t("document.commission.commodityExpert") : index == 1 ? t("document.commission.warehouseManager") : index == 2 ? t("document.commission.warehouseManager") : ""
          }}:
        </p>
        <img
          src="@/assets/images/icons/qr.svg"
          alt="qr"
        />
        <p class="text-[#A8AAAE] text-sm w-[22%]">{{
            userStore.getUserFullName(singer) || "-"
          }}</p>
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
        {{ t("method.send") }}
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
        {{ t("method.seal") }}
      </ElButton>
      <ElButton
        :loading="documentStore.pdfLoading"
       @click="downloadPdf"
        plain
        text
        bg
        class="custom-white-btn w-full h-11 !ml-0"
      >
<!--        @click="documentStore.getPdf(route.params.id as string)"-->
        <img
          src="@/assets/images/icons/download.svg"
          alt="plane"
          class="mr-[12px]"
        />
        {{ t("method.download") }}
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
