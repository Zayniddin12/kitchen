<script setup lang="ts">
import axios from "axios";
import { useI18n } from "vue-i18n";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { ElNotification } from "element-plus";

const { t } = useI18n();

const route = useRoute();
const docData = ref<any>(null);

onMounted(async () => {

  const paramId = route.params.id;

  if (paramId) {
    try {
      const { data } = await axios.get(`https://wms-api.ngmkfond.uz/api/v1/documents/${paramId}/signer-info`, {
        headers: {
          "x-app-lang": "uz",
        },
      });

      docData.value = data.data ?? {};
    } catch (e) {
      ElNotification({
        title: "Error",
        message: e.message,
        type: "error",
      });
    }
  }


});


const fullUrl = computed(() => window.location.origin + route.fullPath);
</script>

<template>
  <div class="max-w-screen-md  container px-6 mx-auto">
    <div>
      <header class="flex items-center justify-center my-[24px] mb-6">
        <img
          src="@/assets/images/logo.svg"
          alt="logo"
        />
        <div class="flex flex-col ml-3">
          <b class="text-[#000D24] text-lg">
            {{ t("logo.title") }}
          </b>
          <span class="text-[#CBCCCE]">
                  {{ t("logo.subtitle") }}
                </span>
        </div>
      </header>


      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Tizim manzili:
        </h2>
        <span class="ml-2 text-[#4F5662] text-sm font-medium block">
              {{ fullUrl }}
              </span>
      </div>

      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Vaqti:
        </h2>
        <span class="ml-2 text-[#4F5662] text-sm font-medium block">
        {{ docData?.sign_data?.signed_at ?? "-" }}
              </span>
      </div>

      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Imzolovchi:
        </h2>
        <span class="ml-2 text-[#4F5662] text-sm font-medium block">
           {{ docData?.sign_data?.signer_name ?? "-" }}
              </span>
      </div>

      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Lavozimi: <span class="ml-2 text-[#4F5662] text-sm font-medium">
       {{ docData?.sign_data?.role_title ?? "-" }}
              </span>
        </h2>

      </div>

      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Hujjat turi:
        </h2>
        <span class="ml-2 text-[#4F5662] text-sm font-medium block">
     {{ docData?.sign_data?.doc_type ?? "-" }}
              </span>
      </div>

      <div class="flex mb-[24px]">
        <h2 class="text-[#A8AAAE] text-sm font-medium">
          Hujjat №:
        </h2>
        <span class="ml-2 text-[#4F5662] text-sm font-medium block">
{{ docData?.sign_data?.number ?? "-" }}
              </span>
      </div>

    </div>
  </div>
</template>