import { onUnmounted, ref } from "vue";
import { BreadcrumbType } from "@/components/ui/app-breadcrumb/app-breadcrumb.type";

const breadcrumb = ref<BreadcrumbType>([]);

export default () => {
  const setBreadCrumb = (crumb: BreadcrumbType) => {
    breadcrumb.value = crumb;
  };

  onUnmounted(() => {
    breadcrumb.value = [];
  });

  return {
    breadcrumb,
    setBreadCrumb,
  };
}