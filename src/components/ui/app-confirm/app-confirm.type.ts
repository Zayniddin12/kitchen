export type ButtonStatusType = "primary" | "secondary" | "danger";
export type ButtonActionType = "confirm" | "cancel" | "save";
export type DefaultButtonType = "cancel" | "delete" | "show";
export type textType = string | HTMLElement;

export interface ButtonType {
  label: string;
  status: ButtonStatusType;
  action: ButtonActionType;
}

export type DefaultButtonTypes = Record<DefaultButtonType, ButtonType[]>;

export interface ConfirmParamsType {
  title?: textType;
  description?: textType;
  disabledBody?: boolean;
}

export interface ConfirmInitParamsType extends ConfirmParamsType {
  buttons?: ButtonType[];
}