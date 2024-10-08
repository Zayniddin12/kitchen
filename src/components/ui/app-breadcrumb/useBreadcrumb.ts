import { onUnmounted, ref, watch } from "vue";
import { BreadcrumbType } from "@/components/ui/app-breadcrumb/app-breadcrumb.type";
import { useRoute } from "vue-router";

const breadcrumb = ref<BreadcrumbType>([]);
const route = useRoute();

export default () => {
  const setBreadCrumb = (crumb: BreadcrumbType) => {
    breadcrumb.value = crumb;
  };

  return {
    breadcrumb,
    setBreadCrumb,
  };
}