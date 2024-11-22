import { ChartType } from "@/modules/Home/components/charts/chart.types";
import { KitchenPreparationKitchenType } from "@/modules/Home/statistics.types";

export interface PreparationsChartPropsType extends ChartType {
    total_price?: number,
    percent: number,
    data: KitchenPreparationKitchenType[]
}