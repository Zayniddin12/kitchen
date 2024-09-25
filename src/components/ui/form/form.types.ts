export interface FormItemType {
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
}

export interface ElFormItemType extends FormItemType {
    size?: "large" | "small",
    clearable?: boolean,
    name?: string,
    suffixIcon?: string,
    labelPosition?: "left" | "right" | "top",
    prop?: string | string[]
}