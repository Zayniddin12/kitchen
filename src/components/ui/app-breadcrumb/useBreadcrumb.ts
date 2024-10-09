import { ref } from "vue";
import type { BreadcrumbType } from "@/components/ui/app-breadcrumb/app-breadcrumb.type";

const breadcrumb = ref<BreadcrumbType>([]);

export default () => {
  const setBreadCrumb = (crumb: BreadcrumbType) => {
    breadcrumb.value = crumb;
  };

  return {
    breadcrumb,
    setBreadCrumb,
  };
}