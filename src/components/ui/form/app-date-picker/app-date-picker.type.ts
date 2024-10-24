import { ElFormItemType } from "@/components/ui/form/form.type";
import { DatePickType } from "element-plus";

export type AppDatePickerValueType = number | string | Date | [Date, Date] | [string, string];

export interface AppDatePickerPropsType extends ElFormItemType {
    editable?: boolean,
    startPlaceholder?: string,
    endPlaceholder?: string,
    type?: DatePickType,
    format?: string,
    popperClass?: string,
    popperOptions?: Partial<any>,
    rangeSeparator?: string,
    defaultValue?: Date | [Date, Date],
    defaultTime?: Date | [Date, Date],
    valueFormat?: string,
    id?: string | [string, string],
    unlinkPanels?: boolean,
    icon?: string,
    disabledDate?: (date: Date) => boolean,
    cellClassName?: (date: Date) => string,
    teleported?: boolean,
    emptyValues?: any[],
    iconPosition?: "start" | "end",
}