import { InputTypeHTMLAttribute } from "vue";

export interface FormItemType {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
}

export interface RulesType {
  required?: boolean;
  min?: number;
  max?: number;
  type?: InputTypeHTMLAttribute;
  trigger?: "blur" | "change";
}

export interface ValidateRulesType extends RulesType {
  message?: string;
  validator?: any;
}

export type ElFormItemSize = "large" | "small";
export type ElFormItemLabelPosition = "left" | "right" | "top";

export interface ElFormItemType extends FormItemType, RulesType {
  size?: ElFormItemSize,
  clearable?: boolean,
  name?: string,
  suffixIcon?: string,
  labelPosition?: ElFormItemLabelPosition,
  prop?: string | string[],
  error?: string,
  labelClass?: string | string[] | {},
}

export type ValidationErrorsType = Record<string, any> | null;