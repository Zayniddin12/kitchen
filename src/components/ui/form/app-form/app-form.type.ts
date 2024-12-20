import { ElFormItemLabelPosition, ElFormItemSize, ValidationErrorsType } from "@/components/ui/form/form.type";

export interface AppFormPropsType {
    value?: Record<string, any>,
    size?: ElFormItemSize,
    labelPosition?: ElFormItemLabelPosition,
    statusIcon?: boolean,
    validationErrors?: ValidationErrorsType,
    submit?: Function;
}

export interface ValidationType {
    validate: () => Promise<boolean>,
    clearValidate: () => void,
    resetForm: () => void,
    clear: () => void
}