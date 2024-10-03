import type { ElFormItemType } from "@/components/ui/form/form.type";

export type AppTimePickerValueType = number | string | Date | [Date, Date] | [number, number] | [string, string];

export interface AppTimePickerPropsType extends ElFormItemType {
  editable?: boolean,
  startPlaceholder?: string,
  endPlaceholder?: string,
  isRange?: boolean,
  arrowControl?: boolean,
  popperClass?: string,
  rangeSeparator?: string,
  format?: string,
  defaultValue?: Date | [Date, Date],
  valueFormat?: string,
  prefixIcon?: string,
  disabledHours?: (role: string, comparingDate?: any) => number[],
  disabledSeconds?: (hour: number, minute: number, role: string, comparingDate?: any) => number[],
  teleported?: boolean,
  emptyValues?: [],
  id?: string | [string, string],
}