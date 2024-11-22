import { ChartType } from "@/modules/Home/components/charts/chart.types";

export interface AnalyticsCardDataType {
    value: number,
    name: string,
}

export interface AnalyticsCardPropsType extends ChartType {
    icon: string,
    data: AnalyticsCardDataType[],
}