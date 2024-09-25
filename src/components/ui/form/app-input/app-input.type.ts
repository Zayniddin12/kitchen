import { ElFormItemType } from "@/components/ui/form/form.types";

export type AppInputValueType = string | number;

interface AutoSizeType {
    minRows?: number,
    maxRows?: number
}

export interface AppInputPropsType extends ElFormItemType {
    type?: string,
    formatter?: (value: string | number) => string,
    parser?: (value?: string) => string,
    showPassword?: boolean,
    prefixIcon?: string,
    rows?: number,
    autosize?: boolean | AutoSizeType,
    maxlength?: string | number,
    minlength?: string | number
}