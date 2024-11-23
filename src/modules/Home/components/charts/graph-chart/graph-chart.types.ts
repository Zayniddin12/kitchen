import { ChartType } from "@/modules/Home/components/charts/chart.types";
import { GraphProductsType, ManagementIdType } from "@/modules/Home/statistics.types";

export interface GraphChartPropsType extends ChartType {
    data: GraphProductsType
}