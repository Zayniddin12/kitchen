<script
  setup
  lang="ts"
>
import {computed, onMounted, ref} from "vue";
import AppInput from "@/components/ui/form/app-input/AppInput.vue";
import useBreadcrumb from "@/components/ui/app-breadcrumb/useBreadcrumb";
import {useDocumentStore} from "@/modules/Document/document.store";
import {useRoute} from "vue-router";
import AppOverlay from "@/components/ui/app-overlay/AppOverlay.vue";
import {DocumentProductType, DocumentType} from "@/modules/Document/document.types";
import {formatDate2, formatNumber} from "@/utils/helper";
import {useI18n} from "vue-i18n";

const route = useRoute();

const {t} = useI18n();

const documentStore = useDocumentStore();

const title = computed(() => route.meta.title ?? "");

const isTranslate = computed(() => !!route.meta.isTranslate);

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

const {setBreadCrumb} = useBreadcrumb();

const setBreadCrumbFn = () => {
	setBreadCrumb([
		{
			label: "document.title1",
			isTranslate: true,
		},
		{
			label: "document.contract",
			isTranslate: true,
			to: {name: "contracts"}
		},
		{
			label: title.value,
			isTranslate: isTranslate.value,
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
  <h1 class="m-0 font-semibold text-[32px]">
	  {{ isTranslate ? t(title) : title }}
  </h1>
  <AppOverlay
    :loading="documentStore.documentLoading"
    parent-class-name="border rounded-[24px] p-6 mt-6 pb-8 min-h-[65vh]"
  >
    <div class="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-[16px]">
      <div>
        <span class="text-blue-500">{{ t("document.contractNumber") }}</span>
        <p>{{ documentStore.document?.number ?? "—" }}</p>
      </div>

      <div>
        <span class="text-blue-500">{{ t("common.supplier") }}</span>
        <p>{{ documentStore.document?.from_name }}</p>
      </div>
    </div>

    <el-table
      :data="documentStore.document?.products ?? []"
      stripe
      class="custom-element-table custom-element-table--has-append mt-6"
      :empty-text="t('common.empty')"
    >
      <el-table-column
        prop="name"
        :label="t('common.name')"
      />
      <el-table-column
        prop="quantity"
        :label="t('common.quantity')"
      />
      <el-table-column
        prop="unit"
        :label="t('common.measurement')"
      />
      <el-table-column
        prop="price"
        :label="t('common.price')"
      />
      <el-table-column
        prop="sum"
        :label="t('common.sum')"
      >
        <template #default="{row}:{row:DocumentType}">
          {{ formatNumber(row.quantity * row.price) }} {{ t('currency.sum') }}
        </template>
      </el-table-column>
      <template
        v-if="productsSum"
        #append
      >
        <div class="flex items-center justify-end p-4">
          <h1 class="text-[#8F9194] text-sm font-bold mr-[5px]">
            {{ t("common.totalSum") }}:
          </h1>
          <h1 class="text-[#000D24] text-sm font-bold mr-5">
            {{ formatNumber(productsSum) }} {{ t('currency.sum') }}
          </h1>
        </div>
      </template>
    </el-table>
  </AppOverlay>
</template>

