import { ElFormItemType } from "@/components/ui/form/form.types";
import { CSSProperties, InputTypeHTMLAttribute } from "vue";

export type AppInputValueType = string | number | null;

interface AutoSizeType {
    minRows?: number,
    maxRows?: number
}

export interface AppInputPropsType extends ElFormItemType {
    type?: InputTypeHTMLAttribute,
    formatter?: (value: string | number) => string,
    parser?: (value?: string) => string,
    showPassword?: boolean,
    prefixIcon?: string,
    rows?: number,
    autosize?: boolean | AutoSizeType,
    maxlength?: string | number,
    minlength?: string | number,
    showWordLimit?: boolean,
    inputStyle?: string | CSSProperties | CSSProperties[] | string[],
    mask?: string
}``