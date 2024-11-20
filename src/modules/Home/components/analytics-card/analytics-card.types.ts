export interface AnalyticsCardDataType {
    value: number,
    name: string,
}

export interface AnalyticsCardPropsType {
    icon: string,
    title: string,
    subtitle: string,
    data: AnalyticsCardDataType[],
    loading?: boolean,
}