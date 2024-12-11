import { ElFormItemType } from "@/components/ui/form/form.type";
import { Component, CSSProperties, InputTypeHTMLAttribute } from "vue";
import { MaskInputOptions } from "maska";

export type AppInputValueType = string | number | null;

interface AutoSizeType {
  minRows?: number,
  maxRows?: number
}

export type InputType = InputTypeHTMLAttribute | "passort";

export interface AppInputPropsType extends ElFormItemType {
  type?: InputType,
  customType?: InputType,
  formatter?: (value: string | number) => string,
  parser?: (value?: string) => string,
  showPassword?: boolean,
  prefixIcon?: string | Component,
  rows?: number,
  autosize?: boolean | AutoSizeType,
  maxlength?: string | number,
  minlength?: string | number,
  showWordLimit?: boolean,
  inputStyle?: string | CSSProperties | CSSProperties[] | string[],
  mask?: string | MaskInputOptions,
  prepend?: string,
  append?: string,
}

``;