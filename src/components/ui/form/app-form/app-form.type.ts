import { ElFormItemLabelPosition, ElFormItemSize } from "@/components/ui/form/form.type";

export interface AppFormPropsType {
    value?: Record<string, any>,
    size?: ElFormItemSize,
    labelPosition?: ElFormItemLabelPosition,
    statusIcon?: boolean
}

export interface ValidationType {
    validate: () => Promise<boolean>,
    clearValidate: () => void,
    resetForm: () => void
}