<script setup lang="ts">
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useDocumentStore } from "@/modules/Document/document.store";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import { useAuthStore } from "@/modules/Auth/auth.store";
import QrCode from "@/components/workplaces/qr-code/QrCode.vue";
import { useI18n } from "vue-i18n";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const route = useRoute();

const routeId = computed<string>(() => route.params.id as string);

const title = computed(() => route.meta.title ?? "");

const isTranslate = computed(() => !!route.meta.isTranslate);

const { t, locale } = useI18n();

const documentStore = useDocumentStore();
const authStore = useAuthStore();

const { setBreadCrumb } = useBreadcrumb();

const setBreadCrumbFn = () => {
  setBreadCrumb([
    {
      label: "document.title1",
      isTranslate: true,
    },
    {
      label: route.meta.documentTitle ?? "",
      isTranslate: !!route.meta.documentTitleIsTranslate,
    },
    {
      label: String(route.meta?.parentRouteTitle ?? ""),
      to: route.meta.parentRouteUrl,
      isTranslate: route.meta.parentRouteIsTranslate,
    },
    {
      label: "common.view",
      isActionable: true,
      isTranslate: true,
    },
  ]);
};

watch(() => route.name, () => {
  setBreadCrumbFn();
}, { immediate: true });

watch(() => route.params.id, (newId) => {
  if (newId) documentStore.fetchDocument(newId as string);
}, { immediate: true });

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
  <div class="flex items-start justify-center gap-x-6">
    <div class="w-[50%]" id="pdf-content">
      <AppOverlay
        :loading="documentStore.documentLoading"
        :rounded="15"
        class="border-[#E2E6F3] border rounded-[15px] px-[72px] pb-[150px]"
      >
        <header class="flex items-center justify-center my-[24px] mb-6">
          <img
            src="@/assets/images/logo.svg"
            alt="logo"
          >
          <div class="flex flex-col ml-3">
            <b class="text-[#000D24] text-lg">{{ t("logo.title") }}</b>
            <span class="text-[#CBCCCE]">{{ t("logo.subtitle") }}</span>
          </div>
        </header>
        <h1 class="text-[#000D24] font-bold text-[20px] text-center mb-[24px] uppercase">
          {{ isTranslate ? t(title) : title }}
        </h1>

        <div class="flex items-center mb-[8px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">{{ t("common.date") }}:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ documentStore.document?.date ?? "-"
            }}</span>
        </div>

        <div class="flex items-center mb-[24px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">№:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ documentStore.document?.number ?? "-"
            }}</span>
        </div>

        <div class="flex items-baseline mb-[24px]">
          <h1 class=" text-[14px] font-medium">
            <span class="text-[#4F5662]">{{ t("document.whom.to") }}:</span>
            <span class="text-[#A8AAAE] ml-2">{{ documentStore.document?.to_name ?? "-" }}</span>
          </h1>
        </div>

        <div class="flex items-center mb-[24px]">
          <h1 class="text-[#4F5662] text-[14px] font-medium">{{ t("common.theme") }}:</h1>
          <span class="ml-2 text-[#A8AAAE] text-[14px] font-medium block">{{ documentStore.document?.subject ?? "-"
            }}</span>
        </div>

        <div class="text-[#4F5662] text-[14px]">
          {{ documentStore.document?.content ?? "-" }}
        </div>

        <div class="mt-[40px] grid grid-cols-3 items-center">
          <div class="flex items-baseline">
            <h1 class=" text-[14px] font-medium">
              <span class="text-[#4F5662]">{{ t("common.sender") }}:</span>
              <span class="text-[#A8AAAE] ml-2">{{ documentStore.document?.from_role_title ?? "-" }}</span>
            </h1>
          </div>

          <div class="flex items-center justify-center">
            <img v-if="documentStore.document?.qr" :src="documentStore.document.qr" alt="" width="120" height="120">
          </div>
          <h1 class="text-[#A8AAAE] text-[14px]">{{ documentStore.document?.from_name ?? "-" }}</h1>
        </div>
      </AppOverlay>

      <div
        v-if="(route.meta?.hasRejectBtn || route.meta?.hasAcceptBtn || route.meta?.hasCancelBtn) && (documentStore.document?.status === 'sent' || documentStore.document?.status === 'pending')"
        class="flex items-center justify-end mt-6 gap-x-4"
      >
        <ElButton
          :loading="documentStore.rejectLoading"
          @click="documentStore.changeDocumentStatus('rejected', routeId)"
          text
          bg
          plain
          size="large"
          v-if="route.meta?.hasRejectBtn"
          class="custom-cancel-btn h-[41px]"
        >
          {{ t("method.reject") }}
        </ElButton>
        <ElButton
          :loading="documentStore.approveLoading"
          @click="documentStore.changeDocumentStatus('approved', routeId)"
          type="success"
          size="large"
          v-if="route.meta?.hasAcceptBtn"
          class="custom-send-btn h-[41px] !ml-0"
        >
          {{ t("method.accept") }}
        </ElButton>
        <ElButton
          :loading="documentStore.cancelLoading"
          @click="documentStore.changeDocumentStatus('cancelled', routeId)"
          type="danger"
          size="large"
          v-if="route.meta?.hasCancelBtn"
          class="custom-danger-btn h-[41px] !ml-0"
        >
          {{ t("method.recall") }}
        </ElButton>
      </div>
    </div>

    <button class="custom-white-btn w-[260px]" @click="downloadPdf">
      <img
        class="mr-4"
        src="@/assets/images/download.svg"
        alt="download"
      />
      {{ t("method.download") }}
    </button>
  </div>
</template>
